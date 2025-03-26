import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, TrendingUp, Zap, Award, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  const testimonials = [
    {
      name: "James Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      text: "Been really enjoying LinkGenn - especially the ideation tool & how it converts YouTube content into written text. So easy to use as well.",
      rating: 5,
      role: "Content Creator"
    },
    {
      name: "Marcus Wright",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
      text: "Benefits of Using LinkGenn:\n• Find unlimited post ideas\n• Saves you time and effort\n• Generate engaging content\n• Grow your LinkedIn presence",
      rating: 5,
      role: "Marketing Expert"
    },
    {
      name: "Adrian Torres",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      text: "I started my LinkedIn journey in 2019 when AI tools weren't readily available so I didn't have LinkGenn. If I was starting again now, LinkGenn would've saved me A LOT of stress and time.",
      rating: 5,
      role: "Digital Entrepreneur"
    },
    {
      name: "Thomas Blake",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      text: "Copy-paste Chat GPT content won't help you build a solid brand people follow. Using tools like LinkGenn makes AI-generated content much easier to use and tailor to your way of writing. Saving you time and making sure your content is of value.",
      rating: 5,
      role: "Brand Strategist"
    },
    {
      name: "Daniel Martinez",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      text: "ChatGPT is king. But LinkGenn is Easier. LinkGenn creates elite AI posts very fast.",
      rating: 5,
      role: "Tech Influencer"
    },
    {
      name: "Michael Carter",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      text: "The quality of content LinkGenn generates is incredible. It understands context and tone perfectly, making each post feel authentic and engaging.",
      rating: 5,
      role: "Social Media Manager"
    },
    {
      name: "Ryan Anderson",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      text: "What impresses me most is how LinkGenn maintains my brand voice while optimizing for engagement. Game-changing tool for busy professionals.",
      rating: 5,
      role: "Business Coach"
    },
    {
      name: "Chris Walker",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      text: "From ideation to execution, LinkGenn streamlines my entire content creation process. My engagement has doubled since I started using it.",
      rating: 5,
      role: "LinkedIn Creator"
    },
    {
      name: "Alex Bennett",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop",
      text: "The AI understands LinkedIn's ecosystem perfectly. Since using LinkGenn, my posts have been getting featured in newsletters and my network growth is exponential. Absolutely worth every penny!",
      rating: 5,
      role: "Growth Advisor"
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="space-y-8">
        <HeroSection />

        {/* Results Section */}
        <section className="py-12 relative overflow-hidden animate-fade-up">
          <div className="absolute inset-0 bg-gradient-to-b from-linkedin/5 to-transparent -z-10"></div>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-block px-4 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium mb-4 animate-bounce">
                Proven Results
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-linkedin to-purple-600 bg-clip-text text-transparent">
                Transform Your LinkedIn Game
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join thousands of professionals who are using LinkGenn to build powerful personal brands and attract life-changing opportunities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {[
                { number: "247%", label: "Average Engagement Boost", icon: <TrendingUp className="h-6 w-6" /> },
                { number: "10K+", label: "Viral Posts Generated", icon: <Zap className="h-6 w-6" /> },
                { number: "93%", label: "Success Rate", icon: <Award className="h-6 w-6" /> }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="glass-card p-8 rounded-xl text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linkedin/10 mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-5xl font-bold text-linkedin mb-2 animate-pulse">{stat.number}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 relative overflow-hidden bg-gray-950">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950 opacity-80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-950/0 to-gray-950/0"></div>
          <div className="container mx-auto px-4 relative">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
              What they say about LinkGenn
              </h2>
            <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Join thousands of professionals who are already transforming their LinkedIn presence
              </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className={`transform ${
                    index % 3 === 1 ? 'translate-y-8' : ''
                  } transition-all duration-300`}
                >
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border border-gray-800">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-lg opacity-40"></div>
                        <img 
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-500/20 relative z-10"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-linkedin text-white rounded-full p-1 shadow-lg z-20">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </div>
                      </div>
                    <div>
                        <h3 className="font-bold text-lg text-white">{testimonial.name}</h3>
                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                        <div className="flex gap-0.5 mt-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {testimonial.text.split('\n').map((paragraph, i) => (
                        <p key={i} className="text-gray-300 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-20 relative overflow-hidden animate-fade-up">
          <div className="absolute inset-0 bg-gradient-to-b from-linkedin/10 to-transparent -z-10"></div>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto glass-card rounded-xl p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-xl -z-10"></div>
              
              <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-linkedin to-purple-600 bg-clip-text text-transparent">
                Ready to Stand Out?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Join forward-thinking professionals who are using LinkGenn to create content that attracts opportunities, builds influence, and accelerates career growth.
              </p>
              
              {!user && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link to="/signup">
                    <Button className="bg-linkedin hover:bg-linkedin/90 text-white w-full sm:w-auto px-10 py-7 rounded-full gap-3 text-lg font-medium transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                      Start Creating Now
                      <ArrowRight size={20} />
                  </Button>
                </Link>
                <Link to="/pricing">
                    <Button variant="outline" className="w-full sm:w-auto px-10 py-7 rounded-full text-lg font-medium hover:bg-linkedin/5">
                      View Plans
                  </Button>
                </Link>
              </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="text-lg">No credit card required</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="text-lg">AI-powered results</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="text-lg">Cancel anytime</span>
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
