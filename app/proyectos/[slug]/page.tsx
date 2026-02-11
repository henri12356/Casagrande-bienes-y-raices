/* eslint-disable @typescript-eslint/no-explicit-any */
// app/proyectos/[slug]/page.tsx
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import proyectosData from "@/app/data/proyectos.json";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";



import Footer from "@/app/footer";
import Navbar from "@/app/navbar";
import EquipamientoGrid from "@/app/propiedades/equipamiento-grid";
import GaleriaTabs from "@/app/propiedades/galeria-tabs";
import SectionAnimation from "@/app/propiedades/section-animation";
import StickyContactoCardCentenario from "@/app/propiedades/sticky-contacto-card";

type KV = { label: string; value: string };
type Promo = { titulo: string; detalle?: string };

type BloquePlanos = {
  titulo?: string;
  imagen: string;
  pdf?: string;
  nota?: string;
};

type BloqueFuturo = {
  titulo?: string;
  imagen: string;
  nota?: string;
};

type Proyecto = {
  slug: string;
  tipo: "proyecto" | "propiedad";
  titulo: string;
  subtitulo?: string;
  categoria?: string;

  ubicacion: string;

  precioDesdeSol: string;
  precioDesdeDolar?: string;
  pagoContado?: string;

  imagen: string;
  etiquetas?: string[];

  descripcion?: string;

  caracteristicas?: KV[];
  promociones?: Promo[];
  equipamiento?: string[];

  planos?: BloquePlanos;
  futuro?: BloqueFuturo;

  stockLotes?: {
    total?: number;
    restantes?: number;
    actualizado?: string;
  };

  galeria: {
    fotos: string[];
    youtubeId?: string;
  };

  ubicacionImagen?: string;
  mapsUrl?: string;

  descuento?: {
    titulo: string;
    imagen: string;
  };

  contacto: {
    whatsapp: string;
    telefono: string;
    direccion: string;
    horario?: string;
  };
};

const data = proyectosData as unknown as Proyecto[];

function softReq(ok: boolean, msg: string) {
  if (!ok) throw new Error(msg);
}

function onlyNumber(v: string) {
  return String(v ?? "")
    .replace(/s\/|S\/|\s|,/g, "")
    .replace(/[^\d.]/g, "")
    .trim();
}

function safeDecodeSlug(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

async function getParams(
  input: { slug: string } | Promise<{ slug: string }>
): Promise<{ slug: string }> {
  const p: any = input;
  if (p && typeof p.then === "function") return await p;
  return p as { slug: string };
}

export default async function ProyectoPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = await getParams(params);

  // ✅ CLAVE: el slug puede venir como ca%C3%B1ones...
  const decodedSlug = safeDecodeSlug(slug);

  // ✅ Match robusto (por si llega raw o decoded)
  const proyecto =
    data.find((p) => p.slug === decodedSlug) || data.find((p) => p.slug === slug);

  if (!proyecto) notFound();

  // ✅ HARD REQUIREMENTS: 100% JSON
  softReq(!!proyecto.imagen, `Falta imagen (hero) en JSON: ${proyecto.slug}`);
  softReq(!!proyecto.ubicacion, `Falta ubicacion en JSON: ${proyecto.slug}`);
  softReq(
    !!proyecto.precioDesdeSol,
    `Falta precioDesdeSol en JSON: ${proyecto.slug}`
  );
  softReq(
    !!proyecto.galeria?.fotos?.length,
    `Faltan fotos en galeria: ${proyecto.slug}`
  );
  softReq(
    !!proyecto.contacto?.whatsapp &&
      !!proyecto.contacto?.telefono &&
      !!proyecto.contacto?.direccion,
    `Falta contacto (whatsapp/telefono/direccion) en JSON: ${proyecto.slug}`
  );

  const fotos = proyecto.galeria.fotos;
  const youtubeId = proyecto.galeria.youtubeId;
  const equipamiento = proyecto.equipamiento ?? [];
  const promos = proyecto.promociones ?? [];
  const precioNum = onlyNumber(proyecto.precioDesdeSol);

  // ✅ PLANO GENERAL (VISIBLE)
  const planoImg = proyecto.planos?.imagen;
  const planoHref = proyecto.planos?.pdf ?? proyecto.planos?.imagen;

  // ✅ FUTURO (proyección)
  const futuroImg = proyecto.futuro?.imagen;

  // ✅ DATOS DE LOTES (para el título)
  const totalLotes = proyecto.stockLotes?.total;
  const disponibles = proyecto.stockLotes?.restantes;
  const actualizado = proyecto.stockLotes?.actualizado;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white pt-20 lg:pt-[140px]">
        {/* =========================
            HERO (imagen + overlay)
        ========================= */}
        <section className="relative">
          <div className="relative h-80 w-full md:h-[400px] lg:h-[555px]">
            <Image
              src={proyecto.imagen}
              alt={`${proyecto.titulo} ${proyecto.subtitulo ?? ""}`.trim()}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0" />
            <div className="absolute inset-0 bg-linear-to-t bg-black/5 to-transparent" />

            <div className="absolute inset-0">
              <div className="mx-auto h-full max-w-7xl px-4">
                <div className="flex h-full flex-col justify-end pb-10 md:pb-12">
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="rounded-full bg-[#FFB200] px-4 py-2 text-xs font-extrabold text-slate-900 hover:bg-[#ffbf2e]">
                      {proyecto.tipo === "proyecto" ? "LOTES" : "PROPIEDAD"}
                    </Badge>

                    {proyecto.etiquetas?.map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="rounded-full bg-[#FFB200] text-slate-900 font-bold backdrop-blur"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              BANDA AMARILLA (PORTAL)
              ✅ NO TOCAR DISEÑO PRECIO
          ========================= */}
          <div className="relative bg-[#FFB200]">
            <div className="relative mx-auto max-w-[1400px] px-4 py-10">
              <div className="">
                <div className="md:flex items-start gap-10 justify-between">
                  <div className="">
                    <p className="text-[16px] font-extrabold text-slate-900/80">
                      {proyecto.subtitulo}
                    </p>

                    <h2 className="mt-1 text-[32px] font-black tracking-tight text-slate-900 md:text-6xl">
                      {proyecto.titulo ?? ""}
                    </h2>

                    {/* ✅ BADGES LOTES */}
                    {proyecto.tipo === "proyecto" && totalLotes != null ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-slate-900/15 bg-white/80 px-4 py-2 text-xs font-extrabold text-slate-900 shadow-sm ring-1 ring-black/5 backdrop-blur">
                          {totalLotes} lotes
                        </span>

                        {disponibles != null ? (
                          <span className="inline-flex items-center rounded-full border border-[#01338C]/30 bg-white/80 px-4 py-2 text-xs font-extrabold text-[#01338C] shadow-sm ring-1 ring-black/5 backdrop-blur">
                            {disponibles} disponibles
                          </span>
                        ) : null}

                        {actualizado ? (
                          <span className="inline-flex items-center rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-black/5 backdrop-blur">
                            Actualizado: {actualizado}
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-col gap-3 text-sm text-slate-900 sm:flex-row sm:items-center sm:gap-8">
                      {/* ✅ UBICACION: link a Maps (solo si hay url) */}
                      {proyecto.mapsUrl ? (
                        <a
                          href={proyecto.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:underline"
                          aria-label="Abrir ubicación en Maps"
                          title="Abrir en Maps"
                        >
                          <MapPin className="h-4 w-4" />
                          <span className="font-bold">{proyecto.ubicacion}</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-bold">{proyecto.ubicacion}</span>
                        </div>
                      )}

                      {proyecto.contacto.horario ? (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-bold">
                            {proyecto.contacto.horario}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* ✅ PRECIO (NO TOCAR) */}
                  <div className="flex pt-10 w-full max-w-[520px]">
                    <div className="flex max-md:flex-col w-full max-w-[520px] gap-3 rounded-3xl bg-[#01338C] px-6 py-5 text-white shadow-[0_26px_70px_rgba(2,6,23,0.35)] ring-1 ring-white/10">
                      {/* CONTADO */}
                      <div className="flex flex-1 flex-col justify-center rounded-2xl bg-white/15 px-5 py-4 ring-1 ring-white/10">
                        <p className="text-xs font-extrabold uppercase text-white/80">
                          Contado
                        </p>

                        <div className="mt-1 flex items-end gap-2">
                          <span className="text-2xl font-black leading-none">
                            S/
                          </span>
                          <span className="text-5xl font-black leading-none tracking-tight">
                            {precioNum}
                          </span>
                        </div>
                      </div>

                      {/* CRÉDITO */}
                      {proyecto.pagoContado ? (
                        <div className="flex flex-1 flex-col justify-center rounded-2xl bg-white/20 px-5 py-4 ring-1 ring-white/10">
                          <p className="text-xs font-extrabold uppercase text-white/80">
                            Crédito
                          </p>

                          <p className="mt-1 text-4xl font-black leading-none">
                            {proyecto.pagoContado}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            CONTENIDO + FORM
        ========================= */}
        <section className="mx-auto max-w-[1400px] px-4 pb-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
            {/* IZQUIERDA */}
            <div className="pt-10 lg:pt-12">
              {proyecto.descripcion ? (
                <SectionAnimation>
                  <Card className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_16px_45px_rgba(2,6,23,0.06)]">
                    <h2 className="text-3xl font-extrabold text-[#01338C]">
                      Descripción
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-slate-700">
                      {proyecto.descripcion}
                    </p>
                  </Card>
                </SectionAnimation>
              ) : null}

              {equipamiento.length > 0 ? (
                <SectionAnimation>
                  <div className="mt-10">
                    <EquipamientoGrid items={equipamiento} />
                  </div>
                </SectionAnimation>
              ) : null}

              {promos.length ? (
                <SectionAnimation>
                  <div className="pt-10">
                    <h2 className="text-3xl font-extrabold text-[#01338C]">
                      Promociones
                    </h2>
                    <div className="mt-6 grid gap-4">
                      {promos.map((p, i) => (
                        <Card
                          key={`${p.titulo}-${i}`}
                          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(2,6,23,0.05)]"
                        >
                          <p className="text-base font-black text-slate-900">
                            {p.titulo}
                          </p>
                          {p.detalle ? (
                            <p className="mt-1 text-sm text-slate-600">
                              {p.detalle}
                            </p>
                          ) : null}
                        </Card>
                      ))}
                    </div>
                  </div>
                </SectionAnimation>
              ) : null}

              <SectionAnimation>
                <div className="pt-10">
                  <h2 className="text-3xl font-extrabold text-[#01338C]">
                    Galería de Fotos y Videos
                  </h2>
                  <div className="mt-6">
                    <GaleriaTabs
                      fotos={fotos}
                      youtubeId={youtubeId}
                      titulo={proyecto.titulo}
                    />
                  </div>
                </div>
              </SectionAnimation>

              {/* ✅ PLANOS (SOLO PLANO GENERAL) */}
              {proyecto.tipo === "proyecto" && planoImg ? (
                <SectionAnimation>
                  <div className="pt-10">
                    <h2 className="text-3xl font-extrabold text-[#01338C]">
                      Plano del proyecto
                    </h2>

                    <Card className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_16px_45px_rgba(2,6,23,0.06)]">
                      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                        <a
                          href={planoHref}
                          target="_blank"
                          rel="noreferrer"
                          className="group block"
                          title="Ver plano del proyecto"
                        >
                          <div className="relative aspect-[16/7] w-full overflow-hidden">
                            <Image
                              src={planoImg}
                              alt={`Plano del proyecto - ${proyecto.titulo}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="100vw"
                            />

                            <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                              <div className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-[#01338C] opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                                Ver plano
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </Card>
                  </div>
                </SectionAnimation>
              ) : null}

              {/* ✅ UBICACIÓN */}
              {proyecto.mapsUrl ? (
                <SectionAnimation>
                  <div className="pt-10">
                    <h2 className="text-3xl font-extrabold text-[#01338C]">
                      Ubicación Perfecta
                    </h2>

                    <a
                      href={proyecto.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                      aria-label="Ver ubicación en Google Maps"
                      title="Abrir en Maps"
                    >
                      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-[#F3F7FB] shadow-[0_16px_45px_rgba(2,6,23,0.06)]">
                        <div className="relative aspect-[16/7] w-full">
                          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <Image
                            src={proyecto.ubicacionImagen ?? proyecto.imagen}
                            alt={`Mapa - ${proyecto.titulo}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            sizes="100vw"
                          />
                        </div>

                        <div className="px-6 py-5 text-sm text-slate-800">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#0B6FB6]" />
                            <span className="font-extrabold">
                              {proyecto.ubicacion}
                            </span>
                            <span className="ml-auto text-xs font-bold text-[#0B6FB6] underline">
                              Ver en Maps
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </SectionAnimation>
              ) : null}
            </div>

            {/* FORM sticky */}
            <div className="lg:sticky lg:top-[120px] pt-72 lg:self-start">
              <div className="-mt-10 md:-mt-16 lg:-mt-[250px]">
                <StickyContactoCardCentenario
                  proyecto={`${proyecto.titulo} ${proyecto.subtitulo ?? ""}`.trim()}
                  tipo={proyecto.tipo === "proyecto" ? "LOTES" : "PROPIEDAD"}
                  whatsapp={proyecto.contacto.whatsapp}
                  telefono={proyecto.contacto.telefono}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  return data.map((p) => ({ slug: p.slug }));
}
