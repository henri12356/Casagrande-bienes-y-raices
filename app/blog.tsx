/* eslint-disable @next/next/no-img-element */
"use client";

import React, { FC } from "react";
import { motion } from "framer-motion";

interface Noticia {
  id: number;
  titulo: string;
  subtitulo: string;
  fecha: string;
  autor: string;
  imagenSrc: string;
  categoria: string;
  resumen: string;
}

const noticiasData: Noticia[] = [
  {
    id: 1,
    titulo: "Inauguración de nuevo proyecto en Chilca",
    subtitulo: "Alameda Lima Sur",
    fecha: "25/10/2025",
    autor: "Los Portales",
    imagenSrc: "proyecto.webp",
    categoria: "Noticias",
    resumen:
      "Se inaugura un nuevo desarrollo inmobiliario con amplias facilidades de pago y crédito directo.",
  },
  {
    id: 2,
    titulo: "Promoción especial en Asia",
    subtitulo: "La Arboleda de Asia",
    fecha: "20/10/2025",
    autor: "Los Portales",
    imagenSrc: "proyecto.webp",
    categoria: "Promociones",
    resumen:
      "Nueva promoción para clientes interesados en lotes en la zona de Asia, con beneficios exclusivos.",
  },
  {
    id: 3,
    titulo: "Inversión segura en Cañete",
    subtitulo: "La Planicie de Cañete",
    fecha: "18/10/2025",
    autor: "Los Portales",
    imagenSrc: "proyecto.webp",
    categoria: "Inversiones",
    resumen:
      "Compra de lotes para inversión con facilidades de pago y potencial de renta garantizado.",
  },
];

const NoticiaCard: FC<{ noticia: Noticia }> = ({ noticia }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden relative group shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img
          src={noticia.imagenSrc}
          alt={noticia.titulo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/800x500/CCCCCC/000000?text=Imagen+no+disponible";
          }}
        />

        {/* Overlay con texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end text-white p-4 sm:p-5 md:p-6 transition-all duration-500 group-hover:bg-black/60">
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#FFD100] text-[#005BBB] font-extrabold text-[10px] sm:text-xs uppercase px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg">
            {noticia.categoria}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-extrabold leading-tight">
              {noticia.titulo}
            </h3>
            <p className="text-yellow-300 text-xs sm:text-sm md:text-base font-semibold mt-1">
              {noticia.subtitulo}
            </p>
            <p className="text-[10px] sm:text-xs md:text-sm mt-1 opacity-90">
              {noticia.fecha} | {noticia.autor}
            </p>

          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const BlogNoticias = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="xl:max-w-[1550px] max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#005BBB] mb-8 sm:mb-10 md:mb-12 border-l-4 border-[#FFD100] pl-4 inline-block">
          Noticias
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {noticiasData.map((noticia) => (
            <NoticiaCard key={noticia.id} noticia={noticia} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogNoticias;
