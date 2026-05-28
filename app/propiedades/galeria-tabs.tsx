"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Images, Video } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function GaleriaTabs({
  fotos,
  youtubeId,
  titulo,
}: {
  fotos: string[];
  youtubeId?: string;
  titulo: string;
}) {
  const safeFotos = useMemo(() => (Array.isArray(fotos) ? fotos : []), [fotos]);
  const hasFotos = safeFotos.length > 0;
  const hasVideo = !!youtubeId?.trim();

  // ✅ FUNCIÓN NUEVA:
  // Si hay video, empieza en video.
  // Si no hay video, empieza en fotos.
  const defaultTab = hasVideo ? "video" : "fotos";

  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((v) => (v - 1 + safeFotos.length) % safeFotos.length);

  const next = () =>
    setActive((v) => (v + 1) % safeFotos.length);

  return (
    <div className="overflow-hidden rounded-3xl bg-[#F3F7FB] p-2">
      <Tabs defaultValue={defaultTab}>
        {/* ✅ CONTENIDO: FOTOS */}
        <TabsContent value="fotos" className="mt-0">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md hover:border-[#01338C]/40">
            <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl border-2 border-[#01338C]/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative aspect-[16/8] w-full">
              {hasFotos ? (
                <Image
                  src={safeFotos[active]}
                  alt={`Foto ${active + 1} - ${titulo}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="100vw"
                  priority={active === 0}
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm font-medium text-slate-600">
                  No hay fotos disponibles aún.
                </div>
              )}

              {hasFotos ? (
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-slate-800 shadow-sm ring-1 ring-black/5 backdrop-blur">
                  {active + 1}/{safeFotos.length}
                </div>
              ) : null}
            </div>

            {safeFotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Anterior"
                  className="absolute cursor-pointer left-4 top-1/2 z-30 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white shadow-md ring-1 ring-black/5 transition hover:opacity-90"
                >
                  <ChevronLeft className="h-6 w-6 text-[#01338C]" />
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Siguiente"
                  className="absolute cursor-pointer right-4 top-1/2 z-30 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white shadow-md ring-1 ring-black/5 transition hover:opacity-90"
                >
                  <ChevronRight className="h-6 w-6 text-[#01338C]" />
                </button>
              </>
            )}
          </div>

          {hasFotos && safeFotos.length > 1 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {safeFotos.slice(0, 12).map((src, idx) => {
                const isActive = idx === active;

                return (
                  <button
                    key={`${src}-${idx}`}
                    type="button"
                    onClick={() => setActive(idx)}
                    className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-xl border bg-white shadow-sm transition ${
                      isActive
                        ? "border-[#01338C] ring-2 ring-[#01338C]/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    aria-label={`Ver foto ${idx + 1}`}
                    title={`Foto ${idx + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`Miniatura ${idx + 1} - ${titulo}`}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
        </TabsContent>

        {/* ✅ CONTENIDO: VIDEO */}
        <TabsContent value="video" className="mt-0">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md hover:border-[#01338C]/40">
            <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl border-2 border-[#01338C]/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative aspect-video w-full">
              {hasVideo ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={`Video - ${titulo}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm text-slate-600">
                  Este proyecto no tiene video aún.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ✅ Tabs abajo */}
        <div className="mt-6 flex justify-center">
          <div className="rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <TabsList className="rounded-full bg-transparent p-0">
              <div className="pr-2">
                <TabsTrigger
                  value="fotos"
                  disabled={!hasFotos}
                  className="rounded-full px-6 transition-all duration-300 cursor-pointer
                    data-[state=active]:bg-[#01338C] data-[state=active]:text-white
                    data-[state=active]:ring-2 data-[state=active]:ring-[#01338C]/25
                    data-[state=active]:shadow-sm border-2 border-solid border-[#01338C]"
                >
                  <span className="inline-flex items-center gap-2">
                    <Images className="h-4 w-4" />
                    Fotos
                  </span>
                </TabsTrigger>
              </div>

              <TabsTrigger
                value="video"
                disabled={!hasVideo}
                className="rounded-full px-6 transition-all duration-300 cursor-pointer
                  data-[state=active]:bg-[#01338C] data-[state=active]:text-white
                  data-[state=active]:ring-2 data-[state=active]:ring-[#01338C]/25
                  data-[state=active]:shadow-sm gap-2 border-2 border-solid border-[#01338C]"
              >
                <span className="inline-flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Video
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </Tabs>
    </div>
  );
}