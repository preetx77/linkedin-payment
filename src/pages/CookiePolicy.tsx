import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-lg text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us make the site work better for you.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Keep you signed in to your account</li>
                <li>Improve our website and services</li>
              </ul>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
              <p className="text-muted-foreground mb-4">
                We use both session cookies (which expire when you close your browser) and persistent cookies (which stay on your device until you delete them).
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Most web browsers allow you to control cookies through their settings. You can delete existing cookies and set your browser to prevent new ones from being placed.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">5. Changes to This Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CookiePolicy; 