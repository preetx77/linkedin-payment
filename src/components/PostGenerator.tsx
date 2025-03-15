
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
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';

const MAX_LINKEDIN_CHARS = 3000;

const PostGenerator = () => {
  const { toast } = useToast();
  const [postIdea, setPostIdea] = useState('');
  const [referenceCreator, setReferenceCreator] = useState('');
  const [referenceCreators, setReferenceCreators] = useState<string[]>([]);
  const [model, setModel] = useState('gpt4');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleAddCreator = () => {
    if (referenceCreator && !referenceCreators.includes(referenceCreator)) {
      setReferenceCreators([...referenceCreators, referenceCreator]);
      setReferenceCreator('');
    }
  };
  
  const handleRemoveCreator = (creator: string) => {
    setReferenceCreators(referenceCreators.filter(c => c !== creator));
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
    
    setIsGenerating(true);
    
    // Simulate post generation - in a real app, this would be an API call
    setTimeout(() => {
      const simulatedPost = `🚀 Excited to share some insights on ${postIdea}!\n\nOver the past few weeks, I've been exploring this topic in depth and found some fascinating patterns that could revolutionize how we approach this challenge.\n\nKey takeaways:\n\n1️⃣ Start with a clear understanding of your audience\n2️⃣ Focus on delivering tangible value in every interaction\n3️⃣ Consistency beats perfection every time\n\nWhat strategies have worked for you? Let me know in the comments below!\n\n#ProfessionalDevelopment #CareerGrowth #LinkedIn`;
      
      setGeneratedPost(simulatedPost);
      setCharCount(simulatedPost.length);
      setIsGenerating(false);
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
  
  return (
    <div className="glass-card rounded-xl p-6 md:p-8 animate-fade-in">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="generate">Generate Post</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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
              AI Model
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  model === 'gpt4' 
                    ? 'border-linkedin bg-linkedin/5' 
                    : 'border-border hover:border-linkedin/30'
                }`}
                onClick={() => setModel('gpt4')}
              >
                <div className="font-medium mb-1">GPT-4</div>
                <div className="text-sm text-muted-foreground">Advanced language model with excellent writing capabilities</div>
              </div>
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  model === 'deepseek' 
                    ? 'border-linkedin bg-linkedin/5' 
                    : 'border-border hover:border-linkedin/30'
                }`}
                onClick={() => setModel('deepseek')}
              >
                <div className="font-medium mb-1">DeepSeek</div>
                <div className="text-sm text-muted-foreground">Specialized model trained on professional content</div>
              </div>
            </div>
          </div>
          
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostGenerator;
