import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface LinkedInProfile {
  id: string;
  username: string;
  profile_url: string;
  posts_count: number;
  last_scraped: string;
}

export interface GeneratedPost {
  id: string;
  content: string;
  prompt: string;
  created_at: string;
  reference_profiles?: Json; // Changed from string to Json to match the database type
}

export const LinkedInService = {
  async scrapeProfile(profileUrl: string): Promise<{ success: boolean; profile?: LinkedInProfile; error?: string }> {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      // Call the scrape-linkedin edge function
      const response = await supabase.functions.invoke('scrape-linkedin', {
        body: { profileUrl },
      });

      if (response.error) {
        console.error('Error scraping LinkedIn profile:', response.error);
        return { 
          success: false, 
          error: response.error.message || 'Failed to scrape profile' 
        };
      }

      // Check for application-level errors returned with a 200 status
      if (response.data && response.data.error) {
        console.error('Application error:', response.data.error);
        return { 
          success: false, 
          error: response.data.error 
        };
      }

      return { 
        success: true, 
        profile: response.data.profile 
      };
    } catch (error) {
      console.error('Error in scrapeProfile:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      };
    }
  },

  async getProfiles(): Promise<LinkedInProfile[]> {
    try {
      const { data, error } = await supabase
        .from('linkedin_profiles')
        .select('*')
        .order('last_scraped', { ascending: false });

      if (error) {
        console.error('Error fetching LinkedIn profiles:', error);
        toast({
          title: "Error",
          description: 'Failed to fetch LinkedIn profiles',
          variant: 'destructive',
        });
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProfiles:', error);
      return [];
    }
  },

  async generatePost(prompt: string, referenceProfiles: LinkedInProfile[] = []): Promise<{ success: boolean; post?: string; postId?: string; error?: string }> {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      // Call the generate-post edge function
      const response = await supabase.functions.invoke('generate-post', {
        body: { prompt, referenceProfiles },
      });

      if (response.error) {
        console.error('Error generating LinkedIn post:', response.error);
        return { 
          success: false, 
          error: response.error.message || 'Failed to generate post' 
        };
      }

      // Check for application-level errors returned with a 200 status
      if (response.data && response.data.error) {
        console.error('Application error:', response.data.error);
        return { 
          success: false, 
          error: response.data.error 
        };
      }

      return { 
        success: true, 
        post: response.data.post,
        postId: response.data.postId
      };
    } catch (error) {
      console.error('Error in generatePost:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      };
    }
  },

  async getSavedPosts(): Promise<GeneratedPost[]> {
    try {
      const { data, error } = await supabase
        .from('generated_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch saved posts',
          variant: 'destructive',
        });
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSavedPosts:', error);
      return [];
    }
  },

  async savePost(content: string, prompt: string, referenceProfiles: LinkedInProfile[] = []): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      // Convert referenceProfiles array to JSON if needed
      const refProfiles = referenceProfiles.length > 0 ? JSON.stringify(referenceProfiles) : null;

      const { data, error } = await supabase
        .from('generated_posts')
        .insert({
          content,
          prompt,
          reference_profiles: refProfiles,
          user_id: session.user.id, // Adding the user_id which was missing
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving post:', error);
        return { success: false, error: error.message || 'Failed to save post' };
      }

      return { success: true, postId: data.id };
    } catch (error) {
      console.error('Error in savePost:', error);
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  },

  async deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('generated_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Error deleting post:', error);
        return { success: false, error: error.message || 'Failed to delete post' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deletePost:', error);
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  }
};
