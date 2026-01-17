"use client";

import { AnimatePresence, motion, Transition, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// --- DATOS DE LOS SLIDES ---
const slidesData: { 
  id: number; 
  imageSrc: string; 
  buttonLink: string;
}[] = [
  { 
    id: 1, 
    imageSrc: "/hero01.webp", 
    buttonLink: "/inmuebles", 
  },
  { 
    id: 2, 
    imageSrc: "/hero02.webp", 
    buttonLink: "/inmuebles", 
  },
  { 
    id: 3, 
    imageSrc: "/hero03.webp", 
    buttonLink: "/inmuebles", 
  },
];

// --- Variantes de Animación ---
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
      duration: 0.7,
      ease: [0.56, 0.03, 0.12, 1.04] as const,
    } as Transition,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    transition: {
      type: "tween" as const,
      duration: 0.7,
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
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  return (
    <div className="md:py-20">

    <main className="relative w-full 2xl:h-[90vh] h-[75vh] max-md:h-[32vh] overflow-hidden ">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          className="absolute inset-0"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          {/* Imagen clickeable que cubre toda la pantalla */}
          <Link 
            href={activeSlide.buttonLink} 
            className="block w-full h-full"
          >
            <Image
              src={activeSlide.imageSrc}
              alt={`Slide ${activeSlide.id}`}
              fill
              priority={slideIndex === 0}
              sizes="100vw"
              className="object-cover w-full h-full cursor-pointer max-md:pt-16 md:pt-15"
              quality={85}
            />
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Indicadores de navegación */}
      <div className="absolute inset-x-0 bottom-4 z-40 flex justify-center space-x-2">
        {slidesData.map((_, index) => (
          <button
            aria-label={`Ir a la diapositiva ${index + 1}`}
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === slideIndex 
                ? "w-6 bg-white" 
                : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => {
              const newDirection = index > slideIndex ? 1 : -1;
              setPage([index, newDirection]);
            }}
          />
        ))}
      </div>


    </main>
    </div>
  );
}