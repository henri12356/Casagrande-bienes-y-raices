"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CalendarCheck,
  MessageCircle,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Clock,
  Award,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WHATSAPP_CASAGRANDE = "51916194372";

function waLink(text: string) {
  return `https://api.whatsapp.com/send/?phone=${WHATSAPP_CASAGRANDE}&text=${encodeURIComponent(
    text
  )}&type=phone_number&app_absent=0`;
}

type Props = {
  proyecto: string;
  tipo?: "LOTES" | "DEPARTAMENTOS" | "CASAS" | "PROPIEDAD";
  whatsapp?: string;
  telefono?: string;
};

export default function StickyContactoCardCentenario({
  proyecto,
  tipo = "LOTES",
}: Props) {
  const msg = `Hola, quiero agendar una visita para conocer el proyecto: ${proyecto}. ¿Podrían ayudarme a coordinar horario y punto de encuentro?`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mx-auto w-full max-[350px]:max-w-[320px] max-w-[420px] sm:px-3 sm:px-0"
    >
      <Card className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.12)] sm:rounded-[28px] sm:shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
        {/* Franja corporativa superior */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0A2F6C] via-[#01338C] to-[#FFB200] sm:h-2" />

        <div className="relative p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#0A2F6C]/8 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#0A2F6C] sm:px-3 sm:text-xs">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#FFB200]" />
                <span className="truncate">Visitas disponibles</span>
              </div>

              <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950 sm:mt-4 sm:text-2xl">
                Agenda tu visita
              </h3>

              <p className="mt-2 max-w-[300px] text-xs leading-relaxed text-slate-600 sm:text-sm">
                Coordina una visita al proyecto y recibe orientación directa de
                nuestro equipo comercial.
              </p>
            </div>

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0A2F6C] text-white shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl">
              <CalendarCheck className="h-5 w-5 sm:h-7 sm:w-7" />
            </div>
          </div>

          {/* Proyecto */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:mt-6 sm:p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FFB200]/15 sm:h-10 sm:w-10">
                <MapPin className="h-4 w-4 text-[#0A2F6C] sm:h-5 sm:w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                  Proyecto seleccionado
                </p>

                <p className="mt-1 break-words text-sm font-extrabold leading-tight text-slate-950 sm:text-base">
                  {proyecto}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-[#0A2F6C] px-2.5 py-1 text-[9px] font-black tracking-wide text-white sm:px-3 sm:text-[10px]">
                {tipo}
              </span>
            </div>
          </div>

          {/* Beneficios */}
          <div className="mt-4 grid grid-cols-1 gap-2 xs:grid-cols-3 sm:mt-5 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm xs:block xs:text-center sm:rounded-2xl">
              <Clock className="h-4 w-4 shrink-0 text-[#0A2F6C] xs:mx-auto" />
              <p className="text-[11px] font-semibold leading-tight text-slate-600 xs:mt-2">
                Horario coordinado
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm xs:block xs:text-center sm:rounded-2xl">
              <MapPin className="h-4 w-4 shrink-0 text-[#0A2F6C] xs:mx-auto" />
              <p className="text-[11px] font-semibold leading-tight text-slate-600 xs:mt-2">
                Punto de encuentro
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm xs:block xs:text-center sm:rounded-2xl">
              <Award className="h-4 w-4 shrink-0 text-[#0A2F6C] xs:mx-auto" />
              <p className="text-[11px] font-semibold leading-tight text-slate-600 xs:mt-2">
                Asesoría directa
              </p>
            </div>
          </div>

          {/* Confianza */}
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#0A2F6C]/5 px-3 py-3 text-center sm:mt-5 sm:rounded-2xl sm:px-4">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#0A2F6C]" />
            <span className="text-[11px] font-semibold leading-tight text-slate-700 sm:text-xs">
              Atención personalizada por WhatsApp
            </span>
          </div>

          {/* Botón principal */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 sm:mt-5"
          >
            <Button
              asChild
              className={[
                "group relative h-12 w-full overflow-hidden rounded-xl",
                "bg-[#25D366] text-sm font-black text-white",
                "shadow-[0_12px_26px_rgba(37,211,102,0.25)]",
                "transition-all duration-300",
                "hover:bg-[#1ebe5d] hover:shadow-[0_18px_38px_rgba(37,211,102,0.38)]",
                "sm:h-14 sm:rounded-2xl sm:text-base",
              ].join(" ")}
            >
              <Link
                href={waLink(msg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center justify-center px-2"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <MessageCircle className="mr-2 h-5 w-5 shrink-0" />

                <span className="truncate">Agendar visita por WhatsApp</span>

                <ChevronRight className="ml-2 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <p className="mx-auto mt-3 max-w-[320px] text-center text-[10px] leading-relaxed text-slate-500 sm:mt-4 sm:text-[11px]">
            Sin compromiso. Te ayudamos a coordinar el horario, punto de
            encuentro y detalles del recorrido.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}