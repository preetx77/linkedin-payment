import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-lg text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using LinkGenn's services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground mb-4">
                LinkGenn provides an AI-powered platform for generating and managing LinkedIn content. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground mb-4">
                You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">4. Content Guidelines</h2>
              <p className="text-muted-foreground mb-4">
                Users must ensure that all content generated through our platform complies with LinkedIn's terms of service and community guidelines.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                The LinkGenn platform, including its original content and features, is owned by LinkGenn and protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService; 