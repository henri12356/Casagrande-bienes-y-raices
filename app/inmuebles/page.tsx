/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, FC, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

import proyectosData from "@/app/data/proyectos.json";
import propiedadesData from "@/app/data/propiedades.json";
import alquileresData from "@/app/data/alquileres.json";

import Navbar from "../navbar";
import Footer from "../footer";
import HeroInmuebles from "./HeroInmuebles";

// --- TIPOS ---
type Tipo = "todos" | "proyecto" | "propiedad" | "alquiler";
type TipoOperacion = "comprar" | "alquilar";
type TipoInmueble =
  | "terreno"
  | "casa"
  | "departamento"
  | "oficina"
  | "local"
  | "otro";

interface ItemBase {
  slug: string;
  tipo: Tipo;

  titulo: string;
  subtitulo: string;
  categoria: string;

  ubicacion: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;

  precioDesdeSol: string;
  precioDesdeDolar: string;
  monedaPrincipal?: "USD" | "PEN";
  /** Precio normalizado a soles para filtros numéricos */
  precioNumero?: number;

  imagen: string;
  etiquetas: string[];

  tipoOperacion: TipoOperacion;
  tipoInmueble: TipoInmueble;

  areaM2?: number;
  dormitorios?: number;
  banos?: number;
  cocheras?: number;

  resumen?: string;
}

const TABS: { id: Tipo; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "proyecto", label: "Proyectos" },
  { id: "propiedad", label: "Propiedades" },
  { id: "alquiler", label: "Alquileres" },
];

type OrderBy = "relevancia" | "precio-asc" | "precio-desc";

const PAGE_SIZE = 12;
const USD_TO_PEN = 3.8;

// --- HELPERS ---
const inferOperacion = (tipo: Tipo): TipoOperacion =>
  tipo === "alquiler" ? "alquilar" : "comprar";

const inferInmueble = (categoria: string, tipo: Tipo): TipoInmueble => {
  const c = (categoria || "").toLowerCase();
  if (c.includes("lote") || c.includes("terreno") || c.includes("condominio"))
    return "terreno";
  if (c.includes("casa")) return "casa";
  if (c.includes("departamento") || c.includes("depa")) return "departamento";
  if (c.includes("oficina")) return "oficina";
  if (c.includes("local")) return "local";
  return "otro";
};

const parsePrice = (value?: string): number | undefined => {
  if (!value) return undefined;
  const cleaned = value.replace(/[^\d.]/g, "");
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  return Number.isNaN(n) ? undefined : n;
};

const IconLocation: FC = () => (
  <FaMapMarkerAlt className="h-4 w-4" style={{ color: "#FFB200" }} />
);

// Para mapear hash -> tab
const hashToTab = (hash: string): Tipo => {
  if (hash === "proyectos") return "proyecto";
  if (hash === "propiedades") return "propiedad";
  if (hash === "alquileres") return "alquiler";
  return "todos";
};

const tabToHash = (tab: Tipo): string | undefined => {
  if (tab === "proyecto") return "proyectos";
  if (tab === "propiedad") return "propiedades";
  if (tab === "alquiler") return "alquileres";
  return undefined;
};

const InmueblesPage = () => {
  const [tab, setTab] = useState<Tipo>("todos");

  // ESTADOS DEL HERO
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Todos");
  const [orderBy, setOrderBy] = useState<OrderBy>("relevancia");

  // visibilidad incremental
  const [visibleBySection, setVisibleBySection] = useState<{
    proyectos: number;
    propiedades: number;
    alquileres: number;
  }>({
    proyectos: PAGE_SIZE,
    propiedades: PAGE_SIZE,
    alquileres: PAGE_SIZE,
  });

  const [visibleTabCount, setVisibleTabCount] = useState<number>(PAGE_SIZE);

  // Scroll a resultados (llamado desde el Hero)
  const scrollToResults = () => {
    const el = document.getElementById("resultados-anchor");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Reset cantidad visible cuando cambian filtros
  useEffect(() => {
    setVisibleBySection({
      proyectos: PAGE_SIZE,
      propiedades: PAGE_SIZE,
      alquileres: PAGE_SIZE,
    });
    setVisibleTabCount(PAGE_SIZE);
  }, [searchTerm, selectedCity, orderBy]);

  // --- SYNC TAB + SCROLL CON HASH (NAVBAR, LINKS, ETC.) ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyHash = (rawHash: string) => {
      const hash = rawHash.replace("#", "");
      if (!hash) {
        setTab("todos");
        return;
      }

      const newTab = hashToTab(hash);
      setTab(newTab);

      // pequeño delay para asegurar que el DOM ya se renderizó
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
    };

    // Al cargar la página
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash) applyHash(initialHash);

    const onHashChange = () => {
      const h = window.location.hash.replace("#", "");
      applyHash(h);
    };

    const onHashChangeFromNavbar = (event: Event) => {
      const custom = event as CustomEvent<{ hash?: string }>;
      const h = custom.detail?.hash ?? "";
      if (h) applyHash(h);
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener(
      "hashChangeFromNavbar",
      onHashChangeFromNavbar as EventListener
    );

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener(
        "hashChangeFromNavbar",
        onHashChangeFromNavbar as EventListener
      );
    };
  }, []);

  // Normalizamos los 3 JSON
  const items: ItemBase[] = useMemo(() => {
    const norm = (arr: any[], tipo: Tipo): ItemBase[] =>
      arr.map((raw) => {
        const monedaPrincipal: "USD" | "PEN" = raw.monedaPrincipal ?? "PEN";

        const precioSol = parsePrice(raw.precioDesdeSol);
        const precioUsd = parsePrice(raw.precioDesdeDolar);

        let precioNumero: number | undefined;
        if (monedaPrincipal === "USD" && precioUsd !== undefined) {
          precioNumero = precioUsd * USD_TO_PEN;
        } else if (precioSol !== undefined) {
          precioNumero = precioSol;
        } else if (precioUsd !== undefined) {
          precioNumero = precioUsd * USD_TO_PEN;
        }

        return {
          slug: raw.slug,
          tipo,
          titulo: raw.titulo,
          subtitulo: raw.subtitulo ?? "",
          categoria: raw.categoria ?? "",
          ubicacion: raw.ubicacion ?? "",
          departamento: raw.departamento,
          provincia: raw.provincia,
          distrito: raw.distrito,
          precioDesdeSol: raw.precioDesdeSol ?? "",
          precioDesdeDolar: raw.precioDesdeDolar ?? "",
          monedaPrincipal,
          precioNumero,
          imagen: raw.imagen ?? "/proyecto.webp",
          etiquetas: raw.etiquetas ?? [],
          tipoOperacion: raw.tipoOperacion ?? inferOperacion(tipo),
          tipoInmueble:
            raw.tipoInmueble ?? inferInmueble(raw.categoria ?? "", tipo),
          areaM2: raw.areaM2,
          dormitorios: raw.dormitorios,
          banos: raw.banos,
          cocheras: raw.cocheras,
          resumen: raw.resumen,
        };
      });

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

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("Todos");
    setOrderBy("relevancia");
    setTab("todos");
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/inmuebles");
    }
  };

  // FILTRO GLOBAL + ORDEN
  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let result = items.filter((item) => {
      // Filtro por ciudad
      if (selectedCity !== "Todos") {
        const fullLocation = [
          item.departamento,
          item.provincia,
          item.distrito,
          item.ubicacion,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!fullLocation.includes(selectedCity.toLowerCase())) return false;
      }

      // Filtro por texto
      if (term) {
        const zona = [item.departamento, item.provincia, item.distrito]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const match =
          item.titulo.toLowerCase().includes(term) ||
          item.subtitulo.toLowerCase().includes(term) ||
          item.ubicacion.toLowerCase().includes(term) ||
          item.categoria.toLowerCase().includes(term) ||
          zona.includes(term);

        if (!match) return false;
      }

      return true;
    });

    // Orden por precio
    if (orderBy === "precio-asc") {
      result = [...result].sort((a, b) => {
        const pa = a.precioNumero ?? Number.POSITIVE_INFINITY;
        const pb = b.precioNumero ?? Number.POSITIVE_INFINITY;
        return pa - pb;
      });
    } else if (orderBy === "precio-desc") {
      result = [...result].sort((a, b) => {
        const pa = a.precioNumero ?? 0;
        const pb = b.precioNumero ?? 0;
        return pb - pa;
      });
    }

    return result;
  }, [items, searchTerm, selectedCity, orderBy]);

  const groupedItems = useMemo(
    () => ({
      proyectos: filteredItems.filter((i) => i.tipo === "proyecto"),
      propiedades: filteredItems.filter((i) => i.tipo === "propiedad"),
      alquileres: filteredItems.filter((i) => i.tipo === "alquiler"),
    }),
    [filteredItems]
  );

  const filtradosPorTab = useMemo(() => {
    if (tab === "todos") return [];
    return filteredItems.filter((i) => i.tipo === tab);
  }, [filteredItems, tab]);

  const activeTabLabel = TABS.find((t) => t.id === tab)?.label;

  const handleTabChange = (newTab: Tipo) => {
    setTab(newTab);
    const hash = tabToHash(newTab);
    if (typeof window !== "undefined") {
      if (hash) {
        window.history.pushState({}, "", `/inmuebles#${hash}`);
        const el = document.getElementById(hash);
        if (el) {
          setTimeout(
            () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
            50
          );
        }
      } else {
        window.history.pushState({}, "", "/inmuebles");
      }
    }
  };

  // ---------- CARD ----------
  const Card: FC<{ item: ItemBase }> = ({ item }) => (
    <Link href={getHref(item)} className="group h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
        {/* IMAGEN */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={item.imagen}
            alt={item.titulo}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <div className="rounded-full bg-white/90 px-4 py-1 text-xs font-extrabold uppercase tracking-wide text-[#005BBB] shadow-md">
              {item.categoria}
            </div>
          </div>
          <div className="absolute bottom-3 left-3 rounded-full bg-[#005BBB]/90 px-3 py-1 text-[11px] font-semibold text-white">
            {item.tipoOperacion === "alquilar" ? "Alquiler" : "Compra"}
          </div>
        </div>

        {/* BLOQUE INFERIOR */}
        <div className="flex flex-1 flex-col justify-between px-5 pb-5 pt-4 bg-white">
          <div className="space-y-2">
            <div>
              <h3 className="text-base md:text-lg font-extrabold text-slate-900 leading-snug">
                {item.titulo}
              </h3>
              {item.subtitulo && (
                <p className="text-xs font-semibold text-[#005BBB]">
                  {item.subtitulo}
                </p>
              )}
            </div>

            <div className="mt-1 flex items-start gap-2 text-xs md:text-[13px] leading-snug text-slate-600">
              <IconLocation />
              <p>
                {item.ubicacion}
                {item.distrito && `, ${item.distrito}`}
              </p>
            </div>

            {/* chips de área / dorms / baños */}
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-700">
              {item.areaM2 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                  <FaRulerCombined className="h-3 w-3" />
                  {item.areaM2} m²
                </span>
              )}
              {typeof item.dormitorios === "number" && item.dormitorios > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                  <FaBed className="h-3 w-3" />
                  {item.dormitorios} dorm.
                </span>
              )}
              {typeof item.banos === "number" && item.banos > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                  <FaBath className="h-3 w-3" />
                  {item.banos} baño(s)
                </span>
              )}
            </div>

            {/* resumen o etiquetas */}
            <p className="mt-2 line-clamp-2 text-[11px] text-slate-500">
              {item.resumen ?? item.etiquetas.slice(0, 2).join(" • ")}
            </p>
          </div>

          {/* precio */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col text-xs text-slate-600">
              <span className="font-medium">
                {item.tipoOperacion === "alquilar"
                  ? "Renta desde"
                  : "Precio desde"}
              </span>
              <span className="text-sm font-extrabold text-[#005BBB]">
                {item.monedaPrincipal === "USD"
                  ? item.precioDesdeDolar
                  : item.precioDesdeSol}
              </span>
              <span className="text-[11px]">
                {item.precioDesdeDolar} • {item.precioDesdeSol}
              </span>
            </div>

            <button
              type="button"
              className="rounded-full bg-[#FFB200] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#01338C] shadow-md transition-colors group-hover:bg-[#01338C] group-hover:text-white"
            >
              Ver detalle
            </button>
          </div>
        </div>
      </article>
    </Link>
  );

  // ----------------------------------------------

  return (
    <>
      <Navbar />

      {/* HERO CON BUSCADOR */}
      <HeroInmuebles
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onSearchClick={scrollToResults}
      />

      <section className="bg-white pb-20">
        <div
          className="mx-auto max-w-[1500px] px-4 pt-6"
          id="resultados-anchor"
        >
          {/* TABS + ORDEN */}
          <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
            {/* Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {TABS.map((t) => {
                const active = t.id === tab;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTabChange(t.id)}
                    className={`rounded-full px-6 py-2 text-sm font-semibold border transition-all ${
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

            {/* Ordenar + limpiar */}
            <div className="flex items-center justify-end gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Ordenar
                </span>
                <select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value as OrderBy)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
                >
                  <option value="relevancia">Relevancia</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                </select>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-[#005BBB] underline-offset-2 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          {/* CONTENIDO */}
          {tab === "todos" ? (
            <div className="space-y-16">
              {/* PROYECTOS */}
              {groupedItems.proyectos.length > 0 && (
                <section
                  className="scroll-mt-40"
                  id="proyectos"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#005BBB] sm:text-3xl">
                        Proyectos
                        {selectedCity !== "Todos" && (
                          <span className="ml-2 text-lg font-medium text-slate-400">
                            en {selectedCity}
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {groupedItems.proyectos.length} resultados
                      </p>
                    </div>
                    <Link
                      href="/proyectos"
                      className="text-sm font-semibold text-[#005BBB] hover:underline"
                    >
                      Ver todos
                    </Link>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {groupedItems.proyectos
                      .slice(0, visibleBySection.proyectos)
                      .map((item) => (
                        <Card key={item.slug} item={item} />
                      ))}
                  </div>
                  {groupedItems.proyectos.length >
                    visibleBySection.proyectos && (
                    <div className="mt-6 flex justify-center">
                      <button
                        type="button"
                        className="rounded-full border border-[#005BBB] px-6 py-2 text-sm font-semibold text-[#005BBB] hover:bg-[#005BBB] hover:text-white"
                        onClick={() =>
                          setVisibleBySection((prev) => ({
                            ...prev,
                            proyectos: prev.proyectos + PAGE_SIZE,
                          }))
                        }
                      >
                        Ver más proyectos
                      </button>
                    </div>
                  )}
                </section>
              )}

              {/* PROPIEDADES */}
              {groupedItems.propiedades.length > 0 && (
                <section
                  className="scroll-mt-40"
                  id="propiedades"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#005BBB] sm:text-3xl">
                        Propiedades
                        {selectedCity !== "Todos" && (
                          <span className="ml-2 text-lg font-medium text-slate-400">
                            en {selectedCity}
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {groupedItems.propiedades.length} resultados
                      </p>
                    </div>
                    <Link
                      href="/propiedades"
                      className="text-sm font-semibold text-[#005BBB] hover:underline"
                    >
                      Ver todas
                    </Link>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {groupedItems.propiedades
                      .slice(0, visibleBySection.propiedades)
                      .map((item) => (
                        <Card key={item.slug} item={item} />
                      ))}
                  </div>
                  {groupedItems.propiedades.length >
                    visibleBySection.propiedades && (
                    <div className="mt-6 flex justify-center">
                      <button
                        type="button"
                        className="rounded-full border border-[#005BBB] px-6 py-2 text-sm font-semibold text-[#005BBB] hover:bg-[#005BBB] hover:text-white"
                        onClick={() =>
                          setVisibleBySection((prev) => ({
                            ...prev,
                            propiedades: prev.propiedades + PAGE_SIZE,
                          }))
                        }
                      >
                        Ver más propiedades
                      </button>
                    </div>
                  )}
                </section>
              )}

              {/* ALQUILERES */}
              {groupedItems.alquileres.length > 0 && (
                <section
                  className="scroll-mt-40"
                  id="alquileres"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#005BBB] sm:text-3xl">
                        Alquileres
                        {selectedCity !== "Todos" && (
                          <span className="ml-2 text-lg font-medium text-slate-400">
                            en {selectedCity}
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {groupedItems.alquileres.length} resultados
                      </p>
                    </div>
                    <Link
                      href="/alquileres"
                      className="text-sm font-semibold text-[#005BBB] hover:underline"
                    >
                      Ver todos
                    </Link>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {groupedItems.alquileres
                      .slice(0, visibleBySection.alquileres)
                      .map((item) => (
                        <Card key={item.slug} item={item} />
                      ))}
                  </div>
                  {groupedItems.alquileres.length >
                    visibleBySection.alquileres && (
                    <div className="mt-6 flex justify-center">
                      <button
                        type="button"
                        className="rounded-full border border-[#005BBB] px-6 py-2 text-sm font-semibold text-[#005BBB] hover:bg-[#005BBB] hover:text-white"
                        onClick={() =>
                          setVisibleBySection((prev) => ({
                            ...prev,
                            alquileres: prev.alquileres + PAGE_SIZE,
                          }))
                        }
                      >
                        Ver más alquileres
                      </button>
                    </div>
                  )}
                </section>
              )}
            </div>
          ) : (
            // Vista filtrada por tab concreto
            <section
              className="mt-4 scroll-mt-40"
              id={tabToHash(tab)}
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#005BBB] sm:text-3xl">
                    {activeTabLabel}
                    {selectedCity !== "Todos" && (
                      <span className="ml-2 text-lg font-medium text-slate-400">
                        en {selectedCity}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {filtradosPorTab.length} resultados
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {filtradosPorTab
                  .slice(0, visibleTabCount)
                  .map((item) => (
                    <Card key={item.slug} item={item} />
                  ))}
              </div>

              {filtradosPorTab.length > visibleTabCount && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="rounded-full border border-[#005BBB] px-6 py-2 text-sm font-semibold text-[#005BBB] hover:bg-[#005BBB] hover:text-white"
                    onClick={() =>
                      setVisibleTabCount((prev) => prev + PAGE_SIZE)
                    }
                  >
                    Ver más {activeTabLabel?.toLowerCase()}
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default InmueblesPage;
