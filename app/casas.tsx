/* eslint-disable @next/next/no-img-element */
"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Proyecto {
  id: number;
  nombre: string;
  subtitulo: string;
  ubicacion: string; // "Ayacucho, Huamanga – Qorihuillca"
  precioDesdeSol: string; // SOLO SOLES
  imagenSrc: string;
  etiqueta: string;
  servicios: string[];
  link: string; // ✅ SOLO LINK (tú lo pones)
}

const proyectosData: Proyecto[] = [
  {
    id: 1,
    nombre: "Villa Sol 2",
    subtitulo: "Qorihuillca",
    ubicacion: "Ayacucho, Huamanga – Qorihuillca",
    precioDesdeSol: "S/ 16,000",
    imagenSrc: "villasol01.webp",
    etiqueta: "Proyecto",
    servicios: ["Agua", "Luz", "Acceso vehicular", "Entorno bioambiental"],
    link: "/proyectos/villa-sol-2-qorihuillca", // ✅ EJEMPLO
  },
  {
    id: 2,
    nombre: "Pampaqocha",
    subtitulo: "Qorihuillca",
    ubicacion: "Ayacucho, Huamanga – Pampaqocha",
    precioDesdeSol: "S/ 45,000",
    imagenSrc: "Pampaqocha01.webp",
    etiqueta: "Proyecto",
    servicios: ["Agua", "Luz", "Acceso vehicular", "Entorno bioambiental"],
    link: "/proyectos/pampaqocha-170", // ✅ cambia por tu ruta
  },
  {
    id: 3,
    nombre: "Pampaqocha",
    subtitulo: "Qorihuillca",
    ubicacion: "Ayacucho, Huamanga – Pampaqocha",
    precioDesdeSol: "S/ 68,000",
    imagenSrc: "Pampaqochasegundo03.webp",
    etiqueta: "Proyecto",
    servicios: ["Agua", "Luz", "Acceso vehicular", "Entorno bioambiental"],
    link: "/proyectos/pampaqocha-300", // ✅ cambia por tu ruta
  },
  {
    id: 4,
    nombre: "Ccasera Qorihuillca",
    subtitulo: "Qorihuillca",
    ubicacion: "Ayacucho, Huamanga – Qorihuillca",
    precioDesdeSol: "S/ 33,000",
    imagenSrc: "Ccasera04.webp",
    etiqueta: "Proyecto",
    servicios: ["Agua", "Luz", "Acceso vehicular", "Entorno bioambiental"],
    link: "/proyectos/casera-qorihuillca", // ✅ cambia por tu ruta
  },
  {
    id: 5,
    nombre: "Ccahuiñayoq",
    subtitulo: "Qorihuillca",
    ubicacion: "Ayacucho, Huamanga – Ccahuiñayoq",
    precioDesdeSol: "S/ 30,000",
    imagenSrc: "Ccahuiñayoq04.webp",
    etiqueta: "Proyecto",
    servicios: ["Agua", "Luz", "Acceso vehicular", "Entorno bioambiental"],
    link: "/proyectos/ccahuinnayoq", // ✅ cambia por tu ruta
  },
];

const SvgIcon: FC<{ path: string; className?: string }> = ({ path, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? "w-4 h-4"}>
    <path d={path} />
  </svg>
);

const ICON = {
  location:
    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  agua: "M12 2s-7 7.2-7 12a7 7 0 0 0 14 0c0-4.8-7-12-7-12zm0 18a5 5 0 0 1-5-5c0-2.9 3.3-7.2 5-9 1.7 1.8 5 6.1 5 9a5 5 0 0 1-5 5z",
  luz: "M11 21h2v-1h-2v1zm1-20C7.9 1 5 3.9 5 7c0 2.1 1.1 3.9 2.7 4.9V15c0 .6.4 1 1 1h6.6c.6 0 1-.4 1-1v-3.1C17.9 10.9 19 9.1 19 7c0-3.1-2.9-6-7-6zm3.3 9.2-.9.6V14H9.6v-3.2l-.9-.6C7.6 9.5 7 8.3 7 7c0-2.2 2.2-4 5-4s5 1.8 5 4c0 1.3-.6 2.5-1.7 3.2z",
  acceso: "M10 2h4l2 20h-4l-1-8-1 8H6l2-20zm2 5-1 1h2l-1-1zm0 4-1 1h2l-1-1zm0 4-1 1h2l-1-1z",
  bio:
    "M20 3s-7 1-11 5-5 11-5 11 7-1 11-5 5-11 5-11zm-12 13c2-1 4-3 5-5 1.2-2.4 2-5 2-5s-2.6.8-5 2c-2 1-4 3-5 5-.4.8-.8 1.8-1.1 2.7.9-.3 1.9-.7 2.1-.7z",
} as const;

const serviceKey = (s: string) => {
  const t = s.toLowerCase();
  if (t.includes("agua")) return "agua";
  if (t.includes("luz")) return "luz";
  if (t.includes("acceso")) return "acceso";
  if (t.includes("bioambiental")) return "bio";
  return "bio";
};

const Chip: FC<{ text: string }> = ({ text }) => {
  const k = serviceKey(text);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#005BBB]/10 text-[#005BBB]">
        <SvgIcon path={ICON[k]} className="w-3.5 h-3.5" />
      </span>
      {text}
    </span>
  );
};

// ✅ SOLO AGREGUÉ LINK: se envuelve TODO con <Link href={p.link}>
const ProjectCard: FC<{ p: Proyecto }> = ({ p }) => (
  <Link href={p.link} className="block h-full">
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35 }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow h-full"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={p.imagenSrc}
          alt={`Imagen del proyecto ${p.nombre}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://placehold.co/1200x675/EEEEEE/0B1F3A?text=Imagen+no+disponible";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
        <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[#FFD100] px-3 py-1.5 text-[11px] font-extrabold uppercase text-[#005BBB] shadow">
          {p.etiqueta}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight truncate">{p.nombre}</h3>
          <p className="text-sm font-semibold text-[#005BBB]">{p.subtitulo}</p>
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <span className="mt-0.5 text-[#005BBB]">
            <SvgIcon path={ICON.location} className="w-4 h-4" />
          </span>
          <p className="line-clamp-2">{p.ubicacion}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {p.servicios.slice(0, 4).map((s) => (
            <Chip key={s} text={s} />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FFD100] px-4 py-2 text-sm font-extrabold text-[#005BBB] shadow hover:brightness-95 transition">
            Desde: <span className="tabular-nums">{p.precioDesdeSol}</span>
          </span>
        </div>
      </div>
    </motion.article>
  </Link>
);

const Casas = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);
  const [gap, setGap] = useState(16);
  const [minCardWidth, setMinCardWidth] = useState("auto");

  useEffect(() => {
    const updateLayout = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setCardsToShow(1);
        setGap(16);
        setMinCardWidth("280px");
      } else if (w < 1024) {
        setCardsToShow(2);
        setGap(16);
        setMinCardWidth("auto");
      } else {
        setCardsToShow(4);
        setGap(16);
        setMinCardWidth("auto");
      }
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const maxIndex = Math.max(0, proyectosData.length - cardsToShow);

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container || container.children.length === 0) return;
    const card = container.children[0] as HTMLElement;
    container.scrollTo({ left: index * (card.offsetWidth + gap), behavior: "smooth" });
    setCurrentIndex(index);
  };

  const scrollLeft = () => scrollToIndex(Math.max(0, currentIndex - 1));
  const scrollRight = () => scrollToIndex(Math.min(maxIndex, currentIndex + 1));

  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const onDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    dragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    startScroll.current = el.scrollLeft;
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!dragging.current || !el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = startScroll.current - (x - startX.current);
  };
  const onUp = () => {
    dragging.current = false;
    const el = scrollContainerRef.current;
    if (!el || el.children.length === 0) return;
    const card = el.children[0] as HTMLElement;
    const idx = Math.round(el.scrollLeft / (card.offsetWidth + gap));
    setCurrentIndex(Math.max(0, Math.min(idx, maxIndex)));
  };

  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#005BBB] leading-tight">Proyectos en Ayacucho</h2>
            <p className="mt-1 text-slate-600 text-sm sm:text-base">Opciones disponibles según el proyecto.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={scrollLeft}
                disabled={currentIndex === 0}
                aria-label="Anterior"
                className="h-11 w-11 rounded-full border border-slate-200 bg-white text-[#005BBB] shadow-sm hover:shadow transition flex items-center justify-center disabled:opacity-40"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                disabled={currentIndex >= maxIndex}
                aria-label="Siguiente"
                className="h-11 w-11 rounded-full border border-slate-200 bg-white text-[#005BBB] shadow-sm hover:shadow transition flex items-center justify-center disabled:opacity-40"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <Link
              href="/inmuebles"
              className="inline-flex items-center justify-center rounded-full bg-[#005BBB] text-white px-5 py-2.5 font-semibold hover:bg-[#004a9b] transition shadow-sm"
            >
              Ver más
            </Link>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
        >
          {proyectosData.map((p) => (
            <div
              key={p.id}
              className="snap-start flex-shrink-0"
              style={{
                width: `calc((100% - ${(cardsToShow - 1) * gap}px) / ${cardsToShow})`,
                minWidth: minCardWidth,
              }}
            >
              <ProjectCard p={p} />
            </div>
          ))}
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
};

export default Casas;
