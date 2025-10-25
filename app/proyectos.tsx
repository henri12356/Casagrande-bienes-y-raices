/* eslint-disable @next/next/no-img-element */
"use client";

import React, { FC } from "react";
import { motion } from "framer-motion";

interface Proyecto {
  id: number;
  nombre: string;
  subtitulo: string;
  ubicacion: string;
  precioDesdeSol: string;
  precioDesdeDolar: string;
  imagenSrc: string;
  etiqueta: string;
  servicios: string[];
}

const proyectosData: Proyecto[] = [
  {
    id: 1,
    nombre: "Chilca",
    subtitulo: "Alameda Lima Sur",
    ubicacion: "KM. 61.5 Panamericana Sur",
    precioDesdeSol: "S/ 1,213",
    precioDesdeDolar: "$ 311",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
  {
    id: 2,
    nombre: "Asia",
    subtitulo: "La Arboleda de Asia",
    ubicacion: "KM 98 Panamericana Sur",
    precioDesdeSol: "S/ 1,131",
    precioDesdeDolar: "$ 290",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
  {
    id: 3,
    nombre: "Cañete",
    subtitulo: "La Planicie de Cañete",
    ubicacion: "Av. Mariscal Benavides (Altura Av. Huancaré, a 1 min. del Megaplaza)",
    precioDesdeSol: "S/ 991",
    precioDesdeDolar: "$ 259",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
  {
    id: 4,
    nombre: "Carabayllo",
    subtitulo: "Los Ficus de Carabayllo",
    ubicacion: "Alt. Km 30 Pan. Norte - Av. Jose Baego Rejas 545, Esquina Paradero Lark",
    precioDesdeSol: "S/ 1,931",
    precioDesdeDolar: "$ 495",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
];

const IconLocation: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const IconCredit: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V8h16v10zm-3-8h-2V7h-3v3h2v1h-2v3h3v-1h2v-2zm-9 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const IconSale: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/>
  </svg>
);

const ProjectCard: FC<{ proyecto: Proyecto }> = ({ proyecto }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-xl overflow-hidden relative group h-full flex flex-col"
    >
      {/* Imagen con etiqueta flotante */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={proyecto.imagenSrc}
          alt={`Imagen del lote ${proyecto.nombre}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://placehold.co/800x500/CCCCCC/000000?text=Imagen+no+disponible";
          }}
        />
        <div className="absolute top-4 left-4 bg-[#FFD100] text-[#005BBB] font-extrabold text-xs uppercase px-4 py-2 rounded-full shadow-lg">
          {proyecto.etiqueta}
        </div>
      </div>

      {/* Contenido con flex-grow para igualar altura */}
      <div className="bg-[#005BBB] text-white px-5 py-4 flex flex-col justify-between grow">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-bold leading-tight">{proyecto.nombre}</h3>
          <p className="text-sm text-yellow-300 font-semibold">{proyecto.subtitulo}</p>

          <div className="flex items-start gap-2">
            <IconLocation />
            <p className="text-sm leading-snug">{proyecto.ubicacion}</p>
          </div>

          {proyecto.servicios.map((servicio, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {servicio.includes("Crédito") ? <IconCredit /> : <IconSale />}
              <p className="text-sm leading-snug">{servicio}</p>
            </div>
          ))}
        </div>

        {/* Precio como botón flotante */}
        <div className="mt-3 pt-2 pb-2">
          <div className="inline-block bg-[#FFD100] text-[#005BBB] px-5 py-3 font-extrabold rounded-full shadow-lg text-sm cursor-pointer">
            <span className="text-sm font-normal">Cuota desde: </span>{proyecto.precioDesdeDolar} <span className="text-xs font-normal">o</span> {proyecto.precioDesdeSol}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Proyectos = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="xl:max-w-[1550px] max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#005BBB] mb-12 border-l-4 border-[#FFD100] pl-4 inline-block">
          Lotes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {proyectosData.map((proyecto) => (
            <ProjectCard key={proyecto.id} proyecto={proyecto} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Proyectos;
