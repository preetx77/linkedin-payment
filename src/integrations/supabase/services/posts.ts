import { supabase } from '../client';
import type { Database } from '../types';

type Post = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];

export const postsService = {
  async createPost(post: PostInsert) {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updatePost(id: string, updates: PostUpdate) {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserPosts(userId: string, status?: 'draft' | 'published') {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async getPost(id: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletePost(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getDrafts(userId: string) {
    return this.getUserPosts(userId, 'draft');
  },

  async getPublishedPosts(userId: string) {
    return this.getUserPosts(userId, 'published');
  },

  async schedulePost(id: string, scheduledFor: string) {
    return this.updatePost(id, {
      scheduled_for: scheduledFor,
      status: 'published'
    });
  }
}; 