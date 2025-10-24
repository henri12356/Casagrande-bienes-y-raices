"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const slidesData = [
  { id: 1, imageSrc: "/hero01.webp" },
  { id: 2, imageSrc: "/hero02.webp" },
  { id: 3, imageSrc: "/hero03.webp" },
];

export default function HeroCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);
  const slideIndex = Math.abs(page % slidesData.length);

  const paginate = useCallback((newDirection: number) => {
    setPage(([currentPage]) => [currentPage + newDirection, newDirection]);
  }, []);

  // Auto-cambio cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(interval);
  }, [paginate]);

  const onDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const swipeThreshold = 10000;
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -swipeThreshold) paginate(1);
    else if (swipe > swipeThreshold) paginate(-1);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden   ">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slideIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          <Image
            src={slidesData[slideIndex].imageSrc}
            alt={`Slide ${slideIndex + 1}`}
            fill
            priority
            sizes="100vw"
            className="
              object-cover
              lg:object-contain
              w-full h-full
              transition-all duration-700 ease-in-out
            "
          />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
