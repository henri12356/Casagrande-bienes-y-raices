"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedHeroProps {
  children: ReactNode;
}

export default function AnimatedHero({ children }: AnimatedHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      {children}
    </motion.div>
  );
}