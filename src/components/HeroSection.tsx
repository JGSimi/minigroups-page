import { Button } from "@/components/ui/button";
import { Gamepad2, PlayCircle, ChevronDown } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
// import HeroBackground3D from "@/components/HeroBackground3D";
import { useGames } from "@/hooks/useGames";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

const HeroSection = () => {
  const [showIndicator, setShowIndicator] = useState(true);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const { allGames } = useGames();

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // 3D Tilt Effect for Logo
  const logoX = useMotionValue(0);
  const logoY = useMotionValue(0);

  const logoXSpring = useSpring(logoX, { stiffness: 250, damping: 20 });
  const logoYSpring = useSpring(logoY, { stiffness: 250, damping: 20 });

  // Enhanced 3D rotations
  const logoRotateX = useTransform(logoYSpring, [-0.5, 0.5], ["-20deg", "20deg"]);
  const logoRotateY = useTransform(logoXSpring, [-0.5, 0.5], ["20deg", "-20deg"]);

  // Z-axis translation for "lifting" effect
  const logoTranslateZ = useTransform(
    [logoXSpring, logoYSpring],
    ([latestX, latestY]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return distance * 50; // Lift up to 50px
    }
  );

  // Dynamic shadow
  const logoShadowX = useTransform(logoXSpring, [-0.5, 0.5], ["-40px", "40px"]);
  const logoShadowY = useTransform(logoYSpring, [-0.5, 0.5], ["-40px", "40px"]);
  const logoShadowBlur = useTransform(
    [logoXSpring, logoYSpring],
    ([latestX, latestY]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return 50 + distance * 40;
    }
  );

  // Glare effect
  const logoGlareX = useTransform(logoXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const logoGlareY = useTransform(logoYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const logoGlareOpacity = useTransform(
    [logoXSpring, logoYSpring],
    ([latestX, latestY]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return Math.min(distance * 1, 0.5); // Max 50% opacity for hero
    }
  );

  useEffect(() => {
    const onScroll = () => setShowIndicator(window.scrollY < 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mouse handlers for logo tilt
  const handleLogoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLogoHovered) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    logoX.set(xPct);
    logoY.set(yPct);
  };

  const handleLogoMouseEnter = () => {
    setIsLogoHovered(true);
  };

  const handleLogoMouseLeave = () => {
    setIsLogoHovered(false);
    logoX.set(0);
    logoY.set(0);
  };

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
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.6, 0.05, 0.01, 0.9],
            }}
          >
            <span className="sr-only">Mini Groups</span>
            <motion.div
              className="inline-block relative"
              onMouseMove={handleLogoMouseMove}
              onMouseEnter={handleLogoMouseEnter}
              onMouseLeave={handleLogoMouseLeave}
              style={{
                rotateX: logoRotateX,
                rotateY: logoRotateY,
                translateZ: isLogoHovered ? logoTranslateZ : 0,
                transformStyle: "preserve-3d",
              }}
              animate={{
                scale: isLogoHovered ? 1.08 : 1,
                boxShadow: isLogoHovered
                  ? [
                      `${logoShadowX.get()}px ${logoShadowY.get()}px ${logoShadowBlur.get()}px -10px hsl(var(--gaming-blue) / 0.4)`,
                      `${logoShadowX.get()}px ${logoShadowY.get()}px ${logoShadowBlur.get()}px -10px hsl(var(--gaming-purple) / 0.5)`,
                      `${logoShadowX.get()}px ${logoShadowY.get()}px ${logoShadowBlur.get()}px -10px hsl(var(--gaming-blue) / 0.4)`,
                    ]
                  : "0 10px 40px -10px hsl(240 10% 3.9% / 0.1)",
              }}
              transition={{
                scale: { duration: 0.3 },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {/* Dynamic glare/reflection effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none z-10 rounded-lg overflow-hidden"
                style={{
                  background: `radial-gradient(circle at ${logoGlareX.get()} ${logoGlareY.get()}, rgba(255, 255, 255, 0.9) 0%, transparent 60%)`,
                  opacity: logoGlareOpacity,
                  mixBlendMode: "overlay",
                }}
              />

              <motion.img
                src="/assets/mini-groups-logo-completa.png"
                alt="Mini Groups"
                className="mx-auto w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] h-auto relative z-[1]"
                style={{
                  filter: isLogoHovered ? "brightness(1.1)" : "brightness(1)",
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
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
