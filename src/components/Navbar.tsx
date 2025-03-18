
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12 py-4 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold relative group">
            <span className="text-gradient animate-pulse-subtle">LinkGen</span>
            <span className="absolute inset-0 -z-10 animate-glow blur-lg bg-gradient-to-r from-linkedin via-linkedin-light to-linkedin opacity-75 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="absolute inset-0 -z-20 animate-move-gradient bg-gradient-to-r from-linkedin-light via-linkedin to-linkedin-light opacity-50 blur-xl"></span>
          </span>
        </Link>

        <div className="hidden md:flex items-center justify-center flex-1 space-x-10 ml-[12%]">
          <Link to="/" className="text-foreground hover:text-linkedin link-underline transition-colors font-medium tracking-wide text-base">
            Home
          </Link>
          <Link to="/pricing" className="text-foreground hover:text-linkedin link-underline transition-colors font-medium tracking-wide text-base">
            Pricing
          </Link>
          <Link to="/dashboard" className="text-foreground hover:text-linkedin link-underline transition-colors font-medium tracking-wide text-base">
            Dashboard
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Link to="/login">
            <Button variant="outline" className="rounded-full">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-linkedin hover:bg-linkedin-dark text-white rounded-full">
              Sign Up
            </Button>
          </Link>
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
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-foreground hover:text-linkedin py-2 px-4 rounded-md transition-colors font-medium tracking-wide text-center" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-linkedin py-2 px-4 rounded-md transition-colors font-medium tracking-wide text-center" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-linkedin py-2 px-4 rounded-md transition-colors font-medium tracking-wide text-center" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <hr className="border-border" />
            <Link to="/login" className="text-foreground hover:text-linkedin py-2 px-4 rounded-md transition-colors font-medium tracking-wide text-center" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-linkedin hover:bg-linkedin-dark text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>}
    </nav>;
};

export default Navbar;
