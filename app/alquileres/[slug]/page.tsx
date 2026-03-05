// app/alquileres/[slug]/page.tsx
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import alquileresData from "@/app/data/alquileres.json";

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

type Alquiler = {
  slug: string;

  // el JSON puede tener "alquiler" o "casa" (y otros)
  tipo?: "alquiler" | "casa" | "propiedad" | "proyecto";

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

const data = alquileresData as unknown as Alquiler[];

function softReq(ok: boolean, msg: string) {
  if (!ok) throw new Error(msg);
}

function onlyNumber(v: string) {
  return String(v ?? "")
    .replace(/s\/|S\/|\s|,/gi, "")
    .trim();
}

export default async function AlquilerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const alquiler = data.find((p) => p.slug === slug);
  if (!alquiler) notFound();

  // ✅ HARD REQUIREMENTS
  softReq(!!alquiler.imagen, `Falta imagen (hero) en JSON: ${alquiler.slug}`);
  softReq(!!alquiler.ubicacion, `Falta ubicacion en JSON: ${alquiler.slug}`);
  softReq(
    !!alquiler.precioDesdeSol,
    `Falta precioDesdeSol en JSON: ${alquiler.slug}`,
  );
  softReq(
    !!alquiler.galeria?.fotos?.length,
    `Faltan fotos en galeria: ${alquiler.slug}`,
  );
  softReq(
    !!alquiler.contacto?.whatsapp &&
      !!alquiler.contacto?.telefono &&
      !!alquiler.contacto?.direccion,
    `Falta contacto (whatsapp/telefono/direccion) en JSON: ${alquiler.slug}`,
  );

  const fotos = alquiler.galeria.fotos;
  const youtubeId = alquiler.galeria.youtubeId;
  const equipamiento = alquiler.equipamiento ?? [];
  const promos = alquiler.promociones ?? [];
  const precioNum = onlyNumber(alquiler.precioDesdeSol);

  const planoImg = alquiler.planos?.imagen;
  const planoHref = alquiler.planos?.pdf ?? alquiler.planos?.imagen;

  const futuroImg = alquiler.futuro?.imagen;

  // ✅ Solo si aplica a proyectos (normalmente no en alquileres)
  const totalLotes = alquiler.stockLotes?.total;
  const disponibles = alquiler.stockLotes?.restantes;
  const actualizado = alquiler.stockLotes?.actualizado;

  // ✅ LABEL visible (puede decir ALQUILER)
  const badgeLabel =
    alquiler.tipo === "proyecto"
      ? "LOTES"
      : alquiler.tipo === "alquiler"
        ? "ALQUILER"
        : "CASA";

  // ✅ TIPO para StickyContactoCardCentenario (DEBE coincidir con su union type)
  // sticky-contacto-card.tsx acepta: "LOTES" | "DEPARTAMENTOS" | "CASAS" | "PROPIEDAD"
  const stickyTipo: "LOTES" | "DEPARTAMENTOS" | "CASAS" | "PROPIEDAD" =
    alquiler.tipo === "proyecto"
      ? "LOTES"
      : alquiler.tipo === "alquiler"
        ? "CASAS"
        : "CASAS";

  const showLotesBadges = alquiler.tipo === "proyecto" && totalLotes != null;

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
              src={alquiler.imagen}
              alt={`${alquiler.titulo} ${alquiler.subtitulo ?? ""}`.trim()}
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
                      {badgeLabel}
                    </Badge>

                    {alquiler.etiquetas?.map((t) => (
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
                      {alquiler.subtitulo}
                    </p>

                    <h2 className="mt-1 text-[32px] font-black tracking-tight text-slate-900 md:text-6xl">
                      {alquiler.titulo ?? ""}
                    </h2>

                    {/* ✅ BADGES DE LOTES (solo si es proyecto) */}
                    {showLotesBadges ? (
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
                      {/* ✅ UBICACION: link a Maps (si no hay mapsUrl, no rompe) */}
                      {alquiler.mapsUrl ? (
                        <a
                          href={alquiler.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:underline"
                          aria-label="Abrir ubicación en Maps"
                          title="Abrir en Maps"
                        >
                          <MapPin className="h-4 w-4" />
                          <span className="font-bold">{alquiler.ubicacion}</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-bold">{alquiler.ubicacion}</span>
                        </div>
                      )}

                      {alquiler.contacto.horario ? (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-bold">
                            {alquiler.contacto.horario}
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
                      {alquiler.pagoContado ? (
                        <div className="flex flex-1 flex-col justify-center rounded-2xl bg-white/20 px-5 py-4 ring-1 ring-white/10">
                          <p className="text-xs font-extrabold uppercase text-white/80">
                            Crédito
                          </p>

                          <p className="mt-1 text-4xl font-black leading-none">
                            {alquiler.pagoContado}
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
              {alquiler.descripcion ? (
                <SectionAnimation>
                  <Card className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_16px_45px_rgba(2,6,23,0.06)]">
                    <h2 className="text-3xl font-extrabold text-[#01338C]">
                      Descripción
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-slate-700">
                      {alquiler.descripcion}
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
                      titulo={alquiler.titulo}
                    />
                  </div>
                </div>
              </SectionAnimation>

              {/* ✅ PLANOS (solo si viene en JSON) */}
              {planoImg ? (
                <SectionAnimation>
                  <div className="pt-10">
                    <h2 className="text-3xl font-extrabold text-[#01338C]">
                      Plano
                    </h2>

                    <Card className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_16px_45px_rgba(2,6,23,0.06)]">
                      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                        <a
                          href={planoHref}
                          target="_blank"
                          rel="noreferrer"
                          className="group block"
                          title="Ver plano"
                        >
                          <div className="relative aspect-[16/7] w-full overflow-hidden">
                            <Image
                              src={planoImg}
                              alt={`Plano - ${alquiler.titulo}`}
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
              <SectionAnimation>
                <div className="pt-10">
                  <h2 className="text-3xl font-extrabold text-[#01338C]">
                    Ubicación
                  </h2>

                  {alquiler.mapsUrl ? (
                    <a
                      href={alquiler.mapsUrl}
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
                            src={alquiler.ubicacionImagen ?? alquiler.imagen}
                            alt={`Mapa - ${alquiler.titulo}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            sizes="100vw"
                          />
                        </div>

                        <div className="px-6 py-5 text-sm text-slate-800">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#0B6FB6]" />
                            <span className="font-extrabold">
                              {alquiler.ubicacion}
                            </span>
                            <span className="ml-auto text-xs font-bold text-[#0B6FB6] underline">
                              Ver en Maps
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <Card className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_16px_45px_rgba(2,6,23,0.06)]">
                      <div className="flex items-center gap-2 text-slate-800">
                        <MapPin className="h-4 w-4 text-[#0B6FB6]" />
                        <span className="font-extrabold">
                          {alquiler.ubicacion}
                        </span>
                      </div>
                    </Card>
                  )}
                </div>
              </SectionAnimation>

              {/* ✅ FUTURO (si viene) */}
              {futuroImg ? (
                <SectionAnimation>
                  <div className="pt-10">
                    <h2 className="text-3xl font-extrabold text-[#01338C]">
                      Proyección
                    </h2>
                    <Card className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white p-0 shadow-[0_16px_45px_rgba(2,6,23,0.06)]">
                      <div className="relative aspect-[16/7] w-full">
                        <Image
                          src={futuroImg}
                          alt={`Proyección - ${alquiler.titulo}`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                        />
                      </div>
                    </Card>
                  </div>
                </SectionAnimation>
              ) : null}
            </div>

            {/* FORM sticky */}
            <div className="lg:sticky lg:top-[120px] pt-72 lg:self-start">
              <div className="-mt-10 md:-mt-16 lg:-mt-[250px]">
                <StickyContactoCardCentenario
                  proyecto={`${alquiler.titulo} ${alquiler.subtitulo ?? ""}`.trim()}
                  tipo={stickyTipo}
                  whatsapp={alquiler.contacto.whatsapp}
                  telefono={alquiler.contacto.telefono}
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