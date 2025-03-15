
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const testimonials = [
    {
      quote: "LinkedPost transformed how I engage on LinkedIn. My posts now get 3x more engagement than before!",
      author: "Sarah Johnson",
      role: "Marketing Executive",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      quote: "As a busy entrepreneur, creating consistent LinkedIn content was a challenge until I found LinkedPost. Now I post daily in minutes.",
      author: "Michael Chen",
      role: "Startup Founder",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      quote: "The AI perfectly matches my professional voice while adding the perfect structure for LinkedIn engagement.",
      author: "Elena Rodriguez",
      role: "Sales Director",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        
        {/* How It Works Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How It Works
              </h2>
              <p className="text-muted-foreground text-lg">
                Generate high-quality LinkedIn posts in three simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Enter Your Idea",
                  description: "Provide a topic or the main idea for your LinkedIn post."
                },
                {
                  step: "02",
                  title: "Customize Settings",
                  description: "Choose your AI model and adjust settings to match your preferences."
                },
                {
                  step: "03",
                  title: "Generate & Share",
                  description: "Get your professionally written post ready to share on LinkedIn."
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center text-center animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-linkedin/10 text-linkedin font-bold text-xl mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-24 bg-secondary/50 dark:bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What Our Users Say
              </h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of professionals already using LinkedPost to enhance their LinkedIn presence
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="glass-card p-8 rounded-xl animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 11C10 8.22876 7.77124 6 5 6H4.5C4.77614 6 5 5.77614 5 5.5V5C5 4.72386 4.77614 4.5 4.5 4.5H1C0.723858 4.5 0.5 4.72386 0.5 5V8.5C0.5 8.77614 0.723858 9 1 9H4.5C4.77614 9 5 8.77614 5 8.5V8.10002C6.07353 8.56329 6.8347 9.6051 6.94726 10.8468C6.97534 11.1695 7.23283 11.4079 7.55548 11.4079H9.5C9.77614 11.4079 10 11.184 10 10.9079V11Z" fill="#0077B5" />
                      <path d="M23 11C23 8.22876 20.7712 6 18 6H17.5C17.7761 6 18 5.77614 18 5.5V5C18 4.72386 17.7761 4.5 17.5 4.5H14C13.7239 4.5 13.5 4.72386 13.5 5V8.5C13.5 8.77614 13.7239 9 14 9H17.5C17.7761 9 18 8.77614 18 8.5V8.10002C19.0735 8.56329 19.8347 9.6051 19.9473 10.8468C19.9753 11.1695 20.2328 11.4079 20.5555 11.4079H22.5C22.7761 11.4079 23 11.184 23 10.9079V11Z" fill="#0077B5" />
                    </svg>
                  </div>
                  <p className="text-foreground mb-6">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-medium">{testimonial.author}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto glass-card rounded-xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your LinkedIn Presence?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who are leveraging AI to create engaging LinkedIn content in seconds.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button className="bg-linkedin hover:bg-linkedin-dark text-white w-full sm:w-auto px-8 py-6 rounded-full gap-2 text-base">
                    Get Started Now
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" className="w-full sm:w-auto px-8 py-6 rounded-full text-base">
                    View Pricing
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle size={16} className="text-linkedin" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={16} className="text-linkedin" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={16} className="text-linkedin" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
