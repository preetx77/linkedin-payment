
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the JWT to ensure the user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const { prompt, referenceProfiles } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch reference posts if profiles are provided
    let referencePosts = [];
    if (referenceProfiles && referenceProfiles.length > 0) {
      const { data: posts, error } = await supabase
        .from('linkedin_posts')
        .select('content')
        .in('profile_id', referenceProfiles.map(profile => profile.id))
        .limit(10);

      if (error) {
        console.error('Error fetching reference posts:', error);
      } else {
        referencePosts = posts.map(post => post.content);
      }
    }

    // Prepare the context for Gemini API
    let systemPrompt = "You are an AI assistant that generates LinkedIn posts. Create a professional, engaging post about the following topic.";
    
    if (referencePosts.length > 0) {
      systemPrompt += " Use the style and tone of these reference posts:\n\n" + referencePosts.join("\n\n");
    }

    // Make request to Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `Generate a LinkedIn post about: ${prompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const geminiData = await geminiResponse.json();
    let generatedPost = "";
    
    if (geminiData.candidates && geminiData.candidates[0]?.content?.parts?.[0]?.text) {
      generatedPost = geminiData.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Failed to generate content from Gemini API");
    }

    // Store the generated post
    const { data: postData, error: postError } = await supabase
      .from('generated_posts')
      .insert({
        user_id: user.id,
        prompt: prompt,
        content: generatedPost,
        reference_profiles: referenceProfiles ? JSON.stringify(referenceProfiles) : null,
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (postError) {
      console.error('Error storing generated post:', postError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        post: generatedPost,
        postId: postData?.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-post function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate LinkedIn post' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
