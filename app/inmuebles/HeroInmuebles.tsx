"use client";

import Image from "next/image";
import React, { useMemo } from "react";
import { FaCheck, FaSearch } from "react-icons/fa";

// ✅ Ajustado a tus proyectos reales (Ayacucho/Huamanga – Qorihuillca + sectores)
const LUGARES = [
  "Todos",
  "Ayacucho",
  "Qorihuillca",
  "Pampaqocha",
  "Ccasera",
  "Ccahuiñayoq",
] as const;

type Lugar = (typeof LUGARES)[number];

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
  // ✅ Normaliza valores raros que puedan venir desde estado
  const safeSelected = useMemo<Lugar>(() => {
    const found = (LUGARES as readonly string[]).includes(selectedCity)
      ? (selectedCity as Lugar)
      : "Todos";
    return found;
  }, [selectedCity]);

  return (
    <div className="relative w-full pt-32">
      <div className="relative flex min-h-[170px] w-full flex-col items-center justify-center overflow-hidden bg-slate-900 px-4 py-10 pt-16 text-center sm:py-12">
        {/* IMAGEN DE FONDO */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Pampaqocha04.webp"
            alt="Fondo de proyectos en Ayacucho"
            fill
            className="object-cover opacity-60"
            priority
          />
          {/* Gradiente corporativo */}
          <div className="absolute inset-0 bg-linear-to-t from-[#01338C]/95 via-[#01338C]/55 to-transparent" />
        </div>

        {/* CONTENIDO */}
        <div className="relative z-10 w-full max-w-5xl">
          <h1 className="text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-[44px] drop-shadow-lg">
            Encuentra tu <span className="text-[#FFB200]">Lote</span> Ideal en{" "}
            <span className="text-[#FFB200]">Ayacucho</span>
          </h1>

          <p className="mb-5 text-sm font-medium text-white/90 sm:text-lg">
            Proyectos en Huamanga: Qorihuillca y sectores con alta proyección,
            naturaleza y acceso vehicular
          </p>

          {/* PILLS DE LUGARES */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {LUGARES.map((lugar) => {
              const active = safeSelected === lugar;

              return (
                <button
                  key={lugar}
                  onClick={() => {
                    setSelectedCity(lugar);
                    if (lugar !== "Todos") setSearchTerm("");
                  }}
                  className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold transition-all
                    ${
                      active
                        ? "border-white bg-white text-[#01338C] shadow-xl transform scale-[1.03]"
                        : "border-white/50 bg-transparent text-white hover:bg-white/15 hover:border-white"
                    }
                  `}
                  type="button"
                >
                  {active && <FaCheck className="text-xs text-[#FFB200]" />}
                  {lugar}
                </button>
              );
            })}
          </div>

          {/* BARRA DE BÚSQUEDA */}
          <div className="mx-auto w-full max-w-3xl">
            <div className="relative flex items-center overflow-hidden rounded-full bg-white p-1.5 shadow-2xl transition-transform focus-within:scale-[1.02]">
              <div className="flex flex-1 items-center px-4">
                <FaSearch className="mr-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value) setSelectedCity("Todos");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && onSearchClick()}
                  placeholder="Buscar: proyecto, sector (Pampaqocha), Qorihuillca..."
                  className="h-12 w-full bg-transparent text-base font-medium text-slate-800 placeholder-slate-400 outline-none"
                />
              </div>

              <button
                onClick={onSearchClick}
                className="h-12 rounded-full bg-[#FFB200] px-8 text-sm font-bold uppercase tracking-wider text-[#01338C] hover:bg-[#e6a100] transition-colors"
                type="button"
              >
                Buscar
              </button>
            </div>

            {/* Mini texto debajo (pro) */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-white/85">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FFB200]" />
                Agua y Luz
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FFB200]" />
                Acceso vehicular
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FFB200]" />
                Entorno bioambiental
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroInmuebles;
