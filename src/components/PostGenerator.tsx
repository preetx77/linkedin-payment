
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import LinkedInProfileManager from './LinkedInProfileManager';
import { LinkedInProfile, LinkedInService, GeneratedPost } from '@/utils/LinkedInService';
import PostGenerationForm from './post-generator/PostGenerationForm';
import GeneratedPostEditor from './post-generator/GeneratedPostEditor';
import SavedDraftsTab from './post-generator/SavedDraftsTab';

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
          <PostGenerationForm
            postIdea={postIdea}
            setPostIdea={setPostIdea}
            isGenerating={isGenerating}
            onGenerate={handleGeneratePost}
            isHomeScreen={isHomeScreen}
          />
          
          {generatedPost && (
            <GeneratedPostEditor
              generatedPost={generatedPost}
              onEdit={setGeneratedPost}
              onRegenerate={handleGeneratePost}
              onSave={handleSaveDraft}
              isGenerating={isGenerating}
            />
          )}
        </TabsContent>
        
        <TabsContent value="reference" className="space-y-6">
          <LinkedInProfileManager />
        </TabsContent>
        
        <TabsContent value="drafts" className="space-y-6">
          <SavedDraftsTab
            drafts={savedDrafts}
            isLoading={isLoadingDrafts}
            onLoadDraft={handleLoadDraft}
            onDeleteDraft={handleDeleteDraft}
            isHomeScreen={isHomeScreen}
            onCreatePost={() => setActiveTab('generate')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostGenerator;
