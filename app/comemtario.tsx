/* eslint-disable @next/next/no-img-element */
"use client";

import React, { FC, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonio {
  id: number;
  nombre: string;
  ubicacion: string;
  testimonio: string;
  titulo: string;
  imagenUrl: string;
}

const testimoniosData: Testimonio[] = [
  {
    id: 1,
    nombre: "Eduardo Diaz",
    ubicacion: "Lacho Propio - Chincha",
    testimonio: "Cumplimos el sueño de la casa propia con Los Portales. En Chincha hallamos un lugar hermoso, accesible y con bono Techo Propio.",
    titulo: "Nuestro sueño hecho realidad en Chincha",
    imagenUrl: "comentario01.webp",
  },
  {
    id: 2,
    nombre: "Franklin Suarez",
    ubicacion: "HU2 - Huancarpani",
    testimonio: "Me dieron facilidades y logré cumplir el sueño de la casa propia. Todo el proceso fue transparente y sin complicaciones.",
    titulo: "Un hogar pensando en el futuro",
    imagenUrl: "comentario01.webp",
  },
  {
    id: 3,
    nombre: "Marcial Contreras",
    ubicacion: "HU2 - Lima Bien Mirador del Prado",
    testimonio: "Compré con Los Portales para invertir y alquilar, pero también para disfrutar. Todo el proceso fue fácil y sin problemas.",
    titulo: "Inversión con disfrute asegurado",
    imagenUrl: "comentario01.webp",
  },
  {
    id: 4,
    nombre: "Ana Torres",
    ubicacion: "San Juan de Lurigancho",
    testimonio: "La atención fue excelente y los procesos muy claros. Logré mi casa sin complicaciones y en el tiempo prometido.",
    titulo: "Excelente atención y procesos claros",
    imagenUrl: "comentario01.webp",
  },
  {
    id: 5,
    nombre: "Luis Ramirez",
    ubicacion: "Villa El Salvador",
    testimonio: "El servicio fue impecable, y toda la experiencia fue increíble. Recomiendo totalmente a Los Portales por su profesionalismo.",
    titulo: "Servicio impecable y experiencia increíble",
    imagenUrl: "comentario01.webp",
  },
];

const TestimonioCard: FC<{ testimonio: Testimonio }> = ({ testimonio }) => (
  <div className="flex flex-col h-full rounded-xl flex-[0_0_calc(33.333%)]">
    <div className="relative w-full aspect-193/248">
      <img
        src={testimonio.imagenUrl}
        alt={testimonio.nombre}
        className="w-full h-full object-cover rounded-3xl"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://placehold.co/500x300/A0A0A0/FFFFFF?text=${
            testimonio.nombre.split(" ")[0]
          }`;
        }}
      />

      {/* Fondo blanco con texto */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] min-h-[200px] bg-white rounded-2xl shadow-md p-6 text-center flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-[#005BBB] mb-2 leading-tight">
          “{testimonio.titulo}”
        </h3>
        <p className="text-xs text-[#005BBB] mb-3 leading-relaxed flex-1">
          {testimonio.testimonio}
        </p>
        <div>
          <p className="font-bold text-base text-[#005BBB]">{testimonio.nombre}</p>
          <p className="text-xs text-[#005BBB]">{testimonio.ubicacion}</p>
        </div>
      </div>
    </div>
  </div>
);

const Comentario = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimoniosData.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + testimoniosData.length) % testimoniosData.length
    );
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch events para móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = startX - e.touches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  const getVisibleCards = () => 
    Array.from({ length: 3 }, (_, i) => 
      testimoniosData[(currentIndex + i) % testimoniosData.length]
    );

  // Animación corregida - sin transiciones específicas en las variantes
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.97,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.97,
    }),
  };

  const mobileVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 200 : -200,
      opacity: 0,
    }),
  };

  return (
    <section className="py-16 md:py-24 font-sans bg-gray-50">
      <div className="max-w-[1550px] mx-auto px-4">
        <h2 className="text-3xl md:text-6xl font-bold text-[#005BBB] text-center mb-16">
          Nuestros clientes nos respaldan
        </h2>

        {/* Desktop Carousel */}
        <div 
          className="hidden lg:flex relative items-center gap-6 overflow-hidden"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <button 
            onClick={prevSlide}
            className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-xl hover:shadow-2xl z-10 hover:scale-110 transition-all duration-300 hover:bg-blue-50 border border-gray-200"
          >
            <ChevronLeft className="w-6 h-6 text-[#005BBB]" />
          </button>

          <div className="flex w-full gap-6">
            <AnimatePresence mode="popLayout" custom={direction}>
              {getVisibleCards().map((t) => (
                <motion.div
                  key={t.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                >
                  <TestimonioCard testimonio={t} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-xl hover:shadow-2xl z-10 hover:scale-110 transition-all duration-300 hover:bg-blue-50 border border-gray-200 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 text-[#005BBB]" />
          </button>
        </div>

        {/* Indicadores Desktop */}
        <div className="hidden lg:flex justify-center mt-8 space-x-3">
          {testimoniosData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "bg-[#005BBB] scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Tablet */}
        <div className="hidden md:flex lg:hidden relative items-center gap-4 overflow-hidden cursor-grab active:cursor-grabbing">
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-xl hover:shadow-2xl z-10 hover:scale-110 transition-all duration-300 hover:bg-blue-50 border border-gray-200"
          >
            <ChevronLeft className="w-5 h-5 text-[#005BBB]" />
          </button>

          <div className="flex w-full gap-4 justify-center px-12">
            {getVisibleCards().slice(0, 2).map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-[0_0_calc(50%-8px)]"
              >
                <TestimonioCard testimonio={t} />
              </motion.div>
            ))}
          </div>

          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-xl hover:shadow-2xl z-10 hover:scale-110 transition-all duration-300 hover:bg-blue-50 border border-gray-200"
          >
            <ChevronRight className="w-5 h-5 text-[#005BBB]" />
          </button>
        </div>

        {/* Indicadores Tablet */}
        <div className="hidden md:flex lg:hidden justify-center mt-8 space-x-3">
          {testimoniosData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "bg-[#005BBB] scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Mobile */}
        <div 
          className="md:hidden relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={mobileVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.6,
                ease: "easeInOut"
              }}
            >
              <TestimonioCard testimonio={testimoniosData[currentIndex]} />
            </motion.div>
          </AnimatePresence>

          {/* Indicadores Mobile */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimoniosData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "bg-[#005BBB] scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comentario;