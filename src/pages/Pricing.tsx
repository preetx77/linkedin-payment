import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Pricing = () => {
  const { user } = useAuth();
  
  const pricingPlans = [
    {
      title: "Free",
      price: "0",
      description: "Perfect for trying out the platform",
      features: [
        { text: "6 posts per month", included: true },
        { text: "Basic post generation", included: true },
        { text: "Character counter", included: true },
        { text: "Copy functionality", included: true },
        { text: "Basic email support", included: true },
        { text: "Style matching", included: true },
        { text: "Analytics dashboard", included: false },
        { text: "Post scheduling", included: false },
        { text: "Auto-posting", included: false },
      ],
      ctaText: user ? "Current Plan" : "Get Started",
      ctaLink: user ? "/dashboard" : "/signup",
      popular: false
    },
    {
      title: "Pro",
      price: "12",
      description: "For serious content creators",
      features: [
        { text: "Unlimited posts per month", included: true },
        { text: "Advanced post generation", included: true },
        { text: "Character counter", included: true },
        { text: "Copy functionality", included: true },
        { text: "Priority support", included: true },
        { text: "Style matching", included: true },
        { text: "Analytics dashboard ", included: true, suffix: <span className="text-yellow-500 ml-1 text-xs font-medium">Coming Soon</span> },
        { text: "Post scheduling ", included: true, suffix: <span className="text-yellow-500 ml-1 text-xs font-medium">Coming Soon</span> },
        { text: "Auto-posting ", included: true, suffix: <span className="text-yellow-500 ml-1 text-xs font-medium">Coming Soon</span> },
      ],
      ctaText: "Choose Pro",
      ctaLink: user ? "/dashboard/billing" : "/signup?plan=pro",
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that best fits your needs. All plans include a 14-day free trial.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={cn(
                  "glass-card rounded-xl p-8 relative flex flex-col h-full animate-fade-in",
                  plan.popular && "border-linkedin/50 shadow-linkedin/10"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-linkedin px-3 py-1 text-xs font-medium text-white">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-5">
                  <h3 className="font-bold text-xl">{plan.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    {plan.price !== "Custom" ? (
                      <>
                        <span className="text-3xl font-bold">$</span>
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground ml-1">/mo</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold">Custom</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm">
                      {feature.included ? (
                        <CheckCircle className="h-4 w-4 text-linkedin mr-2 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground"}>
                        {feature.text}
                        {feature.suffix}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Link to={plan.ctaLink}>
                  <Button 
                    className={cn(
                      "w-full rounded-full", 
                      plan.popular 
                        ? "bg-linkedin hover:bg-linkedin-dark text-white" 
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {plan.ctaText}
                  </Button>
                </Link>
              </div>
            ))}

            {/* Enterprise Plan - Coming Soon */}
            <div className="glass-card rounded-xl p-8 relative flex flex-col h-full animate-fade-in opacity-75">
              <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-yellow-500 px-3 py-1 text-xs font-medium text-white">
                Coming Soon
              </div>
              
              <div className="mb-5">
                <h3 className="font-bold text-xl">Enterprise</h3>
                <p className="text-muted-foreground text-sm mt-1">For teams and organizations</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-linkedin mr-2 flex-shrink-0" />
                  <span>All Pro features</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-linkedin mr-2 flex-shrink-0" />
                  <span>Custom integrations</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-linkedin mr-2 flex-shrink-0" />
                  <span>Dedicated account manager</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-linkedin mr-2 flex-shrink-0" />
                  <span>Custom analytics</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-linkedin mr-2 flex-shrink-0" />
                  <span>API access</span>
                </div>
              </div>
              
              <Button 
                className="w-full rounded-full bg-secondary hover:bg-secondary/80"
                disabled
              >
                Coming Soon
              </Button>
            </div>
          </div>
          
          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[
                {
                  question: "What's included in the free plan?",
                  answer: "The free plan includes 6 posts per month with basic features like post generation, character counter, and copy functionality."
                },
                {
                  question: "What additional features do I get with Pro?",
                  answer: "Pro users get unlimited posts, analytics dashboard, post scheduling, auto-posting, and priority support."
                },
                {
                  question: "Can I upgrade from Free to Pro?",
                  answer: "Yes, you can upgrade to Pro at any time. Your new features will be available immediately after upgrading."
                },
                {
                  question: "When will Enterprise be available?",
                  answer: "We're currently developing our Enterprise solution. Sign up for our newsletter to be notified when it launches."
                }
              ].map((faq, index) => (
                <div key={index} className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you find the right plan for your needs.
            </p>
            <Link to="/contact" className="pointer-events-none">
              <Button 
                variant="outline" 
                className="rounded-full opacity-50 cursor-not-allowed" 
                disabled
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
