/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import {
  Bike,
  Car,
  Droplets,
  FileCheck2,
  Leaf,
  Lightbulb,
  ShieldCheck,
  Trees,
  TrendingUp,
  Waypoints,
  Zap,
} from "lucide-react";

const ICONS: Record<string, any> = {
  // Documentación
  "Titulo de Propiedad": FileCheck2,
  "Título de Propiedad": FileCheck2,

  // Servicios
  "Servicios completos": Lightbulb,
  "Agua": Droplets,
  "Luz": Zap,

  // Accesos
  "Accesos": Waypoints,
  "Acceso vehicular": Car,
  "Acceso Vehicular": Car,

  // Entorno
  "Parques": Trees,
  "Entorno natural": Leaf,
  "Naturaleza": Leaf,

  // Otros
  "Ciclovía": Bike,
  "Seguridad": ShieldCheck,
  "Proyección / valorización": TrendingUp,
  "Proyección de valorización": TrendingUp,
};

function pickIcon(label: string) {
  return ICONS[label] ?? ShieldCheck;
}

export default function EquipamientoGrid({ items }: { items: string[] }) {
  if (!items?.length) return null;

  return (
    <section className="pt-8">
      {/* ✅ Fondo suave de sección (mantiene tus colores) */}
      <div className=" p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-[#01338C] sm:text-4xl">
              Disfruta con todo equipado
            </h2>
           
          </div>

          <span className="inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-xs font-extrabold text-slate-700 ring-1 ring-slate-200">
            {Math.min(items.length, 10)} beneficios
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {items.slice(0, 10).map((t) => {
            const Icon = pickIcon(t);
            return (
              <Card
                key={t}
                className={[
                  // ✅ Un poco más grande + mejor presencia
                  "  p-7 text-center",
                  // ✅ sombra leve y hover limpio (sin “ux/ui” raro)
                  "shadow-[0_10px_26px_rgba(2,6,23,0.06)] transition",
                  "hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(2,6,23,0.10)]",
                ].join(" ")}
              >
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-white ring-1 ring-slate-200">
                  {/* ✅ icono más grande */}
                  <Icon className="h-12 w-12 text-[#01338C]" />
                </div>

                <p className="mt-5 text-[15px] font-extrabold text-[#01338C]">
                  {t}
                </p>

              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
