
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const scraperApiKey = Deno.env.get('SCRAPER_API_KEY')!;

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

    // Parse the request body to get the LinkedIn profile URL
    const { profileUrl } = await req.json();
    
    if (!profileUrl) {
      return new Response(
        JSON.stringify({ error: 'LinkedIn profile URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use ScraperAPI to scrape the LinkedIn profile
    const scraperUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(profileUrl)}&render=true`;
    
    console.log(`Scraping LinkedIn profile: ${profileUrl}`);
    const response = await fetch(scraperUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Scraper API returned an error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Failed to scrape the profile. Scraper API returned: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const html = await response.text();

    // Basic extraction of posts from HTML
    // Note: This is a simplified approach - in production, use a more robust parser
    const postMatches = html.match(/<div class="post-content">(.+?)<\/div>/gs) || [];
    
    const posts = postMatches.map(match => {
      // Clean up HTML tags and extract text
      const text = match.replace(/<[^>]*>/g, ' ').trim();
      return { text };
    });

    // Store the scraped profile in Supabase
    const profileUsername = profileUrl.split('/in/')[1]?.split('/')[0] || 'unknown';
    
    try {
      // First check if a profile with this URL already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('linkedin_profiles')
        .select('id')
        .eq('profile_url', profileUrl)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing profile:', checkError);
      }

      // Use upsert to handle both insert and update cases
      const { data: profileData, error: profileError } = await supabase
        .from('linkedin_profiles')
        .upsert({
          id: existingProfile?.id, // Will be null for new profiles
          user_id: user.id,
          profile_url: profileUrl,
          username: profileUsername,
          last_scraped: new Date().toISOString(),
          posts_count: posts.length
        })
        .select('id')
        .single();

      if (profileError) {
        console.error('Error storing profile:', profileError);
        return new Response(
          JSON.stringify({ error: 'Failed to store profile data' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Store the scraped posts
      if (posts.length > 0 && profileData) {
        const postsWithProfileId = posts.map(post => ({
          profile_id: profileData.id,
          user_id: user.id,
          content: post.text,
          scraped_at: new Date().toISOString()
        }));

        const { error: postsError } = await supabase
          .from('linkedin_posts')
          .upsert(postsWithProfileId, { onConflict: 'profile_id,content' });

        if (postsError) {
          console.error('Error storing posts:', postsError);
          // Continue even if post storage fails
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'LinkedIn profile scraped successfully',
          profile: {
            url: profileUrl,
            username: profileUsername,
            posts_count: posts.length
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Database error: ' + dbError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in scrape-linkedin function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to scrape LinkedIn profile' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
