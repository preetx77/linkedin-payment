
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

interface PostGenerationFormProps {
  postIdea: string;
  setPostIdea: (idea: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  isHomeScreen?: boolean;
}

const PostGenerationForm = ({ 
  postIdea, 
  setPostIdea, 
  isGenerating, 
  onGenerate, 
  isHomeScreen = false 
}: PostGenerationFormProps) => {
  const { user } = useAuth();

  const renderAuthButtons = () => (
    <div className="text-center p-6">
      <p className="text-muted-foreground mb-4">Sign in to generate and save LinkedIn posts</p>
      <div className="flex justify-center gap-4">
        <Link to="/login">
          <Button className="bg-linkedin hover:bg-linkedin-dark text-white gap-2">
            <LogIn size={16} />
            Sign In
          </Button>
        </Link>
        <Link to="/signup">
          <Button variant="outline">Sign Up</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Post Idea
        </label>
        <Textarea
          placeholder="Enter your post idea or topic here..."
          value={postIdea}
          onChange={(e) => setPostIdea(e.target.value)}
          className="resize-none min-h-[120px]"
        />
      </div>
      
      <div className="flex justify-center">
        {!user && isHomeScreen ? (
          renderAuthButtons()
        ) : (
          <Button 
            className="bg-linkedin hover:bg-linkedin-dark text-white px-6 gap-2"
            onClick={onGenerate}
            disabled={isGenerating || !postIdea}
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate LinkedIn Post</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostGenerationForm;
