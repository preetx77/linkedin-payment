
import { useState } from 'react';
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
  LogIn
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const MAX_LINKEDIN_CHARS = 3000;

interface PostGeneratorProps {
  isHomeScreen?: boolean;
  isDashboard?: boolean;
}

const PostGenerator = ({ isHomeScreen = false, isDashboard = false }: PostGeneratorProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [postIdea, setPostIdea] = useState('');
  const [referenceCreator, setReferenceCreator] = useState('');
  const [referenceCreators, setReferenceCreators] = useState<string[]>([]);
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<{id: string, content: string, date: string}[]>([]);
  const [activeTab, setActiveTab] = useState('generate');
  
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
  
  const handleGeneratePost = () => {
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
    
    // Simulate post generation - in a real app, this would be an API call
    setTimeout(() => {
      let referencesText = '';
      if (referenceCreators.length > 0) {
        referencesText = `\n\nThis post is inspired by the writing styles of ${referenceCreators.join(', ')}.`;
      }
      
      const simulatedPost = `🚀 Excited to share some insights on ${postIdea}!\n\nOver the past few weeks, I've been exploring this topic in depth and found some fascinating patterns that could revolutionize how we approach this challenge.\n\nKey takeaways:\n\n1️⃣ Start with a clear understanding of your audience\n2️⃣ Focus on delivering tangible value in every interaction\n3️⃣ Consistency beats perfection every time\n\nWhat strategies have worked for you? Let me know in the comments below!${referencesText}\n\n#ProfessionalDevelopment #CareerGrowth #LinkedIn`;
      
      setGeneratedPost(simulatedPost);
      setCharCount(simulatedPost.length);
      setIsGenerating(false);
      
      toast({
        title: "Post generated",
        description: "Your LinkedIn post has been created successfully.",
      });
    }, 2000);
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
  
  const handleSaveDraft = () => {
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
    
    const newDraft = {
      id: Date.now().toString(),
      content: generatedPost,
      date: new Date().toLocaleDateString()
    };
    
    setSavedDrafts([...savedDrafts, newDraft]);
    
    toast({
      title: "Draft saved",
      description: "Your post has been saved as a draft.",
    });
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
  
  const handleDeleteDraft = (draftId: string) => {
    setSavedDrafts(savedDrafts.filter(draft => draft.id !== draftId));
    
    toast({
      title: "Draft deleted",
      description: "Your draft has been removed.",
    });
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
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="drafts">Saved Drafts ({savedDrafts.length})</TabsTrigger>
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
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Reference LinkedIn Creators (Optional)
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add LinkedIn creator's name"
                value={referenceCreator}
                onChange={(e) => setReferenceCreator(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && referenceCreator) {
                    e.preventDefault();
                    handleAddCreator();
                  }
                }}
              />
              <Button variant="outline" onClick={handleAddCreator}>
                Add
              </Button>
            </div>
            
            {referenceCreators.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {referenceCreators.map((creator, index) => (
                  <div 
                    key={index} 
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    <User size={14} />
                    <span>{creator}</span>
                    <button 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveCreator(creator)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                    <span>Generate Post</span>
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
        
        <TabsContent value="settings" className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Writing Style Training
            </label>
            <div className="border border-border rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Train the AI on your writing style by uploading previous LinkedIn posts
              </p>
              <Button variant="outline" className="gap-2">
                <User size={16} />
                <span>Train on My Style</span>
              </Button>
            </div>
          </div>

          {!user && isHomeScreen && (
            <div className="mt-6">
              {renderAuthButtons()}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="drafts" className="space-y-6">
          {!user && isHomeScreen ? (
            renderAuthButtons()
          ) : savedDrafts.length > 0 ? (
            <div className="grid gap-4">
              {savedDrafts.map((draft) => (
                <div key={draft.id} className="border border-border rounded-lg p-4 bg-background">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-muted-foreground">
                      Saved on {draft.date}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoadDraft(draft.content)}
                      >
                        <BookmarkIcon size={14} />
                        <span className="sr-only">Load draft</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDraft(draft.id)}
                      >
                        <Trash size={14} />
                        <span className="sr-only">Delete draft</span>
                      </Button>
                    </div>
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
