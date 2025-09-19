import { Button } from "@/components/ui/button";
import { ArrowRight, Gamepad2, PlayCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import HoverLift from "@/components/motion/HoverLift";
const TopHitsSection = () => {
return <section id="games" className="bg-muted/50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Our Top Hits
        </h2>
        <p className="text-xl text-muted-foreground mb-12">
          Here are some of our top games
        </p>
        
        <div className="mb-12">
          {/* Games grid would go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Enhanced Placeholder for game cards */}
            <HoverLift className="gaming-card h-64 flex flex-col items-center justify-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gaming-blue/10 to-gaming-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-full flex items-center justify-center mb-4 animate-float">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <p className="text-foreground font-semibold mb-2">Game Preview</p>
                <p className="text-muted-foreground text-sm">Coming Soon</p>
              </div>
            </HoverLift>
<HoverLift className="gaming-card h-64 flex flex-col items-center justify-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gaming-cyan/10 to-gaming-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-gaming-cyan to-gaming-pink rounded-full flex items-center justify-center mb-4 animate-float" style={{animationDelay: '2s'}}>
                  <PlayCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-foreground font-semibold mb-2">Game Preview</p>
                <p className="text-muted-foreground text-sm">Coming Soon</p>
              </div>
</HoverLift>
            <HoverLift className="gaming-card h-64 flex flex-col items-center justify-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/10 to-gaming-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-gaming-purple to-gaming-blue rounded-full flex items-center justify-center mb-4 animate-float" style={{animationDelay: '4s'}}>
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-foreground font-semibold mb-2">Game Preview</p>
                <p className="text-muted-foreground text-sm">Coming Soon</p>
              </div>
            </HoverLift>
          </div>
        </div>

        <Button variant="gaming" size="lg" asChild>
          <Link to="/games" className="flex items-center gap-2">
            View all games
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
      </div>
    </section>;
};
export default TopHitsSection;
