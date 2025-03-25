import { supabase } from '../client';
import type { PostMetrics, PostEngagement, PostLearningData } from '../types';

class PostMetricsService {
  async trackEngagement(engagement: Omit<PostEngagement, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('post_engagement')
        .insert(engagement)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error tracking engagement:', error);
      throw error;
    }
  }

  async updateMetrics(postId: string, metrics: Partial<PostMetrics>) {
    try {
      const { data, error } = await supabase
        .from('post_metrics')
        .upsert({
          post_id: postId,
          ...metrics,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating metrics:', error);
      throw error;
    }
  }

  async getPostMetrics(postId: string): Promise<PostMetrics | null> {
    try {
      const { data, error } = await supabase
        .from('post_metrics')
        .select('*')
        .eq('post_id', postId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }

  async saveLearningData(learningData: Omit<PostLearningData, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('post_learning_data')
        .insert(learningData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving learning data:', error);
      throw error;
    }
  }

  async getUserSuccessfulPosts(userId: string, minSuccessScore = 0.7): Promise<PostLearningData[]> {
    try {
      const { data, error } = await supabase
        .from('post_learning_data')
        .select('*, engagement_metrics(*)')
        .eq('user_id', userId)
        .gte('success_score', minSuccessScore)
        .order('success_score', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching successful posts:', error);
      throw error;
    }
  }

  async calculateSuccessScore(metrics: PostMetrics): Promise<number> {
    // Weighted scoring algorithm
    const weights = {
      engagement_rate: 0.4,
      likes: 0.2,
      comments: 0.2,
      shares: 0.15,
      clicks: 0.05
    };

    // Normalize metrics to 0-1 range based on typical performance
    const normalizedScore = 
      (metrics.engagement_rate / 100) * weights.engagement_rate +
      Math.min(metrics.likes / 100, 1) * weights.likes +
      Math.min(metrics.comments / 50, 1) * weights.comments +
      Math.min(metrics.shares / 20, 1) * weights.shares +
      Math.min(metrics.clicks / 50, 1) * weights.clicks;

    return Math.min(normalizedScore, 1);
  }
}

export const postMetricsService = new PostMetricsService(); 