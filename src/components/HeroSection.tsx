import { Button } from "@/components/ui/button";
import { Gamepad2, Users, PlayCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="bg-hero-bg py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Do Big Studios
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="gaming" size="lg" asChild>
              <a href="#games" className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Explore our games
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#contact" className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                Talk to us
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gaming-blue mr-2" />
              <span className="text-4xl md:text-5xl font-bold text-foreground">0</span>
            </div>
            <p className="text-muted-foreground font-medium">Players playing our games</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <PlayCircle className="w-8 h-8 text-gaming-blue mr-2" />
              <span className="text-4xl md:text-5xl font-bold text-foreground">0+</span>
            </div>
            <p className="text-muted-foreground font-medium">Total play sessions</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Gamepad2 className="w-8 h-8 text-gaming-blue mr-2" />
              <span className="text-4xl md:text-5xl font-bold text-foreground">0</span>
            </div>
            <p className="text-muted-foreground font-medium">Games in our portfolio</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;