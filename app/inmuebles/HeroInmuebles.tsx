"use client";

import React from "react";
import Image from "next/image";

const HeroInmuebles = () => {
  return (
    <div className="pt-28">

    <div className="relative h-[260px] w-full overflow-hidden ">
      {/* Imagen */}
      <Image
        src="/proyecto.webp"
        alt="Proyectos Casagrande"
        fill
        priority
        className="object-cover"
      />

      {/* Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      {/* Texto */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Descubre el lugar perfecto para tu próximo{" "}
            <span className="text-[#FFB200]">lote o casa</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm text-gray-100 sm:text-base">
            Proyectos, propiedades y alquileres seleccionados por Casagrande
            Inmobiliaria.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HeroInmuebles;
