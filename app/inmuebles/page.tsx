/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaCreditCard, FaShieldAlt, FaSearch } from "react-icons/fa";

import proyectosData from "@/app/data/proyectos.json";
import propiedadesData from "@/app/data/propiedades.json";
import alquileresData from "@/app/data/alquileres.json";
import Navbar from "../navbar";
import Footer from "../footer";
import HeroInmuebles from "./HeroInmuebles";

// --- TIPOS Y DATOS ---
type Tipo = "todos" | "proyecto" | "propiedad" | "alquiler";

interface ItemBase {
  slug: string;
  tipo: Tipo;
  titulo: string;
  subtitulo: string;
  categoria: string;
  ubicacion: string;
  precioDesdeSol: string;
  precioDesdeDolar: string;
  imagen: string;
  etiquetas: string[];
}

const TABS: { id: Tipo; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "proyecto", label: "Proyectos" },
  { id: "propiedad", label: "Propiedades" },
  { id: "alquiler", label: "Alquileres" },
];

// ICONOS
const IconLocation: FC = () => (
  <FaMapMarkerAlt className="h-4 w-4" style={{ color: "#FFB200" }} />
);
const IconCredit: FC = () => (
  <FaCreditCard className="h-4 w-4" style={{ color: "#FFB200" }} />
);
const IconService: FC = () => (
  <FaShieldAlt className="h-4 w-4" style={{ color: "#FFB200" }} />
);

const InmueblesPage = () => {
  const [tab, setTab] = useState<Tipo>("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Normalizamos JSON
  const items: ItemBase[] = useMemo(() => {
    const norm = (arr: any[], tipo: Tipo): ItemBase[] =>
      arr.map((item) => ({
        ...item,
        tipo,
      }));

    return [
      ...norm(proyectosData as any[], "proyecto"),
      ...norm(propiedadesData as any[], "propiedad"),
      ...norm(alquileresData as any[], "alquiler"),
    ];
  }, []);

  const getHref = (item: ItemBase) => {
    if (item.tipo === "proyecto") return `/proyectos/${item.slug}`;
    if (item.tipo === "propiedad") return `/propiedades/${item.slug}`;
    return `/alquileres/${item.slug}`;
  };

  // FILTROS
  const groupedItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const matches = (item: ItemBase) =>
      item.titulo.toLowerCase().includes(term) ||
      item.ubicacion.toLowerCase().includes(term);

    return {
      proyectos: items.filter((i) => i.tipo === "proyecto" && matches(i)),
      propiedades: items.filter((i) => i.tipo === "propiedad" && matches(i)),
      alquileres: items.filter((i) => i.tipo === "alquiler" && matches(i)),
    };
  }, [items, searchTerm]);

  const filtradosPorTab = useMemo(() => {
    if (tab === "todos") return [];
    const term = searchTerm.toLowerCase();
    const matches = (item: ItemBase) =>
      item.titulo.toLowerCase().includes(term) ||
      item.ubicacion.toLowerCase().includes(term);

    return items.filter((i) => i.tipo === tab && matches(i));
  }, [items, tab, searchTerm]);

  const activeTabLabel = TABS.find((t) => t.id === tab)?.label;

  // ---------- CARD CON DISEÑO TIPO LOS PORTALES ----------
  // ---------- CARD CON DISEÑO TIPO LOS PORTALES ----------
const Card = (item: ItemBase) => (
  <Link href={getHref(item)} className="group h-full">
    <article
      className="flex h-full flex-col rounded-[32px] bg-white shadow-lg overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl"
    >
      {/* IMAGEN (PANORÁMICA) */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={item.imagen}
          alt={item.titulo}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* PASTILLA AMARILLA DENTRO DE LA IMAGEN, ARRIBA-IZQUIERDA */}
        <div className="absolute top-4 left-4">
          <div
            className="rounded-full px-5 py-2 text-xs font-extrabold uppercase tracking-wide shadow-md"
            style={{ backgroundColor: "#FFB200", color: "#005BBB" }}
          >
            {item.categoria}
          </div>
        </div>
      </div>

      {/* BLOQUE AZUL INFERIOR */}
      <div
        className="flex flex-1 flex-col justify-between px-6 pt-5 pb-6 text-white"
        style={{ backgroundColor: "#005BBB" }}
      >
        <div className="space-y-3">
          {/* TÍTULO + SUBTÍTULO */}
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold leading-snug">
              {item.titulo}
            </h3>
            {item.subtitulo && (
              <p
                className="mt-1 text-xs md:text-sm font-semibold"
                style={{ color: "#FFDD66" }}
              >
                {item.subtitulo}
              </p>
            )}
          </div>

          {/* UBICACIÓN */}
          <div className="mt-1 flex items-start gap-2 text-xs md:text-sm leading-snug">
            <IconLocation />
            <p>{item.ubicacion}</p>
          </div>

          {/* ETIQUETAS (Crédito directo, Pre venta, etc.) */}
          <div className="mt-2 space-y-1.5 text-xs md:text-sm">
            {item.etiquetas.slice(0, 2).map((tag) => (
              <div key={tag} className="flex items-center gap-2">
                {tag.toLowerCase().includes("crédito") ? (
                  <IconCredit />
                ) : (
                  <IconService />
                )}
                <p>{tag}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BOTÓN / PASTILLA DE “CUOTA DESDE” */}
        <div className="mt-5 flex justify-center">
          <div
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-xs md:text-sm font-semibold shadow-lg"
            style={{ backgroundColor: "#FFB200", color: "#01338C" }}
          >
            <span className="mr-1 text-xs md:text-sm font-normal">
              Cuota desde:
            </span>
            <span className="font-bold">{item.precioDesdeDolar}</span>
            <span className="mx-1 text-[11px] md:text-xs font-normal">o</span>
            <span className="font-bold">{item.precioDesdeSol}</span>
          </div>
        </div>
      </div>
    </article>
  </Link>
);
// -------------------------------------------------------

  // -------------------------------------------------------

  return (
    <>
      <Navbar />
      <HeroInmuebles />

      {/* OJO: ya no usamos pt-28 aquí, solo abajo */}
      <section className="bg-white pb-20">
        <div className="mx-auto max-w-[1500px] px-4">
          {/* Tabs + buscador, estilo imagen */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* TABS tipo pill */}
            <div className="flex w-full flex-wrap items-center justify-center gap-3 md:justify-start">
              {TABS.map((t) => {
                const active = t.id === tab;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`rounded-full px-6 py-2 text-sm font-semibold border transition-all
                      ${
                        active
                          ? "bg-[#005BBB] text-white border-[#005BBB] shadow-md"
                          : "bg-white text-[#005BBB] border-[#005BBB] hover:bg-slate-50"
                      }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* BUSCADOR tipo pill */}
            <div className="w-full md:w-80">
              <div className="relative">
                <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar propiedades"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#005BBB] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* ===================== */}
          {/* CONTENIDO            */}
          {/* ===================== */}
          {tab === "todos" ? (
            <div className="mt-12 space-y-16">
              {/* PROYECTOS */}
              {groupedItems.proyectos.length > 0 && (
                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-[#005BBB] sm:text-3xl">
                      Proyectos
                    </h2>
                    <Link
                      href="/proyectos"
                      className="text-sm font-semibold text-[#005BBB] hover:underline"
                    >
                      Ver todos
                    </Link>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {groupedItems.proyectos.map((item) => Card(item))}
                  </div>
                </section>
              )}

              {/* PROPIEDADES */}
              {groupedItems.propiedades.length > 0 && (
                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-[#005BBB] sm:text-3xl">
                      Propiedades
                    </h2>
                    <Link
                      href="/propiedades"
                      className="text-sm font-semibold text-[#005BBB] hover:underline"
                    >
                      Ver todas
                    </Link>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {groupedItems.propiedades.map((item) => Card(item))}
                  </div>
                </section>
              )}

              {/* ALQUILERES */}
              {groupedItems.alquileres.length > 0 && (
                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-[#005BBB] sm:text-3xl">
                      Alquileres
                    </h2>
                    <Link
                      href="/alquileres"
                      className="text-sm font-semibold text-[#005BBB] hover:underline"
                    >
                      Ver todas
                    </Link>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {groupedItems.alquileres.map((item) => Card(item))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="mt-12">
              {/* Título grande según tab */}
              <h2 className="mb-8 text-2xl font-extrabold text-[#005BBB] sm:text-3xl">
                {activeTabLabel}
              </h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {filtradosPorTab.map((item) => Card(item))}
              </div>
            </div>
          )}

          {/* Botón ver más cuando no es "todos" */}
          {tab !== "todos" && (
            <div className="mt-10 flex justify-center">
              <Link
                href={
                  tab === "proyecto"
                    ? "/proyectos"
                    : tab === "propiedad"
                    ? "/propiedades"
                    : "/alquileres"
                }
                className="rounded-full bg-[#FFB200] px-6 py-3 text-sm font-semibold text-[#01338C] shadow hover:brightness-110"
              >
                Ver más {TABS.find((t) => t.id === tab)?.label.toLowerCase()}
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default InmueblesPage;
