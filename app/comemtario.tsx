/* eslint-disable @next/next/no-img-element */
"use client";

import React, { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    testimonio:
      "Cumplimos el sueño de la casa propia con Los Portales. En Chincha hallamos un lugar hermoso, accesible y con bono Techo Propio.",
    titulo: "Nuestro sueño hecho realidad en Chincha",
    imagenUrl: "/clientes01.webp",
  },
  {
    id: 2,
    nombre: "Franklin Suarez",
    ubicacion: "HU2 - Huancarpani",
    testimonio:
      "Me dieron facilidades y logré cumplir el sueño de la casa propia. Todo el proceso fue transparente y sin complicaciones.",
    titulo: "Un hogar pensando en el futuro",
    imagenUrl: "/clientes02.webp",
  },

];

const TestimonioCard: FC<{ testimonio: Testimonio }> = ({ testimonio }) => (
  <div className="flex flex-col h-full rounded-xl">
    <div className="relative w-full aspect-[193/248]">
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
  const total = testimoniosData.length;

  const [desktopIndex, setDesktopIndex] = useState(0);
  const [tabletIndex, setTabletIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const desktopVisible = 3;
  const tabletVisible = 2;
  const mobileVisible = 1;

  const maxDesktopIndex = Math.max(0, total - desktopVisible);
  const maxTabletIndex = Math.max(0, total - tabletVisible);
  const maxMobileIndex = Math.max(0, total - mobileVisible);

  const canSlideDesktop = total > desktopVisible;
  const canSlideTablet = total > tabletVisible;
  const canSlideMobile = total > mobileVisible;

  const nextDesktop = () => {
    if (!canSlideDesktop) return;
    setDesktopIndex((prev) => Math.min(prev + 1, maxDesktopIndex));
  };

  const prevDesktop = () => {
    if (!canSlideDesktop) return;
    setDesktopIndex((prev) => Math.max(prev - 1, 0));
  };

  const nextTablet = () => {
    if (!canSlideTablet) return;
    setTabletIndex((prev) => Math.min(prev + 1, maxTabletIndex));
  };

  const prevTablet = () => {
    if (!canSlideTablet) return;
    setTabletIndex((prev) => Math.max(prev - 1, 0));
  };

  const nextMobile = () => {
    if (!canSlideMobile) return;
    setMobileIndex((prev) => Math.min(prev + 1, maxMobileIndex));
  };

  const prevMobile = () => {
    if (!canSlideMobile) return;
    setMobileIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (desktopIndex > maxDesktopIndex) setDesktopIndex(maxDesktopIndex);
    if (tabletIndex > maxTabletIndex) setTabletIndex(maxTabletIndex);
    if (mobileIndex > maxMobileIndex) setMobileIndex(maxMobileIndex);
  }, [maxDesktopIndex, maxTabletIndex, maxMobileIndex, desktopIndex, tabletIndex, mobileIndex]);

  const handleTouchStart = (e: React.TouchEvent, mode: "desktop" | "tablet" | "mobile") => {
    const allowed =
      mode === "desktop"
        ? canSlideDesktop
        : mode === "tablet"
        ? canSlideTablet
        : canSlideMobile;

    if (!allowed) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent, mode: "desktop" | "tablet" | "mobile") => {
    if (!isDragging) return;

    const diff = startX - e.touches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (mode === "desktop") {
        diff > 0 ? nextDesktop() : prevDesktop();
      } else if (mode === "tablet") {
        diff > 0 ? nextTablet() : prevTablet();
      } else {
        diff > 0 ? nextMobile() : prevMobile();
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <section className="py-16 md:py-24 font-sans bg-gray-50">
      <div className="max-w-[1550px] mx-auto px-4">
        <h2 className="text-3xl md:text-6xl font-bold text-[#005BBB] text-center mb-16">
          Nuestros clientes nos respaldan
        </h2>

        {/* ================= DESKTOP ================= */}
        <div className="hidden lg:block relative">
          {canSlideDesktop && (
            <>
              <button
                onClick={prevDesktop}
                disabled={desktopIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white p-4 rounded-full shadow-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6 text-[#005BBB]" />
              </button>

              <button
                onClick={nextDesktop}
                disabled={desktopIndex === maxDesktopIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white p-4 rounded-full shadow-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6 text-[#005BBB]" />
              </button>
            </>
          )}

          <div
            className="overflow-hidden"
            onTouchStart={(e) => handleTouchStart(e, "desktop")}
            onTouchMove={(e) => handleTouchMove(e, "desktop")}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              className="flex gap-6"
              animate={{
                x: `calc(-${desktopIndex} * ((100% - 48px) / 3 + 24px))`,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {testimoniosData.map((testimonio) => (
                <div
                  key={testimonio.id}
                  className="shrink-0"
                  style={{
                    width: "calc((100% - 48px) / 3)",
                  }}
                >
                  <TestimonioCard testimonio={testimonio} />
                </div>
              ))}
            </motion.div>
          </div>

          {canSlideDesktop && (
            <div className="flex justify-center mt-8 space-x-3">
              {Array.from({ length: maxDesktopIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setDesktopIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    desktopIndex === idx
                      ? "bg-[#005BBB] scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir a posición ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= TABLET ================= */}
        <div className="hidden md:block lg:hidden relative">
          {canSlideTablet && (
            <>
              <button
                onClick={prevTablet}
                disabled={tabletIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5 text-[#005BBB]" />
              </button>

              <button
                onClick={nextTablet}
                disabled={tabletIndex === maxTabletIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5 text-[#005BBB]" />
              </button>
            </>
          )}

          <div
            className="overflow-hidden"
            onTouchStart={(e) => handleTouchStart(e, "tablet")}
            onTouchMove={(e) => handleTouchMove(e, "tablet")}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              className="flex gap-4"
              animate={{
                x: `calc(-${tabletIndex} * ((100% - 16px) / 2 + 16px))`,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {testimoniosData.map((testimonio) => (
                <div
                  key={testimonio.id}
                  className="shrink-0"
                  style={{
                    width: "calc((100% - 16px) / 2)",
                  }}
                >
                  <TestimonioCard testimonio={testimonio} />
                </div>
              ))}
            </motion.div>
          </div>

          {canSlideTablet && (
            <div className="flex justify-center mt-8 space-x-3">
              {Array.from({ length: maxTabletIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTabletIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    tabletIndex === idx
                      ? "bg-[#005BBB] scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir a posición ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= MOBILE ================= */}
        <div
          className="md:hidden relative"
          onTouchStart={(e) => handleTouchStart(e, "mobile")}
          onTouchMove={(e) => handleTouchMove(e, "mobile")}
          onTouchEnd={handleTouchEnd}
        >
          {canSlideMobile && (
            <>
              <button
                onClick={prevMobile}
                disabled={mobileIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5 text-[#005BBB]" />
              </button>

              <button
                onClick={nextMobile}
                disabled={mobileIndex === maxMobileIndex}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5 text-[#005BBB]" />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{
                x: `calc(-${mobileIndex} * (100% + 16px))`,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {testimoniosData.map((testimonio) => (
                <div
                  key={testimonio.id}
                  className="shrink-0 w-full"
                >
                  <TestimonioCard testimonio={testimonio} />
                </div>
              ))}
            </motion.div>
          </div>

          {canSlideMobile && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: maxMobileIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setMobileIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    mobileIndex === idx
                      ? "bg-[#005BBB] scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir a posición ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Comentario;