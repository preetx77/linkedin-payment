import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Careers = () => {
  const openPositions = [
    {
      title: "Senior Full Stack Developer",
      location: "Remote",
      type: "Full-time",
      description: "We're looking for an experienced Full Stack Developer to help build and scale our AI-powered platform."
    },
    {
      title: "AI/ML Engineer",
      location: "Remote",
      type: "Full-time",
      description: "Join us in developing cutting-edge AI models for content generation and analysis."
    },
    {
      title: "Product Designer",
      location: "Remote",
      type: "Full-time",
      description: "Help shape the future of our product with beautiful, intuitive designs."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Join Our Team</h1>
          
          <div className="prose prose-lg dark:prose-invert mb-12">
            <p className="text-lg text-muted-foreground">
              We're building the future of AI-powered content generation. Join us in our mission to help professionals create engaging content and build their personal brand.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold mb-8">Open Positions</h2>
          
          <div className="grid gap-6">
            {openPositions.map((position, index) => (
              <div key={index} className="glass-card p-6 rounded-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      <span>{position.location}</span>
                      <span>•</span>
                      <span>{position.type}</span>
                    </div>
                    <p className="text-muted-foreground">{position.description}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button className="rounded-full" variant="outline" disabled>
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Don't see a perfect fit?</h2>
            <p className="text-muted-foreground mb-8">
              We're always looking for talented individuals to join our team. Send us your resume and let us know how you can contribute.
            </p>
            <Button variant="outline" className="rounded-full" disabled>
              Send Open Application
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers; 