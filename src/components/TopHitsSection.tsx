import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
            {/* Placeholder for game cards */}
            <div className="bg-card border rounded-2xl p-6 h-64 flex items-center justify-center hover:shadow-lg transition-shadow">
              <p className="text-muted-foreground">Game Preview</p>
            </div>
            <div className="bg-card border rounded-2xl p-6 h-64 flex items-center justify-center hover:shadow-lg transition-shadow">
              <p className="text-muted-foreground">Game Preview</p>
            </div>
            <div className="bg-card border rounded-2xl p-6 h-64 flex items-center justify-center hover:shadow-lg transition-shadow">
              <p className="text-muted-foreground">Game Preview</p>
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