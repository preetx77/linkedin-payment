import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Edit } from 'lucide-react';

interface GeneratedPostHistory {
  id: string;
  content: string;
  postIdea: string;
  timestamp: string;
}

const History = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [postHistory, setPostHistory] = useState<GeneratedPostHistory[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  useEffect(() => {
    // Load history from localStorage when component mounts
    const savedHistory = localStorage.getItem('postHistory');
    if (savedHistory && user) {
      const parsedHistory = JSON.parse(savedHistory);
      // Only load history that belongs to current user
      const userHistory = parsedHistory[user.id] || [];
      setPostHistory(userHistory);
    }
  }, [user]);

  const handleCopyPost = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Post copied to clipboard.",
    });
  };

  const togglePostExpansion = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  if (postHistory.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-6">
        You haven't generated any posts yet
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {postHistory.map((post) => (
        <div 
          key={post.id} 
          className="border rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-400 cursor-pointer bg-card"
          onClick={() => togglePostExpansion(post.id)}
        >
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Generated on {post.timestamp}</p>
                <p className="text-sm font-medium">Prompt: {post.postIdea}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyPost(post.content);
                  }}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
            {expandedPostId !== post.id ? (
              <p className="text-sm line-clamp-2">{post.content}</p>
            ) : (
              <div className="mt-4 p-4 rounded-md bg-muted">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default History; 