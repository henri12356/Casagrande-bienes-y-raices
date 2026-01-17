"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  const [active, setActive] = useState(0);

  const prev = () => setActive((v) => (v - 1 + safeFotos.length) % safeFotos.length);
  const next = () => setActive((v) => (v + 1) % safeFotos.length);

  return (
    <div className="overflow-hidden rounded-3xl bg-[#F3F7FB] p-6">
      <Tabs defaultValue="fotos">
        <TabsContent value="fotos" className="mt-0">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="relative aspect-[16/8] w-full">
              <Image
                src={safeFotos[active]}
                alt={`Foto ${active + 1} - ${titulo}`}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>

            {/* Flechas circulares blancas */}
            {safeFotos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Anterior"
                  className="absolute left-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white shadow-md hover:opacity-90"
                >
                  <ChevronLeft className="h-6 w-6 text-[#0B6FB6]" />
                </button>
                <button
                  onClick={next}
                  aria-label="Siguiente"
                  className="absolute right-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white shadow-md hover:opacity-90"
                >
                  <ChevronRight className="h-6 w-6 text-[#0B6FB6]" />
                </button>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="video" className="mt-0">
          <div className="overflow-hidden rounded-2xl bg-white">
            <div className="relative aspect-video w-full">
              {youtubeId ? (
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

        {/* Tabs abajo centrados */}
        <div className="mt-6 flex justify-center">
          <TabsList className="rounded-full bg-white p-1 shadow-sm">
            <TabsTrigger value="video" className="rounded-full px-6">
              Videos
            </TabsTrigger>
            <TabsTrigger value="fotos" className="rounded-full px-6">
              Fotos
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
