
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
            Create Engaging LinkedIn Posts in <span className="text-gradient">Seconds</span>
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
        
        {/* Preview image */}
        <div className="mt-16 glass-card rounded-xl shadow-2xl mx-auto max-w-5xl overflow-hidden animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <div className="text-center text-white absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-3/4 h-8 bg-white/10 rounded-lg mb-4"></div>
              <div className="w-1/2 h-8 bg-white/10 rounded-lg mb-8"></div>
              <div className="w-5/6 h-5 bg-white/10 rounded-lg mb-3"></div>
              <div className="w-5/6 h-5 bg-white/10 rounded-lg mb-3"></div>
              <div className="w-5/6 h-5 bg-white/10 rounded-lg mb-3"></div>
              <div className="w-1/2 h-5 bg-white/10 rounded-lg"></div>
              <div className="absolute bottom-6 right-6 w-36 h-10 bg-linkedin rounded-lg flex items-center justify-center text-sm font-medium">Generate Post</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
