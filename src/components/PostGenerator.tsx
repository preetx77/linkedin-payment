import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  RefreshCw, 
  Sparkles, 
  User, 
  Edit,
  Save,
  BookmarkIcon,
  Trash,
  LogIn,
  Calendar,
  Clock,
  ThumbsUp,
  MessageCircle,
  Share2,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { aiService } from '@/integrations/ai/config';
import { postsService } from '@/integrations/supabase/services/posts';
import { userPlanService } from '@/lib/userPlan';
import { postMetricsService } from '@/integrations/supabase/services/postMetrics';

const MAX_LINKEDIN_CHARS = 3000;

interface PostGeneratorProps {
  isHomeScreen?: boolean;
}

interface GeneratedPostHistory {
  id: string;
  content: string;
  postIdea: string;
  timestamp: string;
}

const PostGenerator = ({ isHomeScreen = false }: PostGeneratorProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [postIdea, setPostIdea] = useState('');
  const [referenceCreator, setReferenceCreator] = useState('');
  const [referenceCreators, setReferenceCreators] = useState<string[]>([]);
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<{id: string, content: string, date: string}[]>([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [trainingPosts, setTrainingPosts] = useState<string[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<{id: string, content: string, scheduledFor: string}[]>([]);
  const [expandedDraftId, setExpandedDraftId] = useState<string | null>(null);
  const [postHistory, setPostHistory] = useState<GeneratedPostHistory[]>([]);
  
  // Load saved drafts when component mounts or when user changes
  useEffect(() => {
    const loadSavedDrafts = async () => {
      if (!user) {
        setSavedDrafts([]); // Clear drafts if no user
        return;
      }
      
      try {
        const drafts = await postsService.getUserPosts(user.id, 'draft');
        if (!drafts) return;

        const formattedDrafts = drafts.map(draft => ({
          id: draft.id,
          content: draft.content,
          date: new Date(draft.created_at).toLocaleDateString()
        }));

        setSavedDrafts(formattedDrafts);
      } catch (error) {
        console.error('Error loading drafts:', error);
        toast({
          title: "Error loading drafts",
          description: "Failed to load your saved drafts. Please refresh the page.",
          variant: "destructive"
        });
      }
    };

    loadSavedDrafts();
  }, [user]);
  
  useEffect(() => {
    const loadScheduledPosts = async () => {
      if (!user) {
        setScheduledPosts([]);
        return;
      }
      
      try {
        const posts = await postsService.getUserPosts(user.id, 'published');
        if (!posts) return;

        const scheduled = posts
          .filter(post => post.scheduled_for)
          .map(post => ({
            id: post.id,
            content: post.content,
            scheduledFor: new Date(post.scheduled_for!).toLocaleString()
          }));

        setScheduledPosts(scheduled);
      } catch (error) {
        console.error('Error loading scheduled posts:', error);
      }
    };

    loadScheduledPosts();
  }, [user]);
  
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
  
  const handleAddCreator = () => {
    if (referenceCreator && !referenceCreators.includes(referenceCreator)) {
      setReferenceCreators([...referenceCreators, referenceCreator]);
      setReferenceCreator('');
      
      toast({
        title: "Reference added",
        description: `${referenceCreator} added as a reference account.`,
      });
    }
  };
  
  const handleRemoveCreator = (creator: string) => {
    setReferenceCreators(referenceCreators.filter(c => c !== creator));
    
    toast({
      title: "Reference removed",
      description: `${creator} removed from reference accounts.`,
    });
  };
  
  const handleGeneratePost = async () => {
    if (!postIdea) {
      toast({
        title: "Input required",
        description: "Please enter a post idea to generate content.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      navigate('/login');
      return;
    }

    const userPlan = userPlanService.getUserPlan(user);
    if (!userPlan) return;

    // Check if free user has used all their posts
    if (userPlan.name === 'free' && userPlan.freePostsUsed >= 6) {
      toast({
        title: "Free Plan Limit Reached",
        description: "You've used all 6 free posts for this month. Upgrade to Pro for unlimited posts!",
        variant: "destructive"
      });
      return;
    }

    // Check if user can generate more posts
    if (!userPlanService.canGeneratePost(user.id)) {
      if (userPlan.name === 'free') {
        toast({
          title: "Free Plan Limit Reached",
          description: "You've used all 6 free posts for this month. Upgrade to Pro for unlimited posts!",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Post limit reached",
          description: "You've reached your plan's post limit. Please upgrade to continue generating posts.",
          variant: "destructive"
        });
      }
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const generatedContent = await aiService.generatePost({
        idea: postIdea,
        style: 'professional',
        referenceCreators,
        maxLength: MAX_LINKEDIN_CHARS
      });

      if (generatedContent) {
        // Increment post count
        userPlanService.incrementPostCount(user.id);
        
        setGeneratedPost(generatedContent);
        setCharCount(generatedContent.length);
        
        // Add to history
        const newHistoryItem: GeneratedPostHistory = {
          id: crypto.randomUUID(),
          content: generatedContent,
          postIdea: postIdea,
          timestamp: new Date().toLocaleString()
        };

        setPostHistory(prev => {
          const updatedHistory = [newHistoryItem, ...prev];
          // Save to localStorage
          const savedHistory = localStorage.getItem('postHistory') || '{}';
          const parsedHistory = JSON.parse(savedHistory);
          parsedHistory[user.id] = updatedHistory;
          localStorage.setItem('postHistory', JSON.stringify(parsedHistory));
          return updatedHistory;
        });

        // Initialize metrics tracking for the new post
        await postMetricsService.updateMetrics(newHistoryItem.id, {
          post_id: newHistoryItem.id,
          user_id: user.id,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          clicks: 0,
          engagement_rate: 0
        });
        
        toast({
          title: "Post generated successfully! ✨",
          description: `${userPlanService.getRemainingPosts(user.id)} posts remaining this month.`,
        });
        return;
      }

      throw new Error('No content was generated');
      
    } catch (error: any) {
      console.error('Error generating post:', error);
      
      if (error?.message && typeof error.message === 'string' && error.message !== '{}') {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('api key')) {
          toast({
            title: "API Error",
            description: "There was an issue with the AI service configuration. Please try again later.",
            variant: "destructive"
          });
        } else if (errorMessage.includes('network')) {
          toast({
            title: "Network Error",
            description: "Please check your internet connection and try again.",
            variant: "destructive"
          });
        } else if (errorMessage.includes('no content')) {
          toast({
            title: "Generation Error",
            description: "Failed to generate content. Please try again with a different prompt.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Generation failed",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive"
          });
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyPost = (content: string) => {
    // Preserve formatting when copying
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Post copied to clipboard with formatting preserved.",
    });
  };
  
  const handleEditPost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setGeneratedPost(newContent);
    setCharCount(newContent.length);
  };
  
  const handleSaveDraft = async () => {
    if (!generatedPost) {
      toast({
        title: "No content",
        description: "Please generate or write a post before saving as draft.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save drafts.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create a new draft with a unique post idea
      const timestamp = new Date().toLocaleTimeString();
      const draft = {
        user_id: user.id,
      content: generatedPost,
        post_idea: `${postIdea} (Saved at ${timestamp})`,
        status: 'draft' as const,
        reference_creators: referenceCreators
      };

      const newDraft = await postsService.createPost(draft);

      if (!newDraft) {
        throw new Error('Failed to create draft');
      }

      // Add to local drafts state
      const newDraftItem = {
        id: newDraft.id,
        content: newDraft.content,
      date: new Date().toLocaleDateString()
    };
    
      setSavedDrafts(prevDrafts => [newDraftItem, ...prevDrafts]);
    
    toast({
      title: "Draft saved",
        description: "Your post has been saved as a new draft.",
      });

      // Switch to drafts tab to show the new draft
      setActiveTab('drafts');

    } catch (error) {
      console.error('Error saving draft:', error);
      
      // More specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Save failed",
        description: `Failed to save draft: ${errorMessage}. Please try again.`,
        variant: "destructive"
      });
    }
  };
  
  const handleLoadDraft = (draftContent: string) => {
    setGeneratedPost(draftContent);
    setCharCount(draftContent.length);
    setActiveTab('generate');
    
    toast({
      title: "Draft loaded",
      description: "Your saved draft has been loaded for editing.",
    });
  };
  
  const handleDeleteDraft = async (draftId: string) => {
    try {
      await postsService.deletePost(draftId);
      setSavedDrafts(prevDrafts => prevDrafts.filter(draft => draft.id !== draftId));
    
    toast({
      title: "Draft deleted",
      description: "Your draft has been removed.",
    });
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the draft. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleTrainStyle = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to train the AI.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await aiService.trainStyle(trainingPosts);
      toast({
        title: "Training successful!",
        description: "The AI has been trained on your writing style.",
      });
    } catch (error) {
      console.error('Error training AI:', error);
      toast({
        title: "Training failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const toggleDraftExpansion = (draftId: string) => {
    setExpandedDraftId(expandedDraftId === draftId ? null : draftId);
  };
  
  // Track post engagement
  const handleEngagement = async (postId: string, type: 'like' | 'comment' | 'share' | 'click') => {
    if (!user) return;

    try {
      // Track the engagement event
      await postMetricsService.trackEngagement({
        post_id: postId,
        user_id: user.id,
        engagement_type: type
      });

      // Get current metrics
      const currentMetrics = await postMetricsService.getPostMetrics(postId);
      if (!currentMetrics) return;

      // Update metrics based on engagement type
      const updates = {
        [type + 's']: (currentMetrics[type + 's' as keyof typeof currentMetrics] as number) + 1
      };

      // Update engagement rate
      const totalEngagements = currentMetrics.likes + currentMetrics.comments + currentMetrics.shares + currentMetrics.clicks + 1;
      const engagementRate = (totalEngagements / currentMetrics.views) * 100;

      // Update metrics
      await postMetricsService.updateMetrics(postId, {
        ...updates,
        engagement_rate: engagementRate
      });

      // Calculate success score
      const successScore = await postMetricsService.calculateSuccessScore({
        ...currentMetrics,
        ...updates,
        engagement_rate: engagementRate
      });

      // Save learning data if engagement is good
      if (successScore > 0.6) {
        const post = postHistory.find(p => p.id === postId);
        if (post) {
          await postMetricsService.saveLearningData({
            user_id: user.id,
            post_id: postId,
            content: post.content,
            topic: post.postIdea,
            tone: 'professional', // You could make this dynamic based on the actual tone used
            success_score: successScore,
            engagement_metrics: {
              ...currentMetrics,
              ...updates,
              engagement_rate: engagementRate
            }
          });
        }
      }
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  };

  // Track post views
  useEffect(() => {
    if (!user || !generatedPost) return;

    const trackView = async () => {
      try {
        const currentMetrics = await postMetricsService.getPostMetrics(postHistory[0]?.id);
        if (currentMetrics) {
          await postMetricsService.updateMetrics(postHistory[0].id, {
            views: currentMetrics.views + 1
          });
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackView();
  }, [generatedPost, user]);
  
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
  
  const renderUpgradeMessage = () => {
    if (!user) return null;
    
    const userPlan = userPlanService.getUserPlan(user);
    if (!userPlan || userPlan.name !== 'free' || userPlan.freePostsUsed < 6) return null;

    return (
      <div className="bg-muted p-6 rounded-lg text-center space-y-4 mb-6">
        <h3 className="font-medium text-lg">Free Plan Limit Reached</h3>
        <p className="text-muted-foreground">
          You've used all 6 free posts for this month. Upgrade to Pro for unlimited posts and advanced features!
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/pricing">
            <Button className="bg-linkedin hover:bg-linkedin-dark text-white">
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      </div>
    );
  };
  
  const renderGeneratedPost = () => {
    if (!generatedPost) return null;

    const currentPost = postHistory[0];
    
    return (
      <div className="space-y-4">
        <div className="relative bg-card p-6 rounded-lg shadow-md">
          <div className="whitespace-pre-wrap mb-4">{generatedPost}</div>
          
          {/* Engagement buttons */}
          <div className="flex items-center gap-4 mt-4 border-t pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => handleEngagement(currentPost.id, 'like')}
            >
              <ThumbsUp className="w-4 h-4" />
              Like
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => handleEngagement(currentPost.id, 'comment')}
            >
              <MessageCircle className="w-4 h-4" />
              Comment
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => handleEngagement(currentPost.id, 'share')}
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => handleEngagement(currentPost.id, 'click')}
            >
              <ExternalLink className="w-4 h-4" />
              Click
            </Button>
          </div>

          <div className="absolute top-4 right-4 space-x-2">
            <Button 
              variant="outline"
              size="default"
              onClick={() => handleCopyPost(generatedPost)}
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button 
              variant="default"
              size="default"
              onClick={handleSaveDraft}
            >
              <Save className="w-4 h-4 mr-1" />
              Save as New Draft
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`p-6 md:p-8 animate-fade-in ${isHomeScreen ? 'bg-transparent' : 'glass-card rounded-xl shadow-lg'}`}>
      <Tabs defaultValue="generate" className="w-full" onValueChange={(value) => {
        if (!user && (value === 'settings' || value === 'drafts' || value === 'scheduled')) {
          return;
        }
        setActiveTab(value);
      }}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="generate">Generate Post</TabsTrigger>
          <TabsTrigger value="settings" disabled={!user} className="relative group">
            Settings
            {!user && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs py-1 px-2 rounded shadow-lg">
                Sign in to access settings
              </div>
            )}
          </TabsTrigger>
          <TabsTrigger value="drafts" disabled={!user} className="relative group">
            Saved Drafts ({user ? savedDrafts.length : 0})
            {!user && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs py-1 px-2 rounded shadow-lg">
                Sign in to access drafts
              </div>
            )}
          </TabsTrigger>
          <TabsTrigger value="scheduled" disabled={!user} className="relative group">
            Scheduled Posts
            {!user && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs py-1 px-2 rounded shadow-lg">
                Sign in to schedule posts
              </div>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Post Idea
            </label>
            <Textarea
              placeholder="E.g. 'Write a storytelling post about my journey in tech, focusing on challenges and learnings. Include real examples and end with an inspiring message'"
              value={postIdea}
              onChange={(e) => setPostIdea(e.target.value)}
              className="resize-none min-h-[200px] placeholder:text-muted-foreground/50 placeholder:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              Reference LinkedIn Creators (Optional)
              <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-0.5 rounded-full">Coming Soon</span>
            </label>
            <div className="relative">
              <Input
                placeholder="Add LinkedIn creator's name"
                value={referenceCreator}
                onChange={(e) => setReferenceCreator(e.target.value)}
                disabled
                className="cursor-not-allowed"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Soon, you'll be able to add LinkedIn creators here to analyze their writing style and incorporate it into your generated posts.
                For now, we'll use your trained style and previous posts to generate content.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
              <Button 
                onClick={handleGeneratePost}
              className="bg-linkedin hover:bg-linkedin-dark text-white gap-2"
                disabled={isGenerating || !postIdea}
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner size="sm" />
                  Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                  Generate Post
                  </>
                )}
              </Button>
          </div>
          
          {renderUpgradeMessage()}
          {renderGeneratedPost()}
        </TabsContent>
        
        <TabsContent value="settings">
          {user ? (
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Train on Your Style</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Submit your past LinkedIn posts to train the AI on your writing style. 
                  For best results, provide 10-12 of your most successful posts.
                </p>
                
                <div className="space-y-4">
                  <Textarea
                    placeholder="Paste your past LinkedIn posts here, one post per line"
                    className="min-h-[300px]"
                    onChange={(e) => {
                      // Split by double newline to separate posts
                      const posts = e.target.value.split('\n\n').filter(post => post.trim());
                      setTrainingPosts(posts);
                    }}
                  />
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {trainingPosts.length} posts added
                    </p>
                    <Button 
                      onClick={handleTrainStyle}
                      disabled={trainingPosts.length < 5}
                      size="default"
                    >
                      Train AI on My Style
              </Button>
                  </div>
                  
                  {trainingPosts.length > 0 && trainingPosts.length < 5 && (
                    <p className="text-sm text-yellow-500">
                      Please add at least 5 posts for better training results
                    </p>
                  )}
            </div>
          </div>
            </div>
          ) : renderAuthButtons()}
        </TabsContent>
        
        <TabsContent value="drafts">
          {user ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Saved Drafts</h2>
              {savedDrafts.length === 0 ? (
                <p className="text-gray-500">No drafts saved yet.</p>
              ) : (
                <div className="space-y-4">
              {savedDrafts.map((draft) => (
                    <div 
                      key={draft.id} 
                      className="border rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-400 cursor-pointer bg-card"
                      onClick={() => toggleDraftExpansion(draft.id)}
                    >
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-muted-foreground">Saved on {draft.date}</p>
                    <div className="flex gap-2">
                      <Button
                              variant="outline"
                              size="default"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLoadDraft(draft.content);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="default"
                              className="relative group"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Schedule
                              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-1 rounded">
                                Soon
                              </span>
                            </Button>
                            <Button
                              variant="outline"
                              size="default"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPost(draft.content);
                              }}
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                      </Button>
                      <Button
                              variant="outline"
                              size="default"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDraft(draft.id);
                              }}
                            >
                              <Trash className="w-4 h-4 mr-1" />
                              Delete
                      </Button>
                    </div>
                  </div>
                        {!expandedDraftId || expandedDraftId !== draft.id ? (
                          <p className="text-sm line-clamp-2">{draft.content}</p>
                        ) : (
                          <div className="mt-4 p-4 rounded-md bg-muted">
                            <p className="whitespace-pre-wrap">{draft.content}</p>
                          </div>
                        )}
                  </div>
                </div>
              ))}
            </div>
              )}
                  </div>
          ) : renderAuthButtons()}
        </TabsContent>

        <TabsContent value="scheduled">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Scheduled Posts</h2>
                <span className="bg-yellow-500 text-white text-sm px-2 py-1 rounded">
                  Coming Soon
                </span>
              </div>
              <div className="border p-4 rounded-lg space-y-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-5 h-5" />
                  <p>Automatic LinkedIn posting scheduler coming soon!</p>
                </div>
                <p className="text-sm">
                  Features coming in the next update:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                  <li>Schedule posts for specific dates and times</li>
                  <li>Automatic posting to LinkedIn</li>
                  <li>Schedule multiple posts in advance</li>
                  <li>Edit scheduled posts before they go live</li>
                  <li>Analytics for scheduled post performance</li>
                </ul>
              </div>
            </div>
          ) : renderAuthButtons()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostGenerator;
