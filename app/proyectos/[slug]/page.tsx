/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";

import proyectosData from "@/app/data/proyectos.json";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const ProyectoPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  const proyecto = (proyectosData as any[]).find(
    (p) => p.slug === slug
  );

  if (!proyecto) {
    notFound();
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative h-72 w-full overflow-hidden rounded-3xl shadow-md">
            <Image
              src={proyecto.imagen}
              alt={proyecto.titulo}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB200]">
              Proyecto
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#01338C]">
              {proyecto.titulo}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{proyecto.subtitulo}</p>

            <p className="mt-4 text-sm text-slate-700">
              Ubicación:{" "}
              <span className="font-semibold">{proyecto.ubicacion}</span>
            </p>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
              <p className="text-slate-500">Cuota desde</p>
              <p className="text-xl font-bold text-[#01338C]">
                {proyecto.precioDesdeSol}{" "}
                <span className="text-sm text-slate-500">
                  ({proyecto.precioDesdeDolar})
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProyectoPage;

// SSG opcional
export async function generateStaticParams() {
  return (proyectosData as any[]).map((p) => ({ slug: p.slug }));
}
