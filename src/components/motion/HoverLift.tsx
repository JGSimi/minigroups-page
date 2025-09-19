import { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface HoverLiftProps {
  className?: string;
}

export default function HoverLift({ className, children }: PropsWithChildren<HoverLiftProps>) {
  return (
    <motion.div
      className={clsx(className)}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
