import { PropsWithChildren, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface RevealProps {
  y?: number;
  duration?: number;
  delay?: number;
}

export default function Reveal({ children, y = 24, duration = 0.6, delay = 0 }: PropsWithChildren<RevealProps>) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Replay animation on every entry: once: false, maintain a small threshold via amount
  const inView = useInView(ref, { amount: 0.15, once: false, margin: "0px 0px -10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      // When out of view, reset to hidden so it will replay on next entry
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1], delay }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
