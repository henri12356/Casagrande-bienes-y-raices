
"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  X,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Clock3,
} from "lucide-react";

import { useEffect, useState } from "react";

type Tiempo = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  finalizado: boolean;
};

export default function LanzamientoPopup() {
  // ========================================
  // IDENTIFICAR RUTA ACTUAL
  // ========================================

  const pathname = usePathname();

  const esEntrenamiento =
    pathname === "/entrenamiento" ||
    pathname.startsWith("/entrenamiento/");

  const [open, setOpen] = useState(false);

  const [tiempo, setTiempo] = useState<Tiempo>({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
    finalizado: false,
  });

  // ========================================
  // APERTURA DEL POPUP
  // ========================================

  useEffect(() => {
    // No ejecutar publicidad en entrenamiento
    if (esEntrenamiento) {
      return;
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [esEntrenamiento]);

  // ========================================
  // CONTADOR DE PUBLICIDAD INMOBILIARIA
  // ========================================

  useEffect(() => {
    if (esEntrenamiento) {
      return;
    }

    const fechaEvento = new Date(
      "2026-11-08T09:00:00-05:00"
    ).getTime();

    const actualizarContador = () => {
      const diferencia = Math.max(
        0,
        fechaEvento - Date.now()
      );

      setTiempo({
        dias: Math.floor(
          diferencia / 86400000
        ),

        horas: Math.floor(
          (diferencia / 3600000) % 24
        ),

        minutos: Math.floor(
          (diferencia / 60000) % 60
        ),

        segundos: Math.floor(
          (diferencia / 1000) % 60
        ),

        finalizado: diferencia === 0,
      });
    };

    actualizarContador();

    const intervalo = window.setInterval(
      actualizarContador,
      1000
    );

    return () => {
      window.clearInterval(intervalo);
    };
  }, [esEntrenamiento]);

  // ========================================
  // WHATSAPP
  // ========================================

  const numeroWhatsapp = "51917702692";

  const mensajeWhatsapp = encodeURIComponent(
    "Hola, vi la invitación del Gran Tour Inmobiliario del 8 de noviembre de Casagrande Bienes Raíces y deseo confirmar mi asistencia."
  );

  const whatsappUrl =
    `https://wa.me/${numeroWhatsapp}?text=${mensajeWhatsapp}`;

  const cerrarPopup = () => {
    setOpen(false);
  };

  // ========================================
  // EXCLUSIÓN OBLIGATORIA
  // ========================================

  if (esEntrenamiento || !open) {
    return null;
  }

  // ========================================
  // PUBLICIDAD INMOBILIARIA
  // ========================================

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="Gran Tour Inmobiliario - 8 de noviembre"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          cerrarPopup();
        }
      }}
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#001B4D]/75 px-0 backdrop-blur-md sm:items-center sm:px-4"
    >
      <div className="relative max-h-[95dvh] w-full max-w-[430px] overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]">

        {/* CERRAR */}

        <button
          type="button"
          onClick={cerrarPopup}
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-black/55"
          aria-label="Cerrar anuncio"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* IMAGEN */}

        <div className="relative w-full">
          <Image
            src="/tour.webp"
            alt="Gran Tour Inmobiliario Casagrande"
            width={1200}
            height={1200}
            priority
            className="h-72 w-full object-cover"
          />

          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FDB515] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#01338C] shadow-lg">
              <Sparkles size={12} />
              Invitación especial
            </span>
          </div>
        </div>

        {/* CONTENIDO */}

        <div className="px-5 py-5 sm:px-6">
          <h3 className="text-center text-[23px] font-black leading-tight text-[#01338C]">
            ¡Gran Tour Inmobiliario!
          </h3>

          <p className="mt-2 text-center text-[14px] leading-relaxed text-gray-600">
            Este{" "}
            <strong>domingo 8 de noviembre</strong>{" "}
            acompáñanos a recorrer nuestros proyectos
            inmobiliarios y aprovecha un{" "}
            <span className="font-bold text-[#01338C]">
              15% de descuento por pago al contado.
            </span>
          </p>

          {/* BENEFICIOS */}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-[#01338C]/5 px-3 py-2.5 text-center">
              <p className="text-[11px] font-bold text-[#01338C]">
                💰 15% de descuento al contado
              </p>
            </div>

            <div className="rounded-xl bg-[#01338C]/5 px-3 py-2.5 text-center">
              <p className="text-[11px] font-bold text-[#01338C]">
                🚐 Movilidad ida y vuelta
              </p>
            </div>
          </div>

          {/* CUENTA REGRESIVA */}

          {!tiempo.finalizado ? (
            <div className="mt-4 rounded-xl border border-[#FDB515]/30 bg-[#FDB515]/10 px-3 py-3">

              <div className="mb-2 flex items-center justify-center gap-1.5">
                <Clock3
                  size={14}
                  className="text-[#01338C]"
                />

                <p className="text-[10px] font-black uppercase tracking-wider text-[#01338C]">
                  Faltan solo
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                {[
                  {
                    valor: tiempo.dias,
                    nombre: "Días",
                  },
                  {
                    valor: tiempo.horas,
                    nombre: "Horas",
                  },
                  {
                    valor: tiempo.minutos,
                    nombre: "Min",
                  },
                  {
                    valor: tiempo.segundos,
                    nombre: "Seg",
                  },
                ].map((item, indice) => (
                  <div
                    key={item.nombre}
                    className="flex items-center gap-2"
                  >
                    {indice > 0 && (
                      <span className="mb-3 font-black text-[#FDB515]">
                        :
                      </span>
                    )}

                    <div className="text-center">
                      <span className="block text-[18px] font-black leading-none text-[#01338C]">
                        {String(item.valor).padStart(2, "0")}
                      </span>

                      <span className="text-[8px] font-bold uppercase text-gray-500">
                        {item.nombre}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-[#FDB515]/15 px-3 py-3 text-center">
              <p className="text-[12px] font-black text-[#01338C]">
                🏡 ¡El Gran Tour Inmobiliario ha comenzado!
              </p>
            </div>
          )}

          {/* WHATSAPP */}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={cerrarPopup}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4 text-[13px] font-black uppercase tracking-wide text-white shadow-lg shadow-[#25D366]/30 transition-all hover:-translate-y-0.5 hover:bg-[#20bd5a]"
          >
            <MessageCircle
              size={18}
              strokeWidth={2.5}
            />

            Confirmar mi asistencia

            <ArrowRight
              size={18}
              strokeWidth={2.5}
            />
          </a>

          {/* VER DESPUÉS */}

          <button
            type="button"
            onClick={cerrarPopup}
            className="mt-3 w-full text-center text-[12px] font-semibold text-gray-400 transition-colors hover:text-gray-700"
          >
            Ver más tarde
          </button>
        </div>
      </div>
    </section>
  );
}
