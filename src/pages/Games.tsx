import { useState } from "react";
import { useGames } from "@/hooks/useGames";
import { GameFilters as GameFiltersType } from "@/types/Game";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameSearch from "@/components/GameSearch";
import GameFilters from "@/components/GameFilters";
import GameGrid from "@/components/GameGrid";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Gamepad2, Filter, Grid3X3 } from "lucide-react";

const Games = () => {
  const { games, filters, updateFilters, totalGames, filteredGamesCount, isLoading } = useGames();
  const [showFilters, setShowFilters] = useState(true);

  const handleSearchChange = (search: string) => {
    updateFilters({
      ...filters,
      search,
    });
  };

  const handleFiltersChange = (newFilters: GameFiltersType) => {
    updateFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="hover:text-gaming-blue transition-colors">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Games</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-2xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient">
                Our Games
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Discover amazing experiences in our game collection
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl">
            <GameSearch
              value={filters.search || ""}
              onSearchChange={handleSearchChange}
              placeholder="Search games by name, category, or developer..."
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-6">
              <div className="gaming-card">
                <GameFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  totalGames={totalGames}
                  filteredGames={filteredGamesCount}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Grid3X3 className="w-4 h-4" />
                <span>{filteredGamesCount} games</span>
              </div>
            </div>

            {/* Games Grid */}
            <GameGrid
              games={games}
              loading={isLoading}
              hasSearched={!!(filters.search || filters.category || filters.onlyPopular || filters.onlyFeatured)}
              searchTerm={filters.search}
            />

            {/* Load More (Future Implementation) */}
            {games.length > 0 && (
              <div className="flex justify-center mt-12">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="hover:bg-gaming-blue hover:text-white transition-all duration-300"
                  disabled
                >
                  Load More Games (Coming Soon)
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Games;