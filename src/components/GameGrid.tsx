import { Game } from "@/types/Game";
import GameCard from "@/components/GameCard";
import GameCardSkeleton from "@/components/GameCardSkeleton";
import { Gamepad2, Search } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { memo } from "react";

interface GameGridProps {
  games: Game[];
  loading?: boolean;
  hasSearched?: boolean;
  searchTerm?: string;
  onGameClick?: (game: Game) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (gameId: string) => void;
}

const GameGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: 12 }).map((_, i) => (
      <GameCardSkeleton key={i} />
    ))}
  </div>
);

const EmptyState = ({ hasSearched, searchTerm }: { hasSearched?: boolean; searchTerm?: string }) => (
  <motion.div
    className="flex flex-col items-center justify-center py-16 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    {hasSearched ? (
      <>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <Search className="w-16 h-16 text-muted-foreground mb-4" />
        </motion.div>
        <motion.h3
          className="text-xl font-semibold text-foreground mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          No games found
        </motion.h3>
        <motion.p
          className="text-muted-foreground max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {searchTerm
            ? `We couldn't find any games matching "${searchTerm}". Try adjusting your search or filters.`
            : "No games match your current filters. Try adjusting your selection."
          }
        </motion.p>
      </>
    ) : (
      <>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <Gamepad2 className="w-16 h-16 text-muted-foreground mb-4" />
        </motion.div>
        <motion.h3
          className="text-xl font-semibold text-foreground mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          No games available
        </motion.h3>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Games will appear here once they're loaded.
        </motion.p>
      </>
    )}
  </motion.div>
);

const GameGrid = memo(({ games, loading = false, hasSearched = false, searchTerm, onGameClick, favoriteIds = [], onToggleFavorite }: GameGridProps) => {
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
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
        when: "beforeChildren",
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      }
    }
  };

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.1, once: true }}
      style={{ willChange: "opacity, transform" }}
    >
      {games.map((game, index) => (
        <motion.div
          key={game.id}
          variants={item}
          custom={index}
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <GameCard
            game={game}
            onDetailsClick={onGameClick}
            isFavorite={favoriteIds.includes(game.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </motion.div>
      ))}
    </motion.div>
  );
});

GameGrid.displayName = "GameGrid";

export default GameGrid;