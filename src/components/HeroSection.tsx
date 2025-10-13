import { Button } from "@/components/ui/button";
import { Gamepad2, PlayCircle, ChevronDown } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
// import HeroBackground3D from "@/components/HeroBackground3D";
import { useGames } from "@/hooks/useGames";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const [showIndicator, setShowIndicator] = useState(true);
  const { allGames } = useGames();

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const onScroll = () => setShowIndicator(window.scrollY < 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stats = useMemo(() => {
    const totalPlayers = allGames.reduce((sum, game) => sum + game.playersOnline, 0);
    const totalVisits = allGames.reduce((sum, game) => sum + game.visits, 0);

    return {
      players: totalPlayers.toLocaleString(),
      visits: totalVisits >= 1_000_000_000
        ? `${(totalVisits / 1_000_000_000).toFixed(1)}B+`
        : totalVisits >= 1_000_000
        ? `${(totalVisits / 1_000_000).toFixed(1)}M+`
        : totalVisits.toLocaleString()
    };
  }, [allGames]);

  return (
    <section id="home" className="relative isolate overflow-hidden min-h-screen flex items-center py-20 hero-bg">
      {/* Interactive 3D background */}
      {/* <HeroBackground3D className="" minBreakpoint="none" /> */}

      <motion.div
        className="container mx-auto px-4 relative z-10"
        style={{ y, opacity }}
      >
        <div className="text-center mb-4">
          <motion.h1
            className="text-6xl md:text-8xl font-black mb-4"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.6, 0.05, 0.01, 0.9],
            }}
          >
            <span className="sr-only">Mini Groups</span>
            <motion.img
              src="/assets/mini-groups-logo-completa.png"
              alt="Mini Groups"
              className="mx-auto w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] h-auto"
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, -2, 0] }}
              transition={{ duration: 0.5 }}
            />
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Experience the future of Roblox gaming with our innovative and engaging game portfolio
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="gaming" size="lg" asChild>
                  <a href="#games" className="flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5" />
                    Explore our games
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="gaming-outline" size="lg" asChild>
                <a href="#contact" className="flex items-center gap-1">
                  <PlayCircle className="w-5 h-5" />
                  Talk to us
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center mb-2">
              <motion.span
                className="text-4xl md:text-5xl font-bold text-foreground"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
              >
                {stats.players}
              </motion.span>
            </div>
            <p className="text-foreground font-medium">Players playing our games</p>
          </motion.div>

          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center mb-2">
              <motion.span
                className="text-4xl md:text-5xl font-bold text-foreground"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9, type: "spring" }}
              >
                {stats.visits}
              </motion.span>
            </div>
            <p className="text-foreground font-medium">Total visits</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator: fixed to viewport until user scrolls */}
      <motion.div
        className="fixed inset-x-0 bottom-4 z-[60] flex justify-center text-foreground/70 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: showIndicator ? 1 : 0,
          y: showIndicator ? 0 : -20,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-7 h-7 drop-shadow-sm" />
        </motion.div>
        <span className="sr-only">Scroll down</span>
      </motion.div>
    </section>
  );
};
export default HeroSection;
