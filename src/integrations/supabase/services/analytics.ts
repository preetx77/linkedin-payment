import { supabase } from '../client';
import type { Database } from '../types';

type Analytics = Database['public']['Tables']['analytics']['Row'];
type AnalyticsInsert = Database['public']['Tables']['analytics']['Insert'];
type AnalyticsUpdate = Database['public']['Tables']['analytics']['Update'];

export const analyticsService = {
  async createAnalytics(postId: string) {
    const analytics: AnalyticsInsert = {
      post_id: postId,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      click_through_rate: 0,
      engagement_rate: 0
    };

    const { data, error } = await supabase
      .from('analytics')
      .insert(analytics)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPostAnalytics(postId: string) {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('post_id', postId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateAnalytics(postId: string, updates: AnalyticsUpdate) {
    const { data, error } = await supabase
      .from('analytics')
      .update(updates)
      .eq('post_id', postId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserAnalytics(userId: string) {
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(`
        id,
        created_at,
        analytics (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'published');
    
    if (postsError) throw postsError;
    return posts;
  },

  async getAnalyticsSummary(userId: string) {
    const posts = await this.getUserAnalytics(userId);
    
    return posts.reduce((summary, post) => {
      const analytics = post.analytics;
      if (!analytics) return summary;

      return {
        totalViews: (summary.totalViews || 0) + analytics.views,
        totalLikes: (summary.totalLikes || 0) + analytics.likes,
        totalComments: (summary.totalComments || 0) + analytics.comments,
        totalShares: (summary.totalShares || 0) + analytics.shares,
        averageEngagementRate: posts.length > 0 
          ? (summary.averageEngagementRate || 0) + (analytics.engagement_rate / posts.length)
          : 0
      };
    }, {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      averageEngagementRate: 0
    });
  }
}; 