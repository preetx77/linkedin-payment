import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { signInWithGoogle } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface GoogleSignInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export function GoogleSignInButton({
  text = "Sign in with Google",
  className,
  ...props
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      className={`w-full bg-white hover:bg-gray-100 text-gray-900 hover:text-gray-900 font-medium border-2 border-gray-200 hover:border-gray-300 shadow-sm transition-all ${className}`}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-5 w-5 animate-spin text-gray-600" />
      ) : (
        <Icons.google className="mr-2 h-5 w-5" />
      )}
      {text}
    </Button>
  );
} 