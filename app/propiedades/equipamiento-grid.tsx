/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import {
  FileCheck2,
  Lightbulb,
  Trees,
  Bike,
  ShieldCheck,
  Droplets,
  Zap,
  Waypoints,
} from "lucide-react";

const ICONS: Record<string, any> = {
  "Titulo de Propiedad": FileCheck2,
  "Título de Propiedad": FileCheck2,
  "Servicios completos": Lightbulb,
  "Parques": Trees,
  "Ciclovía": Bike,
  "Seguridad": ShieldCheck,
  "Agua": Droplets,
  "Luz": Zap,
  "Accesos": Waypoints,
};

function pickIcon(label: string) {
  return ICONS[label] ?? ShieldCheck;
}

export default function EquipamientoGrid({ items }: { items: string[] }) {
  if (!items?.length) return null;

  return (
    <section className="pt-8">
      <h2 className="text-3xl font-extrabold text-[#0B6FB6]">
        Disfruta con todo equipado
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.slice(0, 10).map((t) => {
          const Icon = pickIcon(t);
          return (
            <Card
              key={t}
              className="rounded-2xl border-0 bg-[#F1F7FF] p-6 text-center shadow-none"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white">
                <Icon className="h-10 w-10 text-[#0B6FB6]" />
              </div>
              <p className="mt-4 text-sm font-extrabold text-[#0B6FB6]">
                {t}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
