"use client";

import React from "react";
import Image from "next/image";
import { FaSearch, FaCheck } from "react-icons/fa";

// Las ciudades que saldrán en los botones (puedes cambiarlas)
const CIUDADES = [
  "Todos",
  "Lima",
  "Ica",
  "Piura",
  "Arequipa",
  "Chiclayo",
  "Trujillo",
  "Tarapoto",
];

interface HeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onSearchClick: () => void;
}

const HeroInmuebles: React.FC<HeroProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCity,
  setSelectedCity,
  onSearchClick,
}) => {
  return (
    <div className="relative w-full pt-20">
      {/* Contenedor con altura fija o dinámica */}
      <div className="relative flex min-h-[150px] w-full flex-col items-center justify-center overflow-hidden bg-slate-900 px-4 py-6 pt-20 text-center">
        
        {/* IMAGEN DE FONDO */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/proyecto.webp" 
            alt="Fondo Hero"
            fill
            className="object-cover opacity-60"
            priority
          />
          {/* Gradiente azul corporativo para que el texto se lea bien */}
          <div className="absolute inset-0 bg-linear-to-t from-[#01338C]/90 via-[#01338C]/40 to-transparent" />
        </div>

        {/* CONTENIDO Z-INDEX SUPERIOR */}
        <div className="relative z-10 w-full max-w-5xl">
          
          {/* TÍTULO */}
          <h1 className=" text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-[44px]  drop-shadow-lg">
            Elige el <span className="text-[#FFB200]">Lugar</span> de tu Próximo Hogar
          </h1>
          
          <p className="mb-4 text-sm font-medium text-white sm:text-lg">
             Tenemos más de 25 proyectos urbanizados a lo largo del país.
          </p>

          {/* BOTONES DE CIUDADES (Pills) */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {CIUDADES.map((ciudad) => {
              const active = selectedCity === ciudad;
              return (
                <button
                  key={ciudad}
                  onClick={() => {
                    setSelectedCity(ciudad);
                    // Si selecciona ciudad, limpiamos el texto manual para no confundir
                    if (ciudad !== "Todos") setSearchTerm("");
                  }}
                  className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold transition-all 
                    ${
                      active
                        ? "border-white bg-white text-[#01338C] shadow-xl transform scale-105"
                        : "border-white/50 bg-transparent text-white hover:bg-white/20 hover:border-white"
                    }
                  `}
                >
                  {active && <FaCheck className="text-xs text-[#FFB200]" />}
                  {ciudad}
                </button>
              );
            })}
          </div>

          {/* BARRA DE BÚSQUEDA ESTILO PORTAL */}
          <div className="mx-auto w-full max-w-3xl">
            <div className="relative flex items-center overflow-hidden rounded-full bg-white p-1.5 shadow-2xl transition-transform focus-within:scale-105">
              <div className="flex flex-1 items-center px-4">
                <FaSearch className="mr-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value) setSelectedCity("Todos");
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && onSearchClick()}
                  placeholder="Buscar un proyecto, distrito o ubicación..."
                  className="h-12 w-full bg-transparent text-base font-medium text-slate-800 placeholder-slate-400 outline-none"
                />
              </div>
              <button
                onClick={onSearchClick}
                className="h-12 rounded-full bg-[#FFB200] px-8 text-sm font-bold uppercase tracking-wider text-[#01338C] hover:bg-[#e6a100] transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroInmuebles;