import { Button } from "@/components/ui/button";
import { Gamepad2, Users, PlayCircle } from "lucide-react";
const HeroSection = () => {
  return (
<section id="home" className="hero-bg min-h-screen flex items-center py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black mb-6 animate-slide-up">
            <span className="sr-only">Mini Groups</span>
            <img
              src="/assets/mini-groups-logo-completa.png"
              alt="Mini Groups"
              className="mx-auto w-[360px] max-w-[40vw] h-auto"
            />
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
            Experience the future of Roblox gaming with our innovative and engaging game portfolio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16" style={{animationDelay: '0.4s'}}>
            <Button variant="gaming" size="lg" className="animate-fade-in hover-lift" asChild>
              <a href="#games" className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Explore our games
              </a>
            </Button>
            <Button variant="gaming-outline" size="lg" className="animate-fade-in hover-lift" asChild>
              <a href="#contact" className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                Talk to us
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl md:text-5xl font-bold text-foreground">999</span>
            </div>
            <p className="text-foreground font-medium">Players playing our games</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl md:text-5xl font-bold text-foreground">999+</span>
            </div>
            <p className="text-foreground font-medium">Total play sessions</p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;