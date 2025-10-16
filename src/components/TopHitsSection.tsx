import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import GameCard from "@/components/GameCard";
import { useGames } from "@/hooks/useGames";
import { motion } from "framer-motion";

const TopHitsSection = () => {
  const { allGames, isLoading } = useGames();

  // Sort games by active players and get top 3
  const topHits = [...allGames]
    .sort((a, b) => b.playersOnline - a.playersOnline)
    .slice(0, 3);

  // Build responsive grid column classes based on item count to keep layout centered and tidy
  const gridColsClass =
    topHits.length === 1
      ? "grid-cols-1 max-w-sm"
      : topHits.length === 2
      ? "grid-cols-2 sm:grid-cols-2"
      : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const featuredItemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.85 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  return (
    <section id="games" className="bg-muted/50 py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Our Top Hits
        </motion.h2>
        <motion.p
          className="text-xl text-muted-foreground mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Here are some of our top games
        </motion.p>

        <div className="mb-12">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <motion.div
                className="rounded-full h-12 w-12 border-b-2 border-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : topHits.length === 3 ? (
            // Special layout:
            // Mobile: Grid 2x2 (2 side games on top row, featured game spanning 2 columns below)
            // Desktop: Horizontal layout with featured game in center
            <motion.div
              className="mx-auto max-w-7xl"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Mobile Layout: Grid */}
              <div className="lg:hidden grid grid-cols-2 gap-4 mb-4">
                {/* Left game (2nd most popular) */}
                <motion.div variants={itemVariants}>
                  <GameCard game={topHits[1]} />
                </motion.div>

                {/* Right game (3rd most popular) */}
                <motion.div variants={itemVariants}>
                  <GameCard game={topHits[2]} />
                </motion.div>
              </div>

              {/* Featured game - Full width on mobile, centered on desktop */}
              <motion.div
                className="lg:hidden w-full max-w-md mx-auto relative p-2"
                variants={featuredItemVariants}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white">
                    👑 MOST POPULAR
                  </span>
                </div>
                <div className="ring-2 ring-primary rounded-xl p-3">
                  <GameCard game={topHits[0]} />
                </div>
              </motion.div>

              {/* Desktop Layout: Horizontal */}
              <div className="hidden lg:flex items-center justify-center gap-6">
                {/* Left game (2nd most popular) */}
                <motion.div
                  className="w-full max-w-[300px] mt-12"
                  variants={itemVariants}
                >
                  <GameCard game={topHits[1]} />
                </motion.div>

                {/* Center game (most popular) - FEATURED */}
                <motion.div
                  className="w-full max-w-[400px] relative p-2"
                  variants={featuredItemVariants}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border-2 border-white">
                      👑 MOST POPULAR
                    </span>
                  </div>
                  <div className="ring-2 ring-primary rounded-xl p-4">
                    <GameCard game={topHits[0]} />
                  </div>
                </motion.div>

                {/* Right game (3rd most popular) */}
                <motion.div
                  className="w-full max-w-[300px] mt-12"
                  variants={itemVariants}
                >
                  <GameCard game={topHits[2]} />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            // Fallback to regular grid for < 3 games
            <motion.div
              className={`grid ${gridColsClass} gap-4 md:gap-6 justify-items-center mx-auto max-w-5xl`}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {topHits.map((game, index) => (
                <motion.div
                  key={game.id}
                  className="w-full"
                  variants={itemVariants}
                  custom={index}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="gaming" size="lg" asChild>
              <Link to="/games" className="flex items-center gap-2">
                View all games
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TopHitsSection;
