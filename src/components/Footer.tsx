import { Link } from "react-router-dom";
import { Mail} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <img
                src="/assets/mini-groups-logo.png"
                alt="Mini Groups Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-foreground">
                Mini Groups
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto md:mx-0">
              Creating amazing gaming experiences for millions of players
              worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <div>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-gaming-blue transition-colors text-sm"
                >
                  Home
                </Link>
              </div>
              <div>
                <Link
                  to="/games"
                  className="text-muted-foreground hover:text-gaming-blue transition-colors text-sm"
                >
                  Our Games
                </Link>
              </div>
              <div>
                <a
                  href="#about"
                  className="text-muted-foreground hover:text-gaming-blue transition-colors text-sm"
                >
                  About Us
                </a>
              </div>
              <div>
                <a
                  href="#acquisitions"
                  className="text-muted-foreground hover:text-gaming-blue transition-colors text-sm"
                >
                  Game Acquisitions
                </a>
              </div>
            </nav>
          </div>

          {/* Contact */}
          <div className="text-left md:text-right">
            <div className="space-y-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-gaming-blue transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Mini Groups LTDA.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
