
import { Sparkles, Users, Zap } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="h-10 w-10 text-linkedin" />,
    title: "AI-Powered Generation",
    description: "Create professional LinkedIn posts with just a few clicks using our advanced AI algorithms trained on high-performing content."
  },
  {
    icon: <Users className="h-10 w-10 text-linkedin" />,
    title: "Match Your Style",
    description: "Our AI adapts to your personal writing style and preferences, ensuring every post sounds authentically like you."
  },
  {
    icon: <Zap className="h-10 w-10 text-linkedin" />,
    title: "Reference Top Creators",
    description: "Learn from the best by referencing top LinkedIn content creators and incorporating their successful strategies."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-secondary/50 dark:bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Powerful Features for LinkedIn Success
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to create high-engaging LinkedIn content that drives connections, engagement, and career opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-8 rounded-xl flex flex-col items-center text-center animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="mb-6 p-4 rounded-full bg-background dark:bg-background/20 border border-border">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
