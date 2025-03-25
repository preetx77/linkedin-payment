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