import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
const TopHitsSection = () => {
  return <section id="games" className="bg-section-dark py-20 bg-transparent">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-section-dark-foreground mb-4">
          Our Top Hits
        </h2>
        <p className="text-xl text-section-dark-foreground/80 mb-12">
          Here are some of our top games
        </p>
        
        <div className="mb-12">
          {/* Games grid would go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Placeholder for game cards */}
            <div className="bg-section-dark-foreground/10 rounded-2xl p-6 h-64 flex items-center justify-center">
              <p className="text-section-dark-foreground/60">Game Preview</p>
            </div>
            <div className="bg-section-dark-foreground/10 rounded-2xl p-6 h-64 flex items-center justify-center">
              <p className="text-section-dark-foreground/60">Game Preview</p>
            </div>
            <div className="bg-section-dark-foreground/10 rounded-2xl p-6 h-64 flex items-center justify-center">
              <p className="text-section-dark-foreground/60">Game Preview</p>
            </div>
          </div>
        </div>

        <Button variant="gaming" size="lg" asChild>
          <a href="#all-games" className="flex items-center gap-2">
            View all games
            <ArrowRight className="w-5 h-5" />
          </a>
        </Button>
      </div>
    </section>;
};
export default TopHitsSection;