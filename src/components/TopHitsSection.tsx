import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import GameCard from "@/components/GameCard";
import { mockGames } from "@/data/mockGames";

const TopHitsSection = () => {
  const topHits = mockGames.slice(0, 3);

  // Build responsive grid column classes based on item count to keep layout centered and tidy
  const gridColsClass =
    topHits.length === 1
      ? "grid-cols-1"
      : topHits.length === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section id="games" className="bg-muted/50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Our Top Hits
        </h2>
        <p className="text-xl text-muted-foreground mb-12">
          Here are some of our top games
        </p>

        <div className="mb-12">
          <div className={`grid ${gridColsClass} gap-6 justify-items-center mx-auto max-w-5xl`}>
            {topHits.map((game) => (
              <div key={game.id} className="w-full max-w-[320px]">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>

        <Button variant="gaming" size="lg" asChild>
          <Link to="/games" className="flex items-center gap-2">
            View all games
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default TopHitsSection;
