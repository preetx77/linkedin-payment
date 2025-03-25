import { supabase } from '../client';
import type { Database } from '../types';

export interface UserSettings {
  id: string;
  user_id: string;
  created_at: string;
  linkedin_token?: string;
  email_notifications: boolean;
  default_post_style?: string;
  favorite_creators: string[];
  theme: 'light' | 'dark';
  training_posts?: string[];
  last_trained_at?: string;
}

export type UserSettingsInsert = Omit<UserSettings, 'id' | 'created_at'>;

export type UserSettingsUpdate = Partial<UserSettingsInsert>;

export const userSettingsService = {
  async getUserSettings(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data;
  },

  async createUserSettings(settings: UserSettingsInsert) {
    const { data, error } = await supabase
      .from('user_settings')
      .insert(settings)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUserSettings(userId: string, updates: UserSettingsUpdate) {
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async initializeUserSettings(userId: string) {
    const defaultSettings: UserSettingsInsert = {
      user_id: userId,
      email_notifications: true,
      theme: 'dark',
      favorite_creators: [],
    };

    return this.createUserSettings(defaultSettings);
  },

  async updateLinkedInToken(userId: string, token: string) {
    return this.updateUserSettings(userId, {
      linkedin_token: token
    });
  },

  async toggleEmailNotifications(userId: string, enabled: boolean) {
    return this.updateUserSettings(userId, {
      email_notifications: enabled
    });
  },

  async updateTheme(userId: string, theme: 'light' | 'dark') {
    return this.updateUserSettings(userId, {
      theme
    });
  },

  async updateFavoriteCreators(userId: string, creators: string[]) {
    return this.updateUserSettings(userId, {
      favorite_creators: creators
    });
  }
}; 