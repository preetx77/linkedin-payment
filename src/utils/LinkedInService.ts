
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  reference_profiles?: string;
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
      const { data, error } = await supabase.functions.invoke('scrape-linkedin', {
        body: { profileUrl },
      });

      if (error) {
        console.error('Error scraping LinkedIn profile:', error);
        return { success: false, error: error.message || 'Failed to scrape profile' };
      }

      return { success: true, profile: data.profile };
    } catch (error) {
      console.error('Error in scrapeProfile:', error);
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
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
          title: 'Error',
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
      const { data, error } = await supabase.functions.invoke('generate-post', {
        body: { prompt, referenceProfiles },
      });

      if (error) {
        console.error('Error generating LinkedIn post:', error);
        return { success: false, error: error.message || 'Failed to generate post' };
      }

      return { 
        success: true, 
        post: data.post,
        postId: data.postId
      };
    } catch (error) {
      console.error('Error in generatePost:', error);
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
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
      const { data, error } = await supabase
        .from('generated_posts')
        .insert({
          content,
          prompt,
          reference_profiles: referenceProfiles.length > 0 ? JSON.stringify(referenceProfiles) : null,
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
