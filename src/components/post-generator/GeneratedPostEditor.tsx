
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Copy, Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MAX_LINKEDIN_CHARS = 3000;

interface GeneratedPostEditorProps {
  generatedPost: string;
  onEdit: (post: string) => void;
  onRegenerate: () => void;
  onSave: () => void;
  isGenerating: boolean;
}

const GeneratedPostEditor = ({ 
  generatedPost, 
  onEdit, 
  onRegenerate, 
  onSave, 
  isGenerating 
}: GeneratedPostEditorProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [charCount, setCharCount] = useState(generatedPost.length);

  const handleCopyPost = () => {
    navigator.clipboard.writeText(generatedPost);
    toast({
      title: "Copied!",
      description: "Post copied to clipboard.",
    });
  };

  const handleEditPost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    onEdit(newContent);
    setCharCount(newContent.length);
  };

  return (
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
            onClick={onSave}
          >
            <Save size={14} />
            <span>Save</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={onRegenerate}
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
  );
};

export default GeneratedPostEditor;
