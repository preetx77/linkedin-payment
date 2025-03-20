
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, Trash, Loader2 } from 'lucide-react';
import { GeneratedPost } from '@/utils/LinkedInService';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

interface SavedDraftsTabProps {
  drafts: GeneratedPost[];
  isLoading: boolean;
  onLoadDraft: (draft: GeneratedPost) => void;
  onDeleteDraft: (draftId: string) => void;
  isHomeScreen?: boolean;
  onCreatePost: () => void;
}

const SavedDraftsTab = ({ 
  drafts, 
  isLoading, 
  onLoadDraft, 
  onDeleteDraft, 
  isHomeScreen = false,
  onCreatePost
}: SavedDraftsTabProps) => {
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

  if (!user && isHomeScreen) {
    return renderAuthButtons();
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-12">
        <BookmarkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No saved drafts</h3>
        <p className="text-muted-foreground mb-6">
          Generate a post and save it to see your drafts here
        </p>
        <Button 
          variant="outline" 
          onClick={onCreatePost}
        >
          Create a post
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {drafts.map((draft) => (
        <div key={draft.id} className="border border-border rounded-lg p-4 bg-background">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-muted-foreground">
              Saved on {new Date(draft.created_at).toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLoadDraft(draft)}
                title="Load draft"
              >
                <BookmarkIcon size={14} />
                <span className="sr-only">Load draft</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteDraft(draft.id)}
                title="Delete draft"
              >
                <Trash size={14} />
                <span className="sr-only">Delete draft</span>
              </Button>
            </div>
          </div>
          <div className="text-sm">
            <p className="font-medium mb-1 truncate">{draft.prompt}</p>
          </div>
          <div className="text-sm line-clamp-3 whitespace-pre-wrap">
            {draft.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedDraftsTab;
