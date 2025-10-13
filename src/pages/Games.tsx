import { useGames } from "@/hooks/useGames";
import { useFavorites } from "@/hooks/useFavorites";
import GameGrid from "@/components/GameGrid";
import GameDetailsModal from "@/components/GameDetailsModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Game } from "@/types/Game";

const Games = () => {
  const { games, isLoading } = useGames();
  const { favorites, toggleFavorite } = useFavorites();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Browse All Games"
        description="Explore all amazing Roblox games from Mini Groups Studio. Join millions of players in our immersive gaming experiences."
        keywords="roblox games, mini groups games, all games, game collection, multiplayer games"
      />
      <Header />
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
        <GameGrid
          games={games}
          loading={isLoading}
          onGameClick={handleGameClick}
          favoriteIds={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </main>
      <Footer />

      {/* Game Details Modal */}
      <GameDetailsModal
        game={selectedGame}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Games;
