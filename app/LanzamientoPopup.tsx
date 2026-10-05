"use client";

import Image from "next/image";
import {
  X,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Clock3,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function LanzamientoPopup() {
  const [open, setOpen] = useState(false);

  const [tiempo, setTiempo] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
    finalizado: false,
  });

  // MOSTRAR POPUP
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // CONTADOR
  useEffect(() => {
    const fechaEvento = new Date("2026-10-11T09:00:00-05:00");

    const actualizarContador = () => {
      const ahora = new Date();
      const diferencia = fechaEvento.getTime() - ahora.getTime();

      if (diferencia <= 0) {
        setTiempo({
          dias: 0,
          horas: 0,
          minutos: 0,
          segundos: 0,
          finalizado: true,
        });

        return;
      }

      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

      const horas = Math.floor(
        (diferencia / (1000 * 60 * 60)) % 24
      );

      const minutos = Math.floor(
        (diferencia / (1000 * 60)) % 60
      );

      const segundos = Math.floor(
        (diferencia / 1000) % 60
      );

      setTiempo({
        dias,
        horas,
        minutos,
        segundos,
        finalizado: false,
      });
    };

    actualizarContador();

    const intervalo = setInterval(actualizarContador, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const cerrarPopup = () => {
    setOpen(false);
  };

  // WHATSAPP
  const numeroWhatsapp = "51916194372";

  const mensajeWhatsapp = encodeURIComponent(
    "Hola, vi la invitación de la Gran Preventa de El Mirador de Ccorihuillca y deseo confirmar mi asistencia."
  );

  const whatsappUrl = `https://wa.me/${numeroWhatsapp}?text=${mensajeWhatsapp}`;

  if (!open) return null;

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="Gran Preventa El Mirador de Ccorihuillca"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          cerrarPopup();
        }
      }}
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#001B4D]/75 px-0 backdrop-blur-md sm:items-center sm:px-4"
    >
      <div className="relative w-full max-w-[430px] overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]">

        {/* BOTÓN CERRAR */}
        <button
          type="button"
          onClick={cerrarPopup}
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-black/55"
          aria-label="Cerrar anuncio"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* IMAGEN PROMOCIONAL */}
        <div className="relative w-full">
          <Image
            src="/preventa.webp"
            alt="Gran Preventa El Mirador de Ccorihuillca"
            width={1200}
            height={1200}
            priority
            className="h-72 w-full object-cover"
          />

          {/* BADGE */}
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FDB515] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#01338C] shadow-lg">
              <Sparkles size={12} />
              Invitación especial
            </span>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="px-5 py-5 sm:px-6">

          {/* TÍTULO */}
          <h3 className="text-center text-[23px] font-black text-[#01338C]">
            ¡Estás invitado!
          </h3>

          {/* TEXTO */}
          <p className="mt-2 text-center text-[14px] leading-relaxed text-gray-600">
            Acompáñanos este{" "}
            <strong>11 de octubre</strong>{" "}
            a nuestra{" "}
            <span className="font-bold text-[#01338C]">
              Gran Preventa de El Mirador de Ccorihuillca.
            </span>
          </p>

          {/* BENEFICIOS */}
          <div className="mt-4 grid grid-cols-2 gap-2">

            <div className="rounded-xl bg-[#01338C]/5 px-3 py-2.5 text-center">
              <p className="text-[11px] font-bold text-[#01338C]">
                💰 Hasta 10% de descuento
              </p>
            </div>

            <div className="rounded-xl bg-[#01338C]/5 px-3 py-2.5 text-center">
              <p className="text-[11px] font-bold text-[#01338C]">
                🚐 Movilidad ida y vuelta
              </p>
            </div>

          </div>

          {/* CONTADOR */}
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

                {/* DÍAS */}
                <div className="text-center">
                  <span className="block text-[18px] font-black leading-none text-[#01338C]">
                    {String(tiempo.dias).padStart(2, "0")}
                  </span>

                  <span className="text-[8px] font-bold uppercase text-gray-500">
                    Días
                  </span>
                </div>

                <span className="mb-3 font-black text-[#FDB515]">
                  :
                </span>

                {/* HORAS */}
                <div className="text-center">
                  <span className="block text-[18px] font-black leading-none text-[#01338C]">
                    {String(tiempo.horas).padStart(2, "0")}
                  </span>

                  <span className="text-[8px] font-bold uppercase text-gray-500">
                    Horas
                  </span>
                </div>

                <span className="mb-3 font-black text-[#FDB515]">
                  :
                </span>

                {/* MINUTOS */}
                <div className="text-center">
                  <span className="block text-[18px] font-black leading-none text-[#01338C]">
                    {String(tiempo.minutos).padStart(2, "0")}
                  </span>

                  <span className="text-[8px] font-bold uppercase text-gray-500">
                    Min
                  </span>
                </div>

                <span className="mb-3 font-black text-[#FDB515]">
                  :
                </span>

                {/* SEGUNDOS */}
                <div className="text-center">
                  <span className="block text-[18px] font-black leading-none text-[#01338C]">
                    {String(tiempo.segundos).padStart(2, "0")}
                  </span>

                  <span className="text-[8px] font-bold uppercase text-gray-500">
                    Seg
                  </span>
                </div>

              </div>

            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-[#FDB515]/15 px-3 py-3 text-center">
              <p className="text-[12px] font-black text-[#01338C]">
                🔥 ¡La Gran Preventa es hoy!
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

          {/* VER MÁS TARDE */}
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