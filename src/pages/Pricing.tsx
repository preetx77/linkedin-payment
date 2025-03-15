
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingCard from '@/components/PricingCard';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const pricingPlans = [
    {
      title: "Free",
      price: "Free",
      description: "Perfect for trying out the platform",
      features: [
        { text: "10 posts per month", included: true },
        { text: "Basic AI generation", included: true },
        { text: "Character counter", included: true },
        { text: "Copy functionality", included: true },
        { text: "Email support", included: true },
        { text: "Style matching", included: false },
        { text: "Reference creators", included: false },
        { text: "Style training", included: false },
        { text: "Advanced AI models", included: false },
      ],
      ctaText: "Get Started",
      ctaLink: "/signup",
      isPopular: false
    },
    {
      title: "Pro",
      price: "$19",
      description: "For professionals who post regularly",
      features: [
        { text: "50 posts per month", included: true },
        { text: "Enhanced AI generation", included: true },
        { text: "Character counter", included: true },
        { text: "Copy functionality", included: true },
        { text: "Priority email support", included: true },
        { text: "Style matching", included: true },
        { text: "Reference creators", included: true },
        { text: "Style training", included: false },
        { text: "Advanced AI models", included: false },
      ],
      ctaText: "Get Started",
      ctaLink: "/signup",
      isPopular: true
    },
    {
      title: "Enterprise",
      price: "$49",
      description: "For teams and power users",
      features: [
        { text: "Unlimited posts", included: true },
        { text: "Premium AI generation", included: true },
        { text: "Character counter", included: true },
        { text: "Copy functionality", included: true },
        { text: "24/7 priority support", included: true },
        { text: "Style matching", included: true },
        { text: "Reference creators", included: true },
        { text: "Style training", included: true },
        { text: "Advanced AI models", included: true },
      ],
      ctaText: "Get Started",
      ctaLink: "/signup",
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that best fits your needs. All plans include a 14-day free trial with no credit card required.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard 
                key={index}
                title={plan.title}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                ctaText={plan.ctaText}
                ctaLink={plan.ctaLink}
                isPopular={plan.isPopular}
              />
            ))}
          </div>
          
          <div className="mt-16 glass-card rounded-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">All Plans Include</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "No credit card required to start",
                "14-day free trial",
                "Cancel anytime",
                "Secure payment processing",
                "Regular feature updates",
                "GDPR compliant"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="text-linkedin h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[
                {
                  question: "Can I change plans later?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and Apple Pay for your convenience."
                },
                {
                  question: "Is there a long-term contract?",
                  answer: "No, all plans are month-to-month and you can cancel at any time without penalties."
                },
                {
                  question: "What happens when I reach my monthly limit?",
                  answer: "You can either upgrade your plan or wait until your limit resets at the start of your next billing cycle."
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
            <Link to="#">
              <Button variant="outline" className="rounded-full">
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
