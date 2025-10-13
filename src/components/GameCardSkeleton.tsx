import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";
import { motion } from "framer-motion";

const GameCardSkeleton = memo(() => {
  return (
    <motion.div
      className="flex flex-col gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Thumbnail skeleton with shimmer effect */}
      <div className="aspect-square overflow-hidden rounded-xl bg-muted relative">
        <motion.div
          className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0.5,
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <Skeleton className="w-full h-full" />

        {/* Pulsing dots for visual interest */}
        <div className="absolute top-3 right-3 flex gap-1">
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-muted-foreground/30 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Title skeleton with animated width */}
      <motion.div
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Skeleton className="h-5 w-3/4" />
      </motion.div>

      {/* Stats skeleton with stagger animation */}
      <div className="flex items-center gap-4">
        <motion.div
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        >
          <Skeleton className="h-7 w-24 rounded-md" />
        </motion.div>
        <motion.div
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        >
          <Skeleton className="h-7 w-28 rounded-md" />
        </motion.div>
      </div>

      {/* Subtle border glow animation */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: "0 0 0 1px hsl(var(--muted))",
        }}
        animate={{
          boxShadow: [
            "0 0 0 1px hsl(var(--muted))",
            "0 0 8px 1px hsl(var(--gaming-blue) / 0.1)",
            "0 0 0 1px hsl(var(--muted))",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
});

GameCardSkeleton.displayName = "GameCardSkeleton";

export default GameCardSkeleton;
