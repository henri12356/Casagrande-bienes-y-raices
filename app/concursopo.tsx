"use client";

import Image from "next/image";
import { X, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export default function ConcursoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const cerrarPopup = () => {
    setOpen(false);
  };

  if (!open) return null;

  const premios = ["TV 42 pulgadas", "Caja china", "Caja sorpresa"];

  return (
    <section
      onClick={(e) => {
        if (e.target === e.currentTarget) cerrarPopup();
      }}
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#001B4D]/75 px-0 backdrop-blur-md sm:items-center sm:px-4"
    >
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-t-[28px] bg-white shadow-2xl shadow-black/40 sm:rounded-[28px]">
        <button
          onClick={cerrarPopup}
          className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
          aria-label="Cerrar anuncio"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="relative h-[205px] w-full overflow-hidden sm:h-[220px]">
          <Image
            src="/hero06.webp"
            alt="Concurso Día del Padre Casagrande"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#011c45] via-[#011c45]/55 to-transparent" />

          <div className="absolute left-5 top-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDB515] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#011c45] shadow-lg">
              <Trophy size={12} />
              Concurso oficial
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FDB515]">
              Día del Padre
            </p>

            <h2 className="mt-1 text-3xl font-black leading-tight text-white">
              ¡Foto con Papá!
            </h2>

            <p className="mt-1 text-sm font-medium text-white/85">
              Participa y gana premios especiales.
            </p>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <p className="text-sm leading-relaxed text-gray-600">
            Envía tu foto con papá y participa en el concurso de Casagrande
            Bienes y Raíces.
          </p>

          <div className="mt-4">
            <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-[#01338C]">
              Premios
            </p>

            <div className="grid grid-cols-3 gap-2">
              {premios.map((premio, index) => (
                <div
                  key={premio}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 text-center"
                >
                  <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#01338C] text-xs font-black text-white">
                    {index + 1}
                  </div>

                  <p className="text-[11px] font-bold leading-tight text-slate-700">
                    {premio}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={cerrarPopup}
            className="mt-5 cursor-pointer flex w-full items-center justify-center rounded-2xl bg-[#FDB515] px-5 py-3.5 text-[13px] font-black uppercase tracking-wide text-[#01338C] shadow-lg shadow-[#FDB515]/30 transition-all hover:bg-[#ffc13b] active:scale-[0.98]"
          >
                        Ver bases del concurso
          </button>

          <button
            onClick={cerrarPopup}
            className="mt-3 cursor-pointer w-full text-center text-[12px] font-semibold text-gray-400 transition-colors hover:text-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </section>
  );
}