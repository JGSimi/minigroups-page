import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState } from "react";

const Header = () => {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-border/50 header-theme-fade transition-colors duration-300 ${
        atTop ? "bg-background" : "bg-background/50 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <img 
            src="/assets/mini-groups-logo.png" 
            alt="Mini Groups Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold text-foreground">Mini Groups</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center space-x-8">
            <Button variant="nav-link" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="nav-link" asChild>
              <Link to="/games">Our Games</Link>
            </Button>
            <Button variant="nav-link" asChild>
              <a href="#about">About Us</a>
            </Button>
            <Button variant="nav-link" asChild>
              <a href="#acquisitions">Game Acquisitions</a>
            </Button>
          </nav>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="gaming" size="sm" asChild>
              <a href="#contact" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Talk to us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
