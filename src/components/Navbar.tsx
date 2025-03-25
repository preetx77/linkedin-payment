import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12 py-4 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl text-gradient font-bold animate-pulse-subtle relative after:content-[''] after:absolute after:inset-0 after:blur-lg after:bg-linkedin/30 after:-z-10">LinkGen</span>
        </Link>

        <div className="hidden md:flex items-center justify-center space-x-10 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="text-foreground hover:text-linkedin link-underline transition-colors font-medium tracking-wide text-base">
            Home
          </Link>
          <Link to="/pricing" className="text-foreground hover:text-linkedin link-underline transition-colors font-medium tracking-wide text-base">
            Pricing
          </Link>
          {user && (
            <Link to="/dashboard" className="text-foreground hover:text-linkedin link-underline transition-colors font-medium tracking-wide text-base">
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          {user ? (
            <Button 
              variant="outline" 
              className="rounded-full flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 group"
              onClick={handleLogout}
            >
              <LogOut size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="rounded-full">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-linkedin hover:bg-linkedin-dark text-white rounded-full">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-full">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {isMenuOpen && <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="text-foreground hover:text-linkedin py-2 px-4 rounded-md transition-colors font-medium tracking-wide text-center" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-linkedin py-2 px-4 rounded-md transition-colors font-medium tracking-wide text-center" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </Link>
            {user && (
              <Link to="/dashboard" className="text-foreground hover:text-linkedin py-2 px-4 rounded-md transition-colors font-medium tracking-wide text-center" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
            )}
            <hr className="border-border my-2" />
            {user ? (
              <Button 
                className="w-full hover:bg-red-600/90 text-white flex items-center justify-center gap-2 group transition-all duration-300"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login" className="text-foreground hover:text-linkedin py-2 px-4 rounded-md transition-colors font-medium tracking-wide text-center" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-linkedin hover:bg-linkedin-dark text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>}
    </nav>;
};

export default Navbar;
