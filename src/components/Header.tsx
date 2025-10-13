import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Mail, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const NavLinks = ({ mobile = false, onLinkClick = () => {} }: { mobile?: boolean; onLinkClick?: () => void }) => (
  <nav className={mobile ? "flex flex-col space-y-4" : "hidden md:flex items-center space-x-8"}>
    <Button variant="nav-link" asChild onClick={onLinkClick}>
      <Link to="/">Home</Link>
    </Button>
    <Button variant="nav-link" asChild onClick={onLinkClick}>
      <Link to="/games">Our Games</Link>
    </Button>
    <Button variant="nav-link" asChild onClick={onLinkClick}>
      <a href="#about">About Us</a>
    </Button>
    <Button variant="nav-link" asChild onClick={onLinkClick}>
      <a href="#acquisitions">Game Acquisitions</a>
    </Button>
  </nav>
);

const Header = () => {
  const [atTop, setAtTop] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 50], [1, 0.95]);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setAtTop(currentScrollY < 8);

      // Smart scroll: hide on scroll down, show on scroll up
      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setPrevScrollY(currentScrollY);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prevScrollY]);

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full border-b border-border/50 header-theme-fade transition-all duration-300 ${
        atTop ? "bg-background" : "bg-background/80 backdrop-blur-md shadow-lg"
      }`}
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ opacity }}
    >
      <motion.div
        className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.img
            src="/assets/mini-groups-logo.png"
            alt="Mini Groups Logo"
            className="w-8 h-8 object-contain"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.span
            className="text-xl font-bold text-foreground"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Mini Groups
          </motion.span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <NavLinks />

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src="/assets/mini-groups-logo.png"
                    alt="Mini Groups Logo"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-xl font-bold text-foreground">Mini Groups</span>
                </div>

                <NavLinks mobile onLinkClick={() => setIsOpen(false)} />

                <div className="border-t border-border pt-4 mt-4">
                  <Button variant="gaming" size="lg" className="w-full" asChild onClick={() => setIsOpen(false)}>
                    <a href="#contact" className="flex items-center gap-2 justify-center">
                      <Mail className="w-4 h-4" />
                      Talk to us
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Button variant="gaming" size="sm" asChild>
              <a href="#contact" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Talk to us
              </a>
            </Button>
          </div>

          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
