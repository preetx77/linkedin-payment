
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PostGenerator from '@/components/PostGenerator';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent dark:from-transparent dark:via-linkedin/5 dark:to-transparent -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-linkedin/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-linkedin/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-medium text-linkedin bg-linkedin/10 rounded-full animate-fade-in">
            AI-Powered LinkedIn Posts
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Create <span className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-pulse-subtle px-1" style={{ 
              textShadow: '0 0 10px rgba(217, 70, 239, 0.5)',
              borderRadius: '4px' 
            }}>Engaging</span> LinkedIn Posts in <span className="text-gradient">Seconds</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            Generate professional, tailored LinkedIn content that matches your personal style and drives engagement with our AI-powered platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link to="/signup">
              <Button className="bg-linkedin hover:bg-linkedin-dark text-white w-full sm:w-auto px-8 py-6 rounded-full gap-2 text-base">
                Get Started 
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-6 rounded-full text-base">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Post Generator moved here */}
        <div className="mt-16 mx-auto max-w-5xl animate-fade-in" style={{ animationDelay: '400ms' }}>
          <PostGenerator />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
