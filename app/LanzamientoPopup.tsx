"use client";

import Image from "next/image";
import Link from "next/link";
import { X, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function LanzamientoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const cerrarPopup = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <section
      onClick={(e) => {
        if (e.target === e.currentTarget) cerrarPopup();
      }}
      // Fondo más oscuro y desenfocado, con animación de aparición suave
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#001B4D]/70 px-0 backdrop-blur-md transition-all duration-500 animate-in fade-in sm:items-center sm:px-4"
    >
      {/* Contenedor principal */}
      <div className="group relative w-full max-w-[420px] overflow-hidden rounded-t-[32px] bg-white shadow-2xl shadow-black/40 transition-all duration-500 animate-in slide-in-from-bottom-full sm:rounded-[32px] sm:slide-in-from-bottom-0 sm:zoom-in-[0.96] sm:max-w-[400px]">
        
        {/* Botón de cerrar moderno (Translúcido) */}
        <button
          onClick={cerrarPopup}
          className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/40 sm:bg-white/90 sm:text-[#01338C] sm:hover:bg-white"
          aria-label="Cerrar anuncio"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* --- CABECERA VISUAL --- */}
        <div className="relative h-[240px] w-full overflow-hidden sm:h-[260px]">
          <Image
            src="/ELGOLF/ELGOLF04.webp"
            alt="Lanzamiento proyecto inmobiliario Casagrande"
            fill
            priority 
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          {/* Gradiente oscurecido para asegurar que el texto blanco sea siempre legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#01338C] via-[#001B4D]/40 to-transparent opacity-90" />

          {/* Badge Preventa */}
          <div className="absolute left-5 top-5">
            <span className="inline-flex items-center rounded-full bg-[#FDB515] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#063B8E] shadow-lg">
              Preventa Exclusiva
            </span>
          </div>

          {/* Textos sobre la imagen */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-black leading-tight text-white drop-shadow-md sm:text-[32px]">
              Gran Lanzamiento
            </h2>

            <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-white/90">
              <MapPin size={16} className="text-[#FDB515]" />
              <span className="tracking-wide">Ayacucho</span>
            </div>
          </div>
        </div>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <div className="px-6 py-7 sm:px-7">
          <p className="text-[15px] leading-relaxed text-gray-600">
            Lotes desde <span className="font-bold text-[#01338C]">180 m²</span> en zona de alto crecimiento. Ideal para tu casa de campo o inversión segura.
          </p>

          {/* Características - Estilo Pill minimalista */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "Ubicación estratégica",
              "Servicios básicos",
              "Acceso vehicular",
              "Alta valorización",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-[11px] font-semibold text-gray-600 transition-colors hover:border-[#063B8E]/20 hover:bg-[#063B8E]/5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#01338C]" />
                {item}
              </span>
            ))}
          </div>

          {/* --- BLOQUE DE PRECIO TIPO "TICKET VIP" --- */}
          <div className="relative mt-6 overflow-hidden rounded-[20px] bg-[#01338C] p-5 shadow-lg">
            {/* Brillo decorativo de fondo */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#FDB515]/20 blur-2xl" />
            
            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#FDB515]">
                Precio Especial
              </p>

              <div className="mt-1 flex items-end gap-3">
                <span className="text-3xl font-black text-white">
                  S/ 24,000
                </span>
                <span className="mb-1 text-sm font-medium text-white/40 line-through">
                  S/ 30,000
                </span>
              </div>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm border border-white/5">
                <Sparkles size={12} className="text-[#FDB515]" />
                Ahorras S/ 6,000 por tiempo limitado
              </div>
            </div>
          </div>

          {/* --- BOTONES DE ACCIÓN --- */}
          <Link
            href="/propiedades/el-golf-de-ccorihuillca-ayacucho"
            onClick={cerrarPopup}
            // Agregado el group para animar la flecha y una sombra brillante que incita al clic
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FDB515] px-5 py-4 text-[13px] font-black uppercase tracking-wide text-[#01338C] shadow-lg shadow-[#FDB515]/30 transition-all hover:-translate-y-0.5 hover:bg-[#ffc13b] hover:shadow-xl hover:shadow-[#FDB515]/40 active:translate-y-0"
          >
            Ver disponibilidad
            <ArrowRight size={18} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            onClick={cerrarPopup}
            className="mt-4 w-full text-center text-[13px] font-semibold text-gray-400 transition-colors hover:text-gray-700"
          >
            Quizás más tarde
          </button>
        </div>
      </div>
    </section>
  );
}