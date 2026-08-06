"use client";

import dynamic from "next/dynamic";
import {
  ArrowRightLeft,
  Building2,
  CarFront,
  Clock3,
  ExternalLink,
  Layers3,
  MapPin,
  Maximize2,
  Minimize2,
  MousePointerClick,
  Navigation,
  Route,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { CroquisPoint } from "./croquis-map";

const CroquisMap = dynamic(() => import("./croquis-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[680px] items-center justify-center bg-[#0B1F2E]">
      <div className="text-center text-white">
        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-white/20 border-t-[#F5AA17]" />
        <p className="mt-4 text-sm font-bold text-white/70">
          Cargando vista satelital...
        </p>
      </div>
    </div>
  ),
});

type RouteResult = {
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][];
  source: "osrm" | "estimate";
};

type MetricsCache = Record<string, RouteResult>;

const POINTS: CroquisPoint[] = [
  {
    id: "plaza-mayor",
    name: "Plaza Mayor de Huamanga",
    shortName: "Plaza Mayor",
    type: "origin",
    coordinates: [-13.160278, -74.225556],
    subtitle: "Punto central de referencia en Ayacucho.",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=-13.160278,-74.225556",
  },
  {
    id: "grifo-ayacucho",
    name: "Grifo Ayacucho",
    shortName: "Grifo Ayacucho",
    type: "origin",
    coordinates: [-13.1467569, -74.2317794],
    subtitle: "Punto de partida hacia Ccorihuillca.",
    googleMapsUrl: "https://maps.app.goo.gl/9jhvZRUC3YA4foEY8",
  },
  {
    id: "sector-ccorihuillca",
    name: "Sector Ccorihuillca",
    shortName: "Sector Ccorihuillca",
    type: "sector",
    coordinates: [-13.1408571, -74.248226],
    subtitle: "Referencia general del sector.",
    googleMapsUrl: "https://maps.app.goo.gl/FMAYcoXd8UBmNWFQ9",
  },
  {
    id: "ccorihuillca-chico",
    name: "Pueblo de Ccorihuillca Chico",
    shortName: "Ccorihuillca Chico",
    type: "sector",
    coordinates: [-13.1314493, -74.2520002],
    subtitle: "Referencia cercana a los proyectos.",
    googleMapsUrl: "https://maps.app.goo.gl/yYj2MiA9jjZwn1YW9",
  },
  {
    id: "el-mirador",
    name: "El Mirador de Ccorihuillca",
    shortName: "El Mirador",
    type: "project",
    coordinates: [-13.128541, -74.256153],
    subtitle: "Proyecto inmobiliario.",
    googleMapsUrl: "https://maps.app.goo.gl/CvnvYCVpXH2CjMEe7",
  },
  {
    id: "el-golf",
    name: "El Golf de Ccorihuillca",
    shortName: "El Golf",
    type: "project",
    coordinates: [-13.128793, -74.250873],
    subtitle: "Proyecto inmobiliario.",
    googleMapsUrl: "https://maps.app.goo.gl/Qu67EH5DrozquDdSA",
  },
  {
    id: "campo-real",
    name: "Campo Real",
    shortName: "Campo Real",
    type: "project",
    coordinates: [-13.137238, -74.258029],
    subtitle: "Proyecto inmobiliario.",
    googleMapsUrl: "https://maps.app.goo.gl/X9BEKGSK53V2WRUv7",
  },
];

const ORIGIN_IDS = [
  "plaza-mayor",
  "grifo-ayacucho",
  "sector-ccorihuillca",
  "ccorihuillca-chico",
] as const;
const DESTINATION_IDS = [
  "plaza-mayor",
  "grifo-ayacucho",
  "sector-ccorihuillca",
  "ccorihuillca-chico",
  "el-mirador",
  "el-golf",
  "campo-real",
] as const;
const PROJECT_IDS = ["el-mirador", "el-golf", "campo-real"] as const;

function getPoint(id: string) {
  const point = POINTS.find((item) => item.id === id);
  if (!point) throw new Error(`No existe el punto ${id}`);
  return point;
}

function routeKey(originId: string, destinationId: string) {
  return `${originId}__${destinationId}`;
}

function haversineKm(
  origin: [number, number],
  destination: [number, number],
) {
  const earthRadius = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLat = toRadians(destination[0] - origin[0]);
  const deltaLon = toRadians(destination[1] - origin[1]);
  const lat1 = toRadians(origin[0]);
  const lat2 = toRadians(destination[0]);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function createEstimate(
  origin: CroquisPoint,
  destination: CroquisPoint,
): RouteResult {
  const straightKm = haversineKm(origin.coordinates, destination.coordinates);
  const distanceKm = Math.max(straightKm * 1.38, 0.2);
  const durationMinutes = Math.max(Math.round((distanceKm / 24) * 60), 1);

  return {
    distanceKm,
    durationMinutes,
    coordinates: [origin.coordinates, destination.coordinates],
    source: "estimate",
  };
}

async function requestRoute(
  origin: CroquisPoint,
  destination: CroquisPoint,
  signal?: AbortSignal,
): Promise<RouteResult> {
  if (origin.id === destination.id) {
    return {
      distanceKm: 0,
      durationMinutes: 0,
      coordinates: [origin.coordinates],
      source: "estimate",
    };
  }

  const [originLat, originLon] = origin.coordinates;
  const [destinationLat, destinationLon] = destination.coordinates;
  const url =
    "https://router.project-osrm.org/route/v1/driving/" +
    `${originLon},${originLat};${destinationLon},${destinationLat}` +
    "?overview=full&geometries=geojson&steps=false";

  try {
    const response = await fetch(url, {
      signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`Routing HTTP ${response.status}`);

    const data = (await response.json()) as {
      code?: string;
      routes?: Array<{
        distance: number;
        duration: number;
        geometry?: { coordinates?: [number, number][] };
      }>;
    };

    const route = data.routes?.[0];
    const geometry = route?.geometry?.coordinates;

    if (
      data.code !== "Ok" ||
      !route ||
      !Array.isArray(geometry) ||
      geometry.length < 2
    ) {
      throw new Error("Ruta no disponible");
    }

    return {
      distanceKm: route.distance / 1000,
      durationMinutes: Math.max(Math.round(route.duration / 60), 1),
      coordinates: geometry.map(([lon, lat]) => [lat, lon]),
      source: "osrm",
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    return createEstimate(origin, destination);
  }
}

function formatDistance(distanceKm?: number) {
  if (distanceKm === undefined) return "--";
  return distanceKm < 1
    ? `${Math.round(distanceKm * 1000)} m`
    : `${distanceKm.toFixed(1)} km`;
}

function formatDuration(durationMinutes?: number) {
  if (durationMinutes === undefined) return "--";
  if (durationMinutes === 0) return "Origen";
  return `${durationMinutes} min`;
}

function googleDirectionsUrl(
  origin: CroquisPoint,
  destination: CroquisPoint,
) {
  const [originLat, originLon] = origin.coordinates;
  const [destinationLat, destinationLon] = destination.coordinates;

  return (
    "https://www.google.com/maps/dir/?api=1" +
    `&origin=${originLat},${originLon}` +
    `&destination=${destinationLat},${destinationLon}` +
    "&travelmode=driving"
  );
}

export default function CroquisClient() {
  const [selectedId, setSelectedId] = useState("sector-ccorihuillca");
  const [originId, setOriginId] = useState("grifo-ayacucho");
  const [pendingOriginId, setPendingOriginId] = useState<string | null>(null);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(() =>
    createEstimate(getPoint("grifo-ayacucho"), getPoint("sector-ccorihuillca")),
  );
  const [routeEnabled, setRouteEnabled] = useState(true);
  const [metrics, setMetrics] = useState<MetricsCache>({});
  const [routeLoading, setRouteLoading] = useState(true);
  const [mapExpanded, setMapExpanded] = useState(false);

  const selectedPoint = getPoint(selectedId);
  const originPoint = getPoint(originId);

  useEffect(() => {
    if (!routeEnabled) {
      setRouteLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;
    setRouteLoading(true);

    void requestRoute(originPoint, selectedPoint, controller.signal)
      .then((result) => {
        if (!active) return;
        setRouteResult(result);
        setMetrics((current) => ({
          ...current,
          [routeKey(originId, selectedId)]: result,
        }));
      })
      .catch((error) => {
        if (
          active &&
          !(error instanceof DOMException && error.name === "AbortError")
        ) {
          setRouteResult(createEstimate(originPoint, selectedPoint));
        }
      })
      .finally(() => {
        if (active) setRouteLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [originId, originPoint, routeEnabled, selectedId, selectedPoint]);

  useEffect(() => {
    let active = true;
    const controllers: AbortController[] = [];

    async function preloadMetrics() {
      for (const projectId of PROJECT_IDS) {
        for (const currentOriginId of ORIGIN_IDS) {
          if (!active) return;

          const controller = new AbortController();
          controllers.push(controller);

          try {
            const result = await requestRoute(
              getPoint(currentOriginId),
              getPoint(projectId),
              controller.signal,
            );

            if (!active) return;
            setMetrics((current) => ({
              ...current,
              [routeKey(currentOriginId, projectId)]: result,
            }));
          } catch {
            // La ruta activa conserva su cálculo referencial.
          }
        }
      }
    }

    void preloadMetrics();

    return () => {
      active = false;
      controllers.forEach((controller) => controller.abort());
    };
  }, []);

  const routeSummary = useMemo(
    () => ({
      distance: routeResult ? formatDistance(routeResult.distanceKm) : "--",
      duration: routeResult ? formatDuration(routeResult.durationMinutes) : "--",
    }),
    [routeResult],
  );

  const pendingOriginPoint = pendingOriginId
    ? getPoint(pendingOriginId)
    : null;

  function setQuickOrigin(id: string) {
    setPendingOriginId(null);
    setRouteEnabled(true);
    setOriginId(id);

    if (selectedId === id) {
      const alternative = DESTINATION_IDS.find((pointId) => pointId !== id);
      if (alternative) setSelectedId(alternative);
    }
  }

  function setQuickDestination(id: string) {
    setPendingOriginId(null);
    setRouteEnabled(true);

    if (id === originId) {
      const previousDestination = selectedId;
      setOriginId(previousDestination);
      setSelectedId(id);
      return;
    }

    setSelectedId(id);
  }

  function handleMapPointClick(id: string) {
    if (!pendingOriginId) {
      setPendingOriginId(id);
      setRouteEnabled(false);
      setRouteResult(null);
      return;
    }

    if (pendingOriginId === id) {
      clearRoute();
      return;
    }

    setOriginId(pendingOriginId);
    setSelectedId(id);
    setPendingOriginId(null);
    setRouteEnabled(true);
  }

  function clearRoute() {
    setPendingOriginId(null);
    setRouteEnabled(false);
    setRouteResult(null);
    setRouteLoading(false);
  }

  function swapRoute() {
    if (originId === selectedId) return;
    setPendingOriginId(null);
    setRouteEnabled(true);
    setOriginId(selectedId);
    setSelectedId(originId);
  }

  return (
    <main className="min-h-screen bg-[#071C31] text-slate-950">
      <header className="relative z-[700] border-b border-white/10 bg-[#071C31] px-4 py-3 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1700px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#F5AA17] p-2.5 text-[#071C31]">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-black leading-none">Mapa de proyectos</p>
              <p className="mt-1 text-[11px] font-semibold text-white/50">
                Ccorihuillca · Ayacucho
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <p className="mb-1 hidden text-right text-[9px] font-black uppercase tracking-[0.14em] text-white/35 sm:block">
              Accesos rápidos de origen
            </p>
            <div className="flex w-full overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 sm:w-auto">
            {ORIGIN_IDS.map((id) => {
              const point = getPoint(id);
              const active = originId === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setQuickOrigin(id)}
                  className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-black transition sm:text-xs ${
                    active
                      ? "bg-white text-[#123B68] shadow"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Desde {point.shortName}
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </header>

      <section
        className={`relative ${
          mapExpanded
            ? "fixed inset-0 z-[1000] h-[100svh]"
            : "h-[calc(100svh-116px)] min-h-[560px] sm:h-[calc(100svh-73px)] sm:min-h-[640px]"
        }`}
      >
        <CroquisMap
          points={POINTS}
          selectedId={selectedId}
          routeCoordinates={routeEnabled && routeResult ? routeResult.coordinates : []}
          routeOriginId={routeEnabled ? originId : ""}
          pendingOriginId={pendingOriginId}
          onSelect={handleMapPointClick}
          onClearSelection={clearRoute}
        />

        <div className="absolute left-2 right-2 top-2 z-[600] sm:left-4 sm:right-auto sm:top-4 sm:w-[330px]">
          <motion.div
            layout
            className="rounded-2xl border border-white/70 bg-white/94 p-2.5 shadow-[0_20px_70px_rgba(0,0,0,.28)] backdrop-blur-xl sm:p-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#C88A16]">
                  {routeEnabled ? "Ruta seleccionada" : "Selecciona una ruta"}
                </p>
                <h1 className="mt-0.5 flex min-w-0 items-center gap-1.5 text-sm font-black text-slate-950 sm:text-base">
                  {routeEnabled ? (
                    <>
                      <span className="truncate">{originPoint.shortName}</span>
                      <span className="shrink-0 text-[#C88A16]">→</span>
                      <span className="truncate">{selectedPoint.shortName}</span>
                    </>
                  ) : pendingOriginPoint ? (
                    <span className="truncate">Origen: {pendingOriginPoint.shortName}</span>
                  ) : (
                    <span className="truncate">Haz clic en dos puntos</span>
                  )}
                </h1>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={swapRoute}
                  disabled={!routeEnabled || originId === selectedId}
                  className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:text-[#123B68] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Intercambiar origen y destino"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </button>
              <button
                type="button"
                onClick={() => setMapExpanded((current) => !current)}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:text-[#123B68]"
                aria-label={mapExpanded ? "Reducir mapa" : "Ampliar mapa"}
              >
                {mapExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <Metric
                icon={<Route className="h-4 w-4" />}
                label="Distancia"
                value={!routeEnabled ? "--" : routeLoading ? "..." : routeSummary.distance}
              />
              <Metric
                icon={<Clock3 className="h-4 w-4" />}
                label="Tiempo"
                value={!routeEnabled ? "--" : routeLoading ? "..." : routeSummary.duration}
              />
            </div>

            {routeEnabled && (
              <div className="mt-2 flex gap-2">
                <a
                  href={googleDirectionsUrl(originPoint, selectedPoint)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#123B68] px-3 py-2.5 text-xs font-black text-white transition hover:bg-[#0D2F54]"
                >
                  <CarFront className="h-4 w-4" />
                  Iniciar ruta
                </a>
                <a
                  href={selectedPoint.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-slate-600 transition hover:text-[#123B68]"
                  aria-label="Abrir ubicación en Google Maps"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </motion.div>
        </div>

        <div className="absolute left-2 right-2 top-[151px] z-[610] flex justify-center sm:left-4 sm:right-auto sm:top-[169px] sm:w-[330px]">
          <div className={`flex w-full items-center gap-2 rounded-2xl border px-3 py-2 text-[11px] font-bold shadow-xl backdrop-blur-xl transition ${
            pendingOriginPoint
              ? "border-[#F5AA17]/70 bg-[#071C31]/94 text-white"
              : "border-white/70 bg-white/92 text-slate-700"
          }`}>
            <MousePointerClick className={`h-4 w-4 shrink-0 ${
              pendingOriginPoint ? "text-[#F5AA17]" : "text-[#123B68]"
            }`} />
            <p className="min-w-0 flex-1 leading-4">
              {pendingOriginPoint ? (
                <>Ahora selecciona el destino.</>
              ) : (
                <>Clic en origen y destino · doble clic para limpiar.</>
              )}
            </p>
          </div>
        </div>

        <div className="absolute right-4 top-4 z-[600] hidden w-[230px] rounded-2xl border border-white/20 bg-[#071C31]/90 p-3 text-white shadow-2xl backdrop-blur-xl xl:block">
          <p className="px-2 pb-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/45">
            Destinos
          </p>
          <div className="space-y-1.5">
            {PROJECT_IDS.filter((id) => id !== originId).map((id) => {
              const point = getPoint(id);
              const active = selectedId === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setQuickDestination(id)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left transition ${
                    active
                      ? "bg-[#F5AA17] text-[#071C31]"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {point.type === "project" ? (
                    <Building2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <MapPin className="h-4 w-4 shrink-0" />
                  )}
                  <span className="truncate text-xs font-black">
                    {point.shortName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-2 left-2 right-2 z-[600] sm:bottom-4 sm:left-4 sm:right-4">
          <div className="croquis-project-strip mx-auto flex max-w-[980px] gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible">
            {PROJECT_IDS.map((id) => {
              const project = getPoint(id);
              const plaza = metrics[routeKey("plaza-mayor", id)];
              const grifo = metrics[routeKey("grifo-ayacucho", id)];
              const sector = metrics[routeKey("sector-ccorihuillca", id)];
              const pueblo = metrics[routeKey("ccorihuillca-chico", id)];
              const active = selectedId === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setQuickDestination(id)}
                  className={`min-w-[92%] rounded-2xl border p-2.5 text-left shadow-[0_15px_45px_rgba(0,0,0,.25)] backdrop-blur-xl transition hover:-translate-y-0.5 sm:min-w-[48%] md:min-w-0 ${
                    active
                      ? "border-[#F5AA17] bg-[#071C31]/95 text-white ring-2 ring-[#F5AA17]/40"
                      : "border-white/60 bg-white/94 text-slate-950"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-black sm:text-sm">
                      {project.shortName}
                    </span>
                    <Navigation
                      className={`h-3.5 w-3.5 shrink-0 ${
                        active ? "text-[#F5AA17]" : "text-[#123B68]"
                      }`}
                    />
                  </div>
                  <div className="mt-1.5 grid grid-cols-2 gap-1">
                    <SmallMetric
                      label="Plaza"
                      value={`${formatDistance(plaza?.distanceKm)} · ${formatDuration(
                        plaza?.durationMinutes,
                      )}`}
                      dark={active}
                    />
                    <SmallMetric
                      label="Grifo"
                      value={`${formatDistance(grifo?.distanceKm)} · ${formatDuration(
                        grifo?.durationMinutes,
                      )}`}
                      dark={active}
                    />
                    <SmallMetric
                      label="Sector"
                      value={`${formatDistance(sector?.distanceKm)} · ${formatDuration(
                        sector?.durationMinutes,
                      )}`}
                      dark={active}
                    />
                    <SmallMetric
                      label="Pueblo"
                      value={`${formatDistance(pueblo?.distanceKm)} · ${formatDuration(
                        pueblo?.durationMinutes,
                      )}`}
                      dark={active}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="croquis-destination-strip absolute left-2 right-2 top-[154px] z-[600] flex gap-1.5 overflow-x-auto pb-1 sm:left-4 sm:right-auto sm:top-[168px] sm:max-w-[calc(100%-32px)] xl:hidden">
          {PROJECT_IDS.filter((id) => id !== originId).map((id) => {
            const point = getPoint(id);
            const active = selectedId === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setQuickDestination(id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[9px] font-black shadow-lg backdrop-blur-xl sm:text-[10px] ${
                  active
                    ? "border-[#F5AA17] bg-[#F5AA17] text-[#071C31]"
                    : "border-white/60 bg-white/92 text-slate-700"
                }`}
              >
                {point.shortName}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-100 p-2">
      <div className="flex items-center gap-1.5 text-[#C88A16]">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-[0.1em]">
          {label}
        </span>
      </div>
      <p className="mt-0.5 text-xs font-black text-slate-950 sm:text-sm">{value}</p>
    </div>
  );
}

function SmallMetric({
  label,
  value,
  dark,
}: {
  label: string;
  value: string;
  dark: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-2 py-1 ${
        dark ? "bg-white/10" : "bg-slate-100"
      }`}
    >
      <p
        className={`text-[8px] font-black uppercase tracking-[0.1em] ${
          dark ? "text-white/45" : "text-slate-400"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-0.5 whitespace-nowrap text-[9px] font-black sm:text-[10px] ${
          dark ? "text-white" : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}