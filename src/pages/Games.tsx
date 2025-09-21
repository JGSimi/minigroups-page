import { useGames } from "@/hooks/useGames";
import GameGrid from "@/components/GameGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Games = () => {
  const { games, isLoading } = useGames();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Back to home</span>
              </Link>
            </Button>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Our Games
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Discover amazing experiences in our game collection
              </p>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <GameGrid games={games} loading={isLoading} />
      </main>
    </div>
  );
};

export default Games;
