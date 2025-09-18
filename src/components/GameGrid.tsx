import { Game } from "@/types/Game";
import GameCard from "@/components/GameCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2, Search } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface GameGridProps {
  games: Game[];
  loading?: boolean;
  hasSearched?: boolean;
  searchTerm?: string;
}

const GameGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="gaming-card">
        <Skeleton className="w-full h-48 rounded-lg mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ hasSearched, searchTerm }: { hasSearched?: boolean; searchTerm?: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {hasSearched ? (
      <>
        <Search className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No games found
        </h3>
        <p className="text-muted-foreground max-w-md">
          {searchTerm 
            ? `We couldn't find any games matching "${searchTerm}". Try adjusting your search or filters.`
            : "No games match your current filters. Try adjusting your selection."
          }
        </p>
      </>
    ) : (
      <>
        <Gamepad2 className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No games available
        </h3>
        <p className="text-muted-foreground">
          Games will appear here once they're loaded.
        </p>
      </>
    )}
  </div>
);

const GameGrid = ({ games, loading = false, hasSearched = false, searchTerm }: GameGridProps) => {
  if (loading) {
    return <GameGridSkeleton />;
  }

  if (games.length === 0) {
    return <EmptyState hasSearched={hasSearched} searchTerm={searchTerm} />;
  }

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      whileInView="show"
      // Replay animations whenever the grid re-enters the viewport
      viewport={{ amount: 0.2, once: false }}
      style={{ willChange: "opacity, transform" }}
    >
      {games.map((game) => (
        <motion.div key={game.id} variants={item}>
          <GameCard game={game} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default GameGrid;