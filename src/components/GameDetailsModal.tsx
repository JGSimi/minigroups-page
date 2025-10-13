import { Game } from "@/types/Game";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, Star, Calendar, ExternalLink } from "lucide-react";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GameDetailsModalProps {
  game: Game | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GameDetailsModal = memo(({ game, open, onOpenChange }: GameDetailsModalProps) => {
  if (!game) return null;

  const formatNumber = (count: number) => {
    if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    }),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <AnimatePresence>
          {open && (
            <>
              <DialogHeader>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogTitle className="text-2xl">{game.title}</DialogTitle>
                  <DialogDescription>
                    by {game.developer}
                  </DialogDescription>
                </motion.div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Game Image */}
                <motion.div
                  className="aspect-video w-full overflow-hidden rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <motion.img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Users, label: "Playing", value: formatNumber(game.playersOnline) },
                    { icon: Eye, label: "Visits", value: formatNumber(game.visits) },
                    { icon: Star, label: "Rating", value: game.rating.toFixed(1) },
                    { icon: Calendar, label: "Created", value: new Date(game.createdAt).getFullYear().toString() },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="flex flex-col items-center p-4 bg-muted rounded-lg"
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={statsVariants}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <stat.icon className="w-6 h-6 mb-2 text-primary" />
                      </motion.div>
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <span className="text-lg font-bold">{stat.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground leading-relaxed">{game.description}</p>
                </motion.div>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map((tag, i) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.7 + i * 0.05,
                        }}
                        whileHover={{ scale: 1.1, y: -2 }}
                      >
                        <Badge variant="secondary">{tag}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div>
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <span className="ml-2 font-semibold">{game.category}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Last Updated:</span>
                    <span className="ml-2 font-semibold">{formatDate(game.lastUpdated)}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge className="ml-2" variant={game.isPopular ? "default" : "outline"}>
                      {game.isPopular ? "Popular" : "Active"}
                    </Badge>
                  </div>
                  {game.featured && (
                    <div>
                      <span className="text-sm text-muted-foreground">Featured:</span>
                      <Badge className="ml-2" variant="default">
                        Yes
                      </Badge>
                    </div>
                  )}
                </motion.div>

                {/* Action Buttons */}
                {game.url && (
                  <motion.div
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <motion.div
                      className="flex-1"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button asChild className="w-full animate-pulse-glow" size="lg">
                        <a href={game.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Play Now
                        </a>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
});

GameDetailsModal.displayName = "GameDetailsModal";

export default GameDetailsModal;
