
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, InfoIcon } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PostGenerationFormProps {
  postIdea: string;
  setPostIdea: (idea: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  isHomeScreen?: boolean;
  hasReferenceProfiles?: boolean;
}

const PostGenerationForm = ({ 
  postIdea, 
  setPostIdea, 
  isGenerating, 
  onGenerate, 
  isHomeScreen = false,
  hasReferenceProfiles = false
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
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">
            Post Idea
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <InfoIcon size={14} />
                  <span className="sr-only">Post idea help</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Describe what you want to post about. Be specific to get better results. 
                  {hasReferenceProfiles && " Our AI will analyze your reference profiles to match their style."}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Textarea
          placeholder="Enter your post idea or topic here..."
          value={postIdea}
          onChange={(e) => setPostIdea(e.target.value)}
          className="resize-none min-h-[120px]"
        />
        {hasReferenceProfiles && (
          <p className="text-xs text-muted-foreground mt-2">
            <span className="font-medium text-linkedin">Pro tip:</span> Our AI will analyze your reference profiles to match their writing style.
          </p>
        )}
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
