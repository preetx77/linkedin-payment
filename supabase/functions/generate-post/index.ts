
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
    let referenceAnalysis = "";
    if (referenceProfiles && referenceProfiles.length > 0) {
      console.log(`Fetching posts for ${referenceProfiles.length} reference profiles`);
      
      const { data: posts, error } = await supabase
        .from('linkedin_posts')
        .select('content')
        .in('profile_id', referenceProfiles.map(profile => profile.id))
        .limit(10);

      if (error) {
        console.error('Error fetching reference posts:', error);
      } else if (posts && posts.length > 0) {
        console.log(`Found ${posts.length} reference posts`);
        referencePosts = posts.map(post => post.content);
        
        // Generate reference analysis with Gemini
        // Updated API endpoint to use the AI API version
        const analysisResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { 
                    text: `Analyze the following LinkedIn posts and describe their common patterns, tone, style, and engagement techniques. Keep your analysis concise and focused on actionable insights that could be used to write a new LinkedIn post:\n\n${referencePosts.join('\n\n')}` 
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 600
            }
          })
        });
        
        const analysisData = await analysisResponse.json();
        if (analysisData.candidates && analysisData.candidates[0]?.content?.parts?.[0]?.text) {
          referenceAnalysis = analysisData.candidates[0].content.parts[0].text;
          console.log('Generated reference analysis');
        } else {
          console.error('Failed to generate reference analysis');
        }
      } else {
        console.log('No reference posts found');
      }
    }

    // Prepare the context for Gemini API
    let systemPrompt = "You are an AI assistant that generates professional and engaging LinkedIn posts.";
    
    if (referenceAnalysis) {
      systemPrompt += `\n\nHere's an analysis of reference LinkedIn posts to use as style guidance:\n${referenceAnalysis}`;
    } else if (referencePosts.length > 0) {
      systemPrompt += `\n\nHere are some reference LinkedIn posts to match the style:\n\n${referencePosts.join('\n\n')}`;
    }
    
    systemPrompt += "\n\nCreate a professional, engaging LinkedIn post with the following guidelines:";
    systemPrompt += "\n- Keep it under 1,300 characters (LinkedIn optimal length)";
    systemPrompt += "\n- Use a hook in the first line to capture attention";
    systemPrompt += "\n- Include 2-3 paragraphs with valuable insights";
    systemPrompt += "\n- Use line breaks to enhance readability";
    systemPrompt += "\n- End with a thoughtful question to encourage comments";
    systemPrompt += "\n- Incorporate relevant hashtags (3-5 maximum)";
    
    console.log('Making request to Gemini API');
    
    // Make request to Gemini API - updated API endpoint to use the AI API version
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
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
      console.error('Gemini API error response:', errorData);
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${JSON.stringify(errorData)}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiData = await geminiResponse.json();
    let generatedPost = "";
    
    if (geminiData.candidates && geminiData.candidates[0]?.content?.parts?.[0]?.text) {
      generatedPost = geminiData.candidates[0].content.parts[0].text;
      console.log('Successfully generated post');
    } else {
      console.error('Failed to generate content from Gemini API', geminiData);
      return new Response(
        JSON.stringify({ error: "Failed to generate content from Gemini API" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
      // Continue even if storing fails - we'll return the generated post anyway
    } else {
      console.log(`Stored generated post with ID: ${postData.id}`);
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
