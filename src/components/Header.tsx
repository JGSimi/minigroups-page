import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  return (
    <header className="w-full bg-background border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/assets/mini-groups-logo.png" 
            alt="Mini Groups Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold text-foreground">Mini Groups</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Button variant="nav-link" asChild>
            <a href="#home">Home</a>
          </Button>
          <Button variant="nav-link" asChild>
            <a href="#games">Our Games</a>
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
    </header>
  );
};

export default Header;