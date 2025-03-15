
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  ctaText: string;
  ctaLink: string;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  ctaText,
  ctaLink
}: PricingCardProps) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-xl p-8 relative flex flex-col h-full animate-fade-in",
        isPopular && "border-linkedin/50 dark:border-linkedin/30 shadow-lg"
      )}
    >
      {isPopular && (
        <div className="absolute -top-4 inset-x-0 flex justify-center">
          <div className="bg-linkedin text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className={cn("text-xl font-semibold mb-2", isPopular && "text-linkedin")}>{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && <span className="text-muted-foreground ml-2">/month</span>}
        </div>
      </div>
      
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className={cn(
              "mr-2 rounded-full p-1",
              feature.included ? "text-linkedin bg-linkedin/10" : "text-muted-foreground bg-muted/50"
            )}>
              <Check size={14} />
            </span>
            <span className={cn(
              "text-sm",
              feature.included ? "text-foreground" : "text-muted-foreground line-through"
            )}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      <Link to={ctaLink} className="mt-auto">
        <Button 
          className={cn(
            "w-full rounded-full", 
            isPopular 
              ? "bg-linkedin hover:bg-linkedin-dark text-white" 
              : "bg-secondary hover:bg-secondary/80"
          )}
        >
          {ctaText}
        </Button>
      </Link>
    </div>
  );
};

export default PricingCard;
