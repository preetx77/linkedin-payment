import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Us</h1>
          
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-lg text-muted-foreground mb-6">
              LinkGen is a cutting-edge AI-powered platform designed to help professionals and businesses create engaging LinkedIn content that resonates with their audience.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              Our mission is to empower professionals to build their personal brand and engage with their network effectively through high-quality, AI-generated content.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-6">
              Founded by a team of AI enthusiasts and social media experts, LinkGen was born from the recognition that professionals need better tools to maintain an active and engaging presence on LinkedIn.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Values</h2>
            <ul className="space-y-4 text-muted-foreground mb-6">
              <li>🎯 Innovation - Pushing the boundaries of AI technology</li>
              <li>💡 Quality - Delivering exceptional content generation</li>
              <li>🤝 Community - Building meaningful professional connections</li>
              <li>🔒 Trust - Maintaining the highest standards of privacy and security</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs; 