import { useGames } from "@/hooks/useGames";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameGrid from "@/components/GameGrid";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Gamepad2 } from "lucide-react";

const Games = () => {
  const { games, isLoading } = useGames();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
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

      <Footer />
    </div>
  );
};

export default Games;
