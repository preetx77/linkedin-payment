
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  RefreshCw, 
  Sparkles, 
  Edit,
  Save,
  BookmarkIcon,
  Trash,
  LogIn,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import LinkedInProfileManager from './LinkedInProfileManager';
import { LinkedInProfile, LinkedInService, GeneratedPost } from '@/utils/LinkedInService';

const MAX_LINKEDIN_CHARS = 3000;

interface PostGeneratorProps {
  isHomeScreen?: boolean;
  isDashboard?: boolean;
}

const PostGenerator = ({ isHomeScreen = false, isDashboard = false }: PostGeneratorProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [postIdea, setPostIdea] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<GeneratedPost[]>([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedProfiles, setSelectedProfiles] = useState<LinkedInProfile[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  
  useEffect(() => {
    if (user && activeTab === 'drafts') {
      fetchSavedDrafts();
    }
  }, [user, activeTab]);

  const fetchSavedDrafts = async () => {
    if (!user) return;
    
    setIsLoadingDrafts(true);
    try {
      const posts = await LinkedInService.getSavedPosts();
      setSavedDrafts(posts);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      toast({
        title: "Error",
        description: "Failed to load saved drafts",
        variant: "destructive"
      });
    } finally {
      setIsLoadingDrafts(false);
    }
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
    
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate posts.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const result = await LinkedInService.generatePost(postIdea, selectedProfiles);
      
      if (result.success && result.post) {
        setGeneratedPost(result.post);
        setCharCount(result.post.length);
        
        toast({
          title: "Post generated",
          description: "Your LinkedIn post has been created successfully.",
        });
      } else {
        toast({
          title: "Generation failed",
          description: result.error || "Failed to generate post content.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating post:', error);
      toast({
        title: "Error",
        description: "An error occurred while generating your post.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyPost = () => {
    navigator.clipboard.writeText(generatedPost);
    toast({
      title: "Copied!",
      description: "Post copied to clipboard.",
    });
  };
  
  const handleEditPost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedPost(e.target.value);
    setCharCount(e.target.value.length);
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
    
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save drafts.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await LinkedInService.savePost(generatedPost, postIdea, selectedProfiles);
      
      if (result.success) {
        toast({
          title: "Draft saved",
          description: "Your post has been saved as a draft.",
        });
        
        // Refresh drafts if on drafts tab
        if (activeTab === 'drafts') {
          fetchSavedDrafts();
        }
      } else {
        toast({
          title: "Save failed",
          description: result.error || "Failed to save draft.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving your draft.",
        variant: "destructive"
      });
    }
  };
  
  const handleLoadDraft = (draft: GeneratedPost) => {
    setGeneratedPost(draft.content);
    setCharCount(draft.content.length);
    setPostIdea(draft.prompt);
    setActiveTab('generate');
    
    toast({
      title: "Draft loaded",
      description: "Your saved draft has been loaded for editing.",
    });
  };
  
  const handleDeleteDraft = async (draftId: string) => {
    try {
      const result = await LinkedInService.deletePost(draftId);
      
      if (result.success) {
        setSavedDrafts(savedDrafts.filter(draft => draft.id !== draftId));
        
        toast({
          title: "Draft deleted",
          description: "Your draft has been removed.",
        });
      } else {
        toast({
          title: "Delete failed",
          description: result.error || "Failed to delete draft.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        title: "Error",
        description: "An error occurred while deleting your draft.",
        variant: "destructive"
      });
    }
  };
  
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
  
  const cardClasses = () => {
    if (isDashboard) return 'glass-card rounded-xl p-6 md:p-8 animate-fade-in shadow-lg';
    if (isHomeScreen) return 'glass-card rounded-xl p-6 md:p-8 animate-fade-in shadow-lg bg-background/95';
    return 'glass-card rounded-xl p-6 md:p-8 animate-fade-in shadow-lg';
  };
  
  return (
    <div className={cardClasses()}>
      <Tabs defaultValue="generate" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="generate">Generate Post</TabsTrigger>
          <TabsTrigger value="reference">Reference Profiles</TabsTrigger>
          <TabsTrigger value="drafts">Saved Drafts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-6">
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
                onClick={handleGeneratePost}
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
          
          {generatedPost && (
            <div className="mt-8 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Generated Post</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit size={14} />
                    <span>{isEditing ? "Preview" : "Edit"}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleCopyPost}
                  >
                    <Copy size={14} />
                    <span>Copy</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleSaveDraft}
                  >
                    <Save size={14} />
                    <span>Save</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleGeneratePost}
                    disabled={isGenerating}
                  >
                    <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
                    <span>Regenerate</span>
                  </Button>
                </div>
              </div>
              
              <div className="border border-border rounded-lg p-4 bg-background">
                {isEditing ? (
                  <Textarea
                    value={generatedPost}
                    onChange={handleEditPost}
                    className="min-h-[200px] border-0 p-0 focus-visible:ring-0"
                  />
                ) : (
                  <div className="whitespace-pre-wrap">{generatedPost}</div>
                )}
              </div>
              
              <div className={`text-sm mt-2 text-right ${charCount > MAX_LINKEDIN_CHARS ? 'text-destructive' : 'text-muted-foreground'}`}>
                {charCount}/{MAX_LINKEDIN_CHARS} characters
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reference" className="space-y-6">
          <LinkedInProfileManager />
        </TabsContent>
        
        <TabsContent value="drafts" className="space-y-6">
          {!user && isHomeScreen ? (
            renderAuthButtons()
          ) : isLoadingDrafts ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : savedDrafts.length > 0 ? (
            <div className="grid gap-4">
              {savedDrafts.map((draft) => (
                <div key={draft.id} className="border border-border rounded-lg p-4 bg-background">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-muted-foreground">
                      Saved on {new Date(draft.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoadDraft(draft)}
                        title="Load draft"
                      >
                        <BookmarkIcon size={14} />
                        <span className="sr-only">Load draft</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDraft(draft.id)}
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
          ) : (
            <div className="text-center py-12">
              <BookmarkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved drafts</h3>
              <p className="text-muted-foreground mb-6">
                Generate a post and save it to see your drafts here
              </p>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('generate')}
              >
                Create a post
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostGenerator;
