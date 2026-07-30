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
      role="dialog"
      aria-modal="true"
      aria-label="Lanzamiento de El Mirador de Ccorihuillca"
      onClick={(e) => {
        if (e.target === e.currentTarget) cerrarPopup();
      }}
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#001B4D]/75 px-0 backdrop-blur-md transition-all duration-500 animate-in fade-in sm:items-center sm:px-4"
    >
      <div className="group relative w-full max-w-[420px] overflow-hidden rounded-t-[32px] bg-white shadow-2xl shadow-black/40 transition-all duration-500 animate-in slide-in-from-bottom-full sm:max-w-[400px] sm:rounded-[32px] sm:slide-in-from-bottom-0 sm:zoom-in-[0.96]">
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={cerrarPopup}
          className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/45 sm:bg-white/90 sm:text-[#01338C] sm:hover:bg-white"
          aria-label="Cerrar anuncio"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Imagen principal */}
        <div className="relative h-[245px] w-full overflow-hidden sm:h-[265px]">
          <Image
            src="/MIRADOR/MIRADOR01.webp"
            alt="El Mirador de Ccorihuillca en Ayacucho"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#01265f] via-[#001B4D]/45 to-black/10" />

          {/* Badge */}
          <div className="absolute left-5 top-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDB515] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#063B8E] shadow-lg">
              <Sparkles size={12} />
              Preventa exclusiva
            </span>
          </div>

          {/* Título */}
          <div className="absolute bottom-6 left-6 right-6">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#FDB515]">
              Un nuevo proyecto está llegando
            </p>

            <h2 className="text-[29px] font-black leading-[1.05] text-white drop-shadow-md sm:text-[32px]">
              El Mirador de
              <br />
              Ccorihuillca
            </h2>

            <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-white/90">
              <MapPin size={16} className="text-[#FDB515]" />

              <span>A 15 minutos del Grifo Ayacucho</span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-7 sm:px-7">
          <div className="rounded-xl border border-[#FDB515]/30 bg-[#FDB515]/10 px-4 py-3">
            <p className="text-center text-[12px] font-bold uppercase tracking-wider text-[#01338C]">
              Sé de los primeros en descubrirlo
            </p>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-gray-600">
            Conoce antes que nadie nuestro nuevo proyecto en Ccorihuillca.
            Lotes de{" "}
            <span className="font-bold text-[#01338C]">
              200 m², 500 m² y 1,000 m²
            </span>{" "}
            para casa de campo, vivienda o inversión.
          </p>

          {/* Características */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "Solo 70 lotes",
              "Agua y luz",
              "Acceso vehicular",
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

          {/* Precio */}
          <div className="relative mt-6 overflow-hidden rounded-[20px] bg-[#01338C] p-5 shadow-lg">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#FDB515]/20 blur-2xl" />

            <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-white/5 blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#FDB515]">
                  Precio de preventa
                </p>

                <span className="rounded-full bg-[#FDB515] px-2.5 py-1 text-[10px] font-black uppercase text-[#01338C]">
                  Lanzamiento
                </span>
              </div>

              <div className="mt-2 flex items-end gap-3">
                <span className="text-4xl font-black tracking-tight text-white">
                  S/ 18,000
                </span>

                <span className="mb-1 text-sm font-semibold text-white/45 line-through">
                  S/ 22,000
                </span>
              </div>

              <p className="mt-1 text-[11px] font-medium text-white/65">
                Lotes desde 200 m² 
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                <Sparkles size={12} className="text-[#FDB515]" />
                Descuento de S/ 4,000 por preventa
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/propiedades/el-mirador-de-ccorihuillca-ayacucho"
            onClick={cerrarPopup}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FDB515] px-5 py-4 text-[13px] font-black uppercase tracking-wide text-[#01338C] shadow-lg shadow-[#FDB515]/30 transition-all hover:-translate-y-0.5 hover:bg-[#ffc13b] hover:shadow-xl hover:shadow-[#FDB515]/40 active:translate-y-0"
          >
            Descubrir el proyecto
            <ArrowRight
              size={18}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <p className="mt-3 text-center text-[11px] font-medium text-gray-400">
            Precio especial sujeto a disponibilidad
          </p>

          <button
            type="button"
            onClick={cerrarPopup}
            className="mt-3 w-full text-center text-[13px] font-semibold text-gray-400 transition-colors hover:text-gray-700"
          >
            Ver más tarde
          </button>
        </div>
      </div>
    </section>
  );
}