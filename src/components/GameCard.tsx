import { Game } from "@/types/Game";
import { Users, ExternalLink, Info, Heart, Sparkles } from "lucide-react";
import { memo, useCallback, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface GameCardProps {
  game: Game;
  onDetailsClick?: (game: Game) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (gameId: string) => void;
}

const GameCard = memo(({ game, onDetailsClick, isFavorite = false, onToggleFavorite }: GameCardProps) => {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 20 });

  // Enhanced 3D rotations with more intensity
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["-20deg", "20deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["20deg", "-20deg"]);

  // Z-axis translation for "lifting" effect
  const translateZ = useTransform(
    [mouseXSpring, mouseYSpring],
    ([latestX, latestY]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return distance * 40; // Lift up to 40px
    }
  );

  // Dynamic shadow based on mouse position - more dramatic
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], ["-30px", "30px"]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], ["-30px", "30px"]);
  const shadowBlur = useTransform(
    [mouseXSpring, mouseYSpring],
    ([latestX, latestY]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return 40 + distance * 30; // Shadow blur increases with tilt
    }
  );

  // Glare effect position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useTransform(
    [mouseXSpring, mouseYSpring],
    ([latestX, latestY]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return Math.min(distance * 0.8, 0.4); // Max 40% opacity
    }
  );

  // Parallax effect for inner elements - move in opposite direction for depth
  const parallaxX = useTransform(mouseXSpring, [-0.5, 0.5], [15, -15]);
  const parallaxY = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]);

  const formatNumber = useCallback((count: number) => {
    if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLAnchorElement>) => {
    // Disable mouse tracking on mobile for better performance
    if (isMobile || !isHovered) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Generate sparkles on hover - fewer on mobile for better performance
    const sparkleCount = isMobile ? 3 : 6;
    const newSparkles = Array.from({ length: sparkleCount }, (_, i) => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.1,
    }));
    setSparkles(newSparkles);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setSparkles([]);
    x.set(0);
    y.set(0);
  };

  // Counter animation effect
  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => {
        // Trigger counter animations
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  const handleDetailsClick = (e: React.MouseEvent) => {
    if (onDetailsClick) {
      e.preventDefault();
      e.stopPropagation();
      onDetailsClick(game);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(game.id);
    }
  };

  const CardContent = () => (
    <>
      <motion.div
        className="aspect-square overflow-hidden rounded-xl relative group card-shine card-glow-border"
        style={{
          // Disable 3D effects on mobile for better performance
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          translateZ: isMobile ? 0 : (isHovered ? translateZ : 0),
          transformStyle: isMobile ? "flat" : "preserve-3d",
          perspective: isMobile ? "none" : "1000px",
        }}
        animate={{
          scale: isHovered ? (isMobile ? 1.02 : 1.05) : 1,
          boxShadow: isHovered
            ? isMobile
              ? "0 12px 30px -5px hsl(var(--gaming-blue) / 0.25)" // Simpler shadow on mobile
              : [
                  `${shadowX.get()}px ${shadowY.get()}px ${shadowBlur.get()}px -10px hsl(var(--gaming-blue) / 0.3)`,
                  `${shadowX.get()}px ${shadowY.get()}px ${shadowBlur.get()}px -10px hsl(var(--gaming-purple) / 0.4)`,
                  `${shadowX.get()}px ${shadowY.get()}px ${shadowBlur.get()}px -10px hsl(var(--gaming-blue) / 0.3)`,
                ]
            : "0 8px 25px -5px hsl(240 10% 3.9% / 0.08)",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          boxShadow: isMobile
            ? { duration: 0.3 }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.3 },
        }}
      >
        {/* Dynamic glare/reflection effect - disabled on mobile */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255, 255, 255, 0.8) 0%, transparent 50%)`,
              opacity: glareOpacity,
              mixBlendMode: "overlay",
            }}
          />
        )}
        {/* Sparkle particles */}
        <AnimatePresence>
          {isHovered &&
            sparkles.map((sparkle) => (
              <motion.div
                key={sparkle.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${sparkle.x}%`,
                  top: `${sparkle.y}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: sparkle.delay,
                  ease: "easeOut",
                }}
              >
                <Sparkles className="w-3 h-3 text-gaming-purple" />
              </motion.div>
            ))}
        </AnimatePresence>

        <motion.img
          src={game.thumbnail}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Favorite button with enhanced animation and parallax */}
        {onToggleFavorite && (
          <motion.button
            onClick={handleFavoriteClick}
            className="absolute top-2 md:top-3 right-2 md:right-3 bg-black/70 backdrop-blur-md rounded-full hover:bg-black/90 z-20 border border-white/10"
            style={{
              // Larger touch target on mobile (min 44x44px)
              padding: isMobile ? "10px" : "10px",
              minWidth: isMobile ? "40px" : "auto",
              minHeight: isMobile ? "40px" : "auto",
              // Disable parallax on mobile
              x: isMobile ? 0 : parallaxX,
              y: isMobile ? 0 : parallaxY,
              translateZ: isMobile ? "0" : "20px",
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            animate={isFavorite ? {
              boxShadow: [
                "0 0 0 0 rgba(239, 68, 68, 0.4)",
                "0 0 0 8px rgba(239, 68, 68, 0)",
              ]
            } : {}}
            transition={{
              boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <motion.div
              initial={false}
              animate={isFavorite ? {
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ duration: 0.4, ease: "backOut" }}
            >
              <Heart
                className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${
                  isFavorite
                    ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                    : "text-white/90 hover:text-white"
                }`}
              />
            </motion.div>
          </motion.button>
        )}

        {/* Enhanced hover overlay - semi-visible on mobile for better discoverability */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-center justify-center gap-3 md:gap-5"
          initial={{ opacity: isMobile ? 0.5 : 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {game.url && (
            <motion.div
              className="bg-primary/90 backdrop-blur-md rounded-full border-2 border-white/20 shadow-lg"
              style={{
                // Larger touch target on mobile
                padding: isMobile ? "10px" : "12px",
                minWidth: isMobile ? "44px" : "auto",
                minHeight: isMobile ? "44px" : "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // Disable parallax on mobile
                x: isMobile ? 0 : parallaxX,
                y: isMobile ? 0 : parallaxY,
                translateZ: isMobile ? "0" : "30px",
              }}
              initial={{ scale: 0, rotate: -180, y: 20 }}
              whileInView={{ scale: 1, rotate: 0, y: 0 }}
              whileHover={{
                scale: 1.15,
                rotate: 5,
                boxShadow: "0 0 20px rgba(0, 0, 153, 0.5)",
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <ExternalLink className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </motion.div>
          )}
          {onDetailsClick && (
            <motion.button
              onClick={handleDetailsClick}
              className="bg-secondary/90 backdrop-blur-md rounded-full border-2 border-white/20 shadow-lg"
              aria-label="View game details"
              style={{
                // Larger touch target on mobile
                padding: isMobile ? "10px" : "12px",
                minWidth: isMobile ? "44px" : "auto",
                minHeight: isMobile ? "44px" : "auto",
                // Disable parallax on mobile
                x: isMobile ? 0 : parallaxX,
                y: isMobile ? 0 : parallaxY,
                translateZ: isMobile ? "0" : "30px",
              }}
              initial={{ scale: 0, rotate: 180, y: 20 }}
              whileInView={{ scale: 1, rotate: 0, y: 0 }}
              whileHover={{
                scale: 1.15,
                rotate: -5,
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <Info className="w-5 h-5 md:w-6 md:h-6 text-secondary-foreground" />
            </motion.button>
          )}
        </motion.div>

        {/* Online status indicator with parallax - disabled on mobile */}
        {game.playersOnline > 0 && (
          <motion.div
            className="absolute top-2 md:top-3 left-2 md:left-3 px-2 md:px-3 py-1 md:py-1.5 bg-green-500/90 backdrop-blur-md rounded-full flex items-center gap-1 md:gap-1.5 border border-green-400/30 shadow-lg"
            style={{
              x: isMobile ? 0 : parallaxX,
              y: isMobile ? 0 : parallaxY,
              translateZ: isMobile ? "0" : "20px",
            }}
            initial={{ scale: 0, x: -20 }}
            animate={{ scale: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <motion.div
              className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-200 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-[10px] md:text-xs font-semibold text-white">ONLINE</span>
          </motion.div>
        )}
      </motion.div>

      <motion.h3
        className="text-sm md:text-base font-bold text-foreground line-clamp-1 mt-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ x: 2, color: "hsl(var(--gaming-blue))" }}
        transition={{ delay: 0.1, duration: 0.2 }}
      >
        {game.title}
      </motion.h3>

      <motion.div
        className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-2 md:gap-4 flex-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2 py-0.5 md:py-1 bg-muted/50 rounded-md hover:bg-muted transition-colors"
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.span
            className="font-semibold text-foreground"
            animate={isHovered ? {
              color: ["hsl(var(--foreground))", "hsl(var(--gaming-blue))", "hsl(var(--foreground))"]
            } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            Visits:
          </motion.span>
          <motion.span
            className="font-medium tabular-nums"
            animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {formatNumber(game.visits)}
          </motion.span>
        </motion.div>

        <motion.div
          className="flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2 py-0.5 md:py-1 bg-muted/50 rounded-md hover:bg-muted transition-colors"
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.div
            animate={isHovered ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Users className="w-3 h-3 md:w-3.5 md:h-3.5 text-gaming-blue" />
          </motion.div>
          <motion.span
            className="font-semibold text-foreground"
            animate={isHovered ? {
              color: ["hsl(var(--foreground))", "hsl(var(--gaming-purple))", "hsl(var(--foreground))"]
            } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            Playing:
          </motion.span>
          <motion.span
            className="font-medium tabular-nums"
            animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {formatNumber(game.playersOnline)}
          </motion.span>
        </motion.div>
      </motion.div>
    </>
  );

  if (game.url) {
    return (
      <motion.a
        href={game.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-3 cursor-pointer"
        style={{
          // Disable 3D perspective on mobile for better performance
          perspective: isMobile ? "none" : "1000px",
          transformStyle: isMobile ? "flat" : "preserve-3d",
        }}
        onMouseMove={isMobile ? undefined : handleMouseMove}
        onMouseEnter={isMobile ? undefined : handleMouseEnter}
        onMouseLeave={isMobile ? undefined : handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardContent />
      </motion.a>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-3"
      style={{
        // Disable 3D perspective on mobile for better performance
        perspective: isMobile ? "none" : "1000px",
        transformStyle: isMobile ? "flat" : "preserve-3d",
      }}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onMouseEnter={isMobile ? undefined : handleMouseEnter}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardContent />
    </motion.div>
  );
});

GameCard.displayName = "GameCard";

export default GameCard;
