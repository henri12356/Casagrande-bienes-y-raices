"use client";

import { AnimatePresence, motion, Variants, Transition } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const slidesData = [
  { id: 1, imageSrc: "/hero01.webp" },
  { id: 2, imageSrc: "/hero02.webp" },
  { id: 3, imageSrc: "/hero03.webp" },
];

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      type: "tween" as const,
      duration: 0.8,
      ease: [0.56, 0.03, 0.12, 1.04] as const,
    } as Transition,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    transition: {
      type: "tween" as const,
      duration: 0.8,
      ease: [0.56, 0.03, 0.12, 1.04] as const,
    } as Transition,
  }),
};

export default function HeroCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);
  const slideIndex = Math.abs(page % slidesData.length);
  const activeSlide = slidesData[slideIndex];

  const paginate = useCallback((newDirection: number) => {
    setPage(([currentPage]) => [currentPage + newDirection, newDirection]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [paginate]);

  const onDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const swipeConfidenceThreshold = 10000;
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -swipeConfidenceThreshold) paginate(1);
    else if (swipe > swipeConfidenceThreshold) paginate(-1);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden ">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
          className="absolute inset-0"
        >
          <Image
            src={activeSlide.imageSrc}
            alt={`Slide ${slideIndex + 1}`}
            quality={90}
            fill
            priority
            className="object-cover lg:object-contain"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}