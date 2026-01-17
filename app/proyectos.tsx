/* eslint-disable @next/next/no-img-element */
"use client";

import React, { FC, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Proyecto {
  id: number;
  nombre: string;
  subtitulo: string;
  ubicacion: string;
  precioDesdeSol: string;
  precioDesdeDolar: string;
  imagenSrc: string;
  etiqueta: string;
  metrosLote: string;
  servicios: string[];
  link: string; // ✅ SOLO LINK (sin slug)
}

const proyectosData: Proyecto[] = [
  {
    id: 1,
    nombre: "Villa Sol 2",
    subtitulo: "Qorihuillca",
    ubicacion: "Huamanga – Ayacucho",
    precioDesdeSol: "S/ 16,000",
    precioDesdeDolar: "",
    imagenSrc: "villasol01.webp",
    etiqueta: "Proyecto",
    metrosLote: "200 m²",
    servicios: ["Agua", "Luz", "Acceso vehicular", "Entorno bioambiental"],
    link: "/proyectos/villa-sol-2-qorihuillca",
  },
  {
    id: 2,
    nombre: "Pampaqocha",
    subtitulo: "Qorihuillca",
    ubicacion: "Huamanga – Ayacucho",
    precioDesdeSol: "S/ 45,000",
    precioDesdeDolar: "",
    imagenSrc: "Pampaqocha01.webp",
    etiqueta: "Proyecto",
    metrosLote: "170 m²",
    servicios: ["Agua", "Luz", "Acceso vehicular", "Entorno bioambiental"],
    link: "/proyectos/pampaqocha-qorihuillca-170m2",
  },
  {
    id: 3,
    nombre: "Pampaqocha",
    subtitulo: "Qorihuillca",
    ubicacion: "Huamanga – Ayacucho",
    precioDesdeSol: "S/ 68,000",
    precioDesdeDolar: "",
    imagenSrc: "Pampaqochasegundo03.webp",
    etiqueta: "Proyecto",
    metrosLote: "300 m²",
    servicios: ["Agua", "Luz", "Acceso vehicular", "Entorno bioambiental"],
    link: "/proyectos/pampaqocha-qorihuillca-300m2",
  },
  {
    id: 4,
    nombre: "Ccasera Qorihuillca",
    subtitulo: "Qorihuillca",
    ubicacion: "Huamanga – Ayacucho",
    precioDesdeSol: "S/ 33,000",
    precioDesdeDolar: "",
    imagenSrc: "Ccasera04.webp",
    etiqueta: "Proyecto",
    metrosLote: "200 m²",
    servicios: ["Agua", "Luz", "Acceso vehicular", "Entorno bioambiental"],
    link: "/proyectos/casera-qorihuillca-200m2",
  },
  {
    id: 5,
    nombre: "Ccahuiñayoq",
    subtitulo: "Qorihuillca",
    ubicacion: "Huamanga, Ayacucho",
    precioDesdeSol: "S/ 30,000",
    precioDesdeDolar: "",
    imagenSrc: "Ccahuiñayoq04.webp",
    etiqueta: "Proyecto",
    metrosLote: "1,200 m²",
    servicios: ["Agua", "Luz", "Acceso vehicular", "Entorno bioambiental"],
    link: "/proyectos/ccahuinnayoq-qorihuillca-1200m2",
  },
];

const SvgIcon: FC<{ path: string; className?: string }> = ({ path, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? "w-4 h-4 shrink-0"}>
    <path d={path} />
  </svg>
);

const ICON = {
  location:
    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  area: "M3 3h8v2H5v6H3V3zm16 0h2v8h-2V5h-6V3h6zM3 13h2v6h6v2H3v-8zm16 0h2v8h-8v-2h6v-6z",
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

const ProjectCard: FC<{ p: Proyecto }> = ({ p }) => (
  <Link href={p.link} className="block h-full">
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl overflow-hidden bg-[#005BBB] text-white flex flex-col h-full cursor-pointer hover:opacity-95 transition"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={p.imagenSrc}
          alt={`Imagen del lote ${p.nombre}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://placehold.co/800x500/CCCCCC/000000?text=Imagen+no+disponible";
          }}
        />
        <div className="absolute top-3 left-3 bg-[#FFD100] text-[#005BBB] font-extrabold text-[11px] uppercase px-3 py-1.5 rounded-full shadow">
          {p.etiqueta}
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-2 grow">
        <div className="min-h-14">
          <h3 className="text-xl font-extrabold leading-tight">{p.nombre}</h3>
          <p className="text-sm text-yellow-300 font-semibold">{p.subtitulo}</p>
        </div>

        <div className="flex items-start gap-2 text-sm leading-snug">
          <SvgIcon path={ICON.location} className="w-4 h-4 text-white mt-0.5 shrink-0" />
          <p className="line-clamp-2">{p.ubicacion}</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <SvgIcon path={ICON.area} className="w-4 h-4 text-white shrink-0" />
          <span className="font-semibold">Área:</span> {p.metrosLote}
        </div>

        <div className="flex flex-wrap gap-2">
          {p.servicios.slice(0, 4).map((s) => {
            const k = serviceKey(s);
            return (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full text-xs"
              >
                <SvgIcon path={ICON[k]} className="w-3.5 h-3.5 text-white" />
                {s}
              </span>
            );
          })}
        </div>

        <div className="pt-1">
          <div className="inline-flex items-center gap-2 bg-[#FFD100] text-[#005BBB] px-4 py-2.5 font-extrabold rounded-full shadow text-sm">
            <span className="font-normal">Desde:</span>
            {p.precioDesdeSol}
          </div>
        </div>
      </div>
    </motion.article>
  </Link>
);

const Proyectos = () => {
  const ref = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const w = (card?.offsetWidth ?? 320) + 16;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="2xl:max-w-[1650px] max-w-[1550px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#005BBB] border-l-4 border-[#FFD100] pl-4">
            Nuestras recomendaciones para ti
          </h2>

          <Link
            href="/inmuebles"
            className="bg-[#005BBB] text-white max-md:w-28 px-5 py-2.5 rounded-full font-semibold hover:bg-[#004a9b] transition shadow"
          >
            Ver más
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Anterior"
            className="hidden cursor-pointer md:flex absolute top-1/2 -translate-y-1/2 left-0 z-10 w-11 h-11 bg-[#005BBB] text-white rounded-full items-center justify-center hover:bg-[#004a9b] shadow border-2 border-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={ref}
            className="flex gap-4 overflow-x-auto pb-3 scroll-smooth scrollbar-hide snap-x snap-mandatory md:px-14"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {proyectosData.map((p) => (
              <div key={p.id} className="snap-start flex-shrink-0 w-[88%] sm:w-[52%] lg:w-[32%] xl:w-[24%]">
                <ProjectCard p={p} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollByCard(1)}
            aria-label="Siguiente"
            className="hidden cursor-pointer md:flex absolute top-1/2 -translate-y-1/2 right-0 z-10 w-11 h-11 bg-[#005BBB] text-white rounded-full items-center justify-center hover:bg-[#004a9b] shadow border-2 border-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
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

export default Proyectos;
