import { GoogleGenerativeAI } from '@google/generative-ai';
import { userSettingsService } from '../supabase/services/userSettings';
import { postsService } from '../supabase/services/posts';
import { postMetricsService } from '../supabase/services/postMetrics';
import type { PostLearningData } from '../supabase/types';

// Types for our AI service
export type PostStyle = 'professional' | 'casual' | 'storytelling' | 'educational' | 'promotional';

export interface PostGenerationParams {
  idea: string;
  style?: string;
  referenceCreators?: string[];
  maxLength?: number;
}

export interface AIService {
  generatePost: (params: PostGenerationParams) => Promise<string>;
  trainStyle: (trainingPosts: string[]) => Promise<void>;
}

export class GeminiService implements AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private userId: string;

  constructor(apiKey: string, userId: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    console.log('Initializing Gemini service...');
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
    console.log('Model initialized:', this.model.model);
    this.userId = userId;
  }

  private generatePrompt(params: PostGenerationParams): string {
    const { idea, style, referenceCreators } = params;
    
    if (!idea) {
      throw new Error('Content idea is required');
    }

    // Base context about LinkedIn best practices
    const linkedInContext = `
You are an expert LinkedIn content strategist with years of experience in creating viral, engaging posts. Your task is to create a LinkedIn post about: "${idea}"

Follow these key LinkedIn best practices:
1. Hook: Start with a powerful first line that grabs attention within the first 2-3 words
2. Structure: Use short, scannable paragraphs (1-2 lines each)
3. Spacing: Add line breaks between paragraphs for better readability
4. Engagement: End with a clear call-to-action or thought-provoking question
5. Authenticity: Maintain a conversational yet professional tone
6. Emojis: Use emojis frequently (at least 1 emoji every 1-2 paragraphs) to make the post visually engaging
7. Hashtags: Include 3-5 relevant hashtags at the end
8. Length: Optimal length is 1000-1300 characters for maximum engagement

IMPORTANT: Start the post directly with the content. DO NOT include any preamble text like "Here's the post:" or "I will create a post about...". Just start with the actual post content.

Post Types and Their Patterns:
- Story posts: Start with a moment of tension 💫, build through challenges 🔄, end with resolution/learning ✨
- Professional insights: Lead with a surprising fact/statistic 📊, explain why it matters 💡, share actionable takeaways 🎯
- Educational content: Start with a common misconception ❌, provide clear explanation ✅, share practical application 🛠️
- Achievement posts: Balance humility with impact 🏆, focus on lessons learned 📚 and gratitude 🙏
- Industry trends: Begin with change impact 🌊, explain significance 🎯, offer unique perspective 🔍

Your task is to create a highly engaging LinkedIn post that follows these best practices while incorporating the following specific requirements:`;

    // Style-specific instructions
    const styleInstructions = {
      professional: "Create a polished, industry-focused post that demonstrates expertise while maintaining approachability. Use business-appropriate language but avoid corporate jargon. Include relevant professional emojis 💼 📈 🎯 💡 🤝",
      casual: "Write in a conversational, authentic tone while maintaining professional boundaries. Share personal insights or experiences that others can relate to. Use friendly emojis 😊 💫 🌟 💪 ✨",
      storytelling: "Craft a narrative arc with a hook, challenge, solution, and key takeaway. Focus on emotional connection while keeping it business-relevant. Use story-appropriate emojis 📖 🎬 🌅 💭 ⭐",
      educational: "Break down complex topics into clear, actionable insights. Use examples and analogies. Focus on practical value for the reader. Include learning-focused emojis 📚 ✏️ 💡 🎓 📝",
      promotional: "Soft-sell through value-first content. Focus 80% on value/insight and 20% on the promotional aspect. Maintain authenticity. Use engaging emojis 🚀 💎 🎉 ⭐ 🔥"
    };

    // Build the complete prompt
    let prompt = `${linkedInContext}

STYLE REQUIREMENTS:
${styleInstructions[style as PostStyle]}

FINAL OUTPUT REQUIREMENTS:
1. Start DIRECTLY with the post content - NO preamble or explanatory text
2. Use emojis frequently throughout the post (at least one emoji every 1-2 paragraphs)
3. Format with proper line breaks between paragraphs
4. End with relevant hashtags
5. Maximum length: ${params.maxLength || 1300} characters`;

    // Add reference creators if provided
    if (referenceCreators && referenceCreators.length > 0) {
      prompt += `\n\nINCORPORATE INSPIRATION FROM THESE CREATORS' STYLES:
${referenceCreators.join(', ')}`;
    }

    return prompt;
  }

  async trainStyle(trainingPosts: string[]): Promise<void> {
    if (!trainingPosts.length) {
      throw new Error('No training posts provided');
    }

    try {
      // Store the training posts in the user's settings
      await userSettingsService.updateUserSettings(this.userId, {
        training_posts: trainingPosts,
        last_trained_at: new Date().toISOString()
      });

      // When generating posts, we'll use these stored posts to inform the style
      return;
    } catch (error) {
      console.error('Error training style:', error);
      throw new Error('Failed to train AI on your style');
    }
  }

  private async generateWithStyle(prompt: string): Promise<string> {
    try {
      // Get user's settings including training posts
      const settings = await userSettingsService.getUserSettings(this.userId);
      const trainingPosts = settings?.training_posts || [];
      
      // Get user's successful posts with high engagement
      const successfulPosts = await postMetricsService.getUserSuccessfulPosts(this.userId);
      
      let styleContext = '';
      
      // If we have successful posts, use them as primary examples
      if (successfulPosts.length > 0) {
        const topPosts = successfulPosts
          .sort((a, b) => b.success_score - a.success_score)
          .slice(0, 3);
        
        styleContext += `Here are some of your most successful posts that received high engagement. Learn from their style and patterns:

${topPosts.map(post => `
POST (Success Score: ${Math.round(post.success_score * 100)}%):
${post.content}
Key Metrics: ${post.engagement_metrics.likes} likes, ${post.engagement_metrics.comments} comments, ${post.engagement_metrics.shares} shares
Topic: ${post.topic}
Tone: ${post.tone}
---`).join('\n')}`;
      }
      
      // If we have training posts, use them as additional style examples
      if (trainingPosts.length > 0) {
        styleContext += `\n\nAdditional style examples from your training posts:

${trainingPosts.slice(0, 2).join('\n\n---\n\n')}`;
      }
      
      // Get patterns from successful posts
      if (successfulPosts.length > 0) {
        const patterns = this.analyzeSuccessfulPosts(successfulPosts);
        styleContext += `\n\nKey patterns from your successful posts:
${patterns}`;
      }
      
      // If we have any style context, add it to the prompt
      if (styleContext) {
        prompt = `${styleContext}

Using these successful patterns and maintaining a similar writing style and tone, create a new post that follows these engagement patterns while addressing this prompt:

${prompt}`;
      }
      
      return prompt;
    } catch (error) {
      console.error('Error getting style context:', error);
      // If there's an error getting style context, just return the original prompt
      return prompt;
    }
  }

  private analyzeSuccessfulPosts(posts: PostLearningData[]): string {
    // Initialize pattern counters
    const patterns = {
      startsWithEmoji: 0,
      usesNumberedLists: 0,
      endsWithQuestion: 0,
      averageParaLength: 0,
      commonEmojis: new Set<string>(),
      topHashtags: new Set<string>(),
      totalPosts: posts.length
    };

    // Analyze each post
    posts.forEach(post => {
      const content = post.content;
      
      // Check patterns
      if (/^[^\w\s]/.test(content)) patterns.startsWithEmoji++;
      if (/\d\.|•/.test(content)) patterns.usesNumberedLists++;
      if (/\?\s*$/.test(content)) patterns.endsWithQuestion++;
      
      // Extract emojis
      const emojis = content.match(/[\p{Emoji}]/gu) || [];
      emojis.forEach(emoji => patterns.commonEmojis.add(emoji));
      
      // Extract hashtags
      const hashtags = content.match(/#\w+/g) || [];
      hashtags.forEach(tag => patterns.topHashtags.add(tag));
    });

    // Calculate percentages
    const pctStartsEmoji = (patterns.startsWithEmoji / patterns.totalPosts) * 100;
    const pctUsesLists = (patterns.usesNumberedLists / patterns.totalPosts) * 100;
    const pctEndsQuestion = (patterns.endsWithQuestion / patterns.totalPosts) * 100;

    return `
1. ${Math.round(pctStartsEmoji)}% of your successful posts start with an emoji
2. ${Math.round(pctUsesLists)}% use numbered lists or bullet points
3. ${Math.round(pctEndsQuestion)}% end with a question
4. Most used emojis: ${Array.from(patterns.commonEmojis).slice(0, 5).join(' ')}
5. Popular hashtags: ${Array.from(patterns.topHashtags).slice(0, 5).join(' ')}`;
  }

  async generatePost(params: PostGenerationParams): Promise<string> {
    if (!params.idea || params.idea.trim() === '') {
      throw new Error('Please provide a content idea for your post');
    }

    try {
      let prompt = await this.generatePrompt(params);
      
      // Add style context if available
      prompt = await this.generateWithStyle(prompt);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('No content was generated');
      }

      return text;
    } catch (error) {
      console.error('Error generating post:', error);
      throw error;
    }
  }
}

// Create and export the service instance
export const createAIService = (apiKey: string, userId: string): AIService => {
  try {
    console.log('Creating AI service...');
    return new GeminiService(apiKey, userId);
  } catch (error) {
    console.error('Error creating AI service:', error);
    // Fall back to mock service if there's an error
    console.log('Falling back to mock service...');
    return createMockAIService();
  }
};

// Export a mock service for development/testing
export const createMockAIService = (): AIService => {
  console.log('Using mock AI service');
  return {
    generatePost: async (params: PostGenerationParams) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return `🚀 Excited to share my thoughts on ${params.idea}!

Over the past few weeks, I've been diving deep into this topic, and the insights have been incredible. Here's what I've learned:

1️⃣ Start with the fundamentals
2️⃣ Focus on delivering real value
3️⃣ Always keep learning and adapting

What's your experience with this? Let me know in the comments below! 

#ProfessionalDevelopment #Innovation #Growth`;
    },
    trainStyle: async (trainingPosts: string[]) => {
      // Implementation of trainStyle method in mock service
    }
  };
}; 