"use client";

import {
  AlertCircle,
  Maximize2,
  MousePointer2,
  Move,
  RotateCcw,
  Search,
  Tag,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { obtenerPlanoProyecto } from "./planos-data";

type EstadoPlano = "disponible" | "reservado" | "vendido";

type LotePlano = {
  id: string;
  numero: string;
  area: number;
  precioLista: number;
  estado: EstadoPlano;
  cliente?: {
    nombres?: string;
  };
  operacion?: {
    precioVenta?: number;
  };
};

type Props = {
  proyectoSlug: string;
  lotes: LotePlano[];
  lotesFiltrados: LotePlano[];
  onSeleccionar: (lote: LotePlano) => void;
};

const ESTADO: Record<
  EstadoPlano,
  {
    label: string;
    punto: string;
    anillo: string;
    fondo: string;
    texto: string;
  }
> = {
  disponible: {
    label: "Disponible",
    punto: "bg-emerald-500",
    anillo: "border-emerald-400 ring-emerald-400/30",
    fondo: "bg-emerald-500/10",
    texto: "text-emerald-100",
  },
  reservado: {
    label: "Reservado",
    punto: "bg-amber-400",
    anillo: "border-amber-300 ring-amber-300/35",
    fondo: "bg-amber-400/15",
    texto: "text-amber-100",
  },
  vendido: {
    label: "Vendido",
    punto: "bg-rose-500",
    anillo: "border-rose-400 ring-rose-400/35",
    fondo: "bg-rose-500/15",
    texto: "text-rose-100",
  },
};

function moneda(valor: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(valor) ? valor : 0);
}

export default function PlanoLotes({
  proyectoSlug,
  lotes,
  lotesFiltrados,
  onSeleccionar,
}: Props) {
  const plano = obtenerPlanoProyecto(proyectoSlug);

  const [zoom, setZoom] = useState(1);
  const [mostrarCodigos, setMostrarCodigos] = useState(false);
  const [imagenLista, setImagenLista] = useState(false);
  const [imagenError, setImagenError] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({
    pointerId: -1,
    x: 0,
    y: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  useEffect(() => {
    setZoom(1);
    setMostrarCodigos(false);
    setImagenLista(false);
    setImagenError(false);
    setArrastrando(false);
  }, [proyectoSlug]);

  useEffect(() => {
    const actualizar = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", actualizar);
    return () => document.removeEventListener("fullscreenchange", actualizar);
  }, []);

  const lotesPorNumero = useMemo(
    () => new Map(lotes.map((lote) => [lote.numero, lote])),
    [lotes],
  );

  const idsVisibles = useMemo(
    () => new Set(lotesFiltrados.map((lote) => lote.id)),
    [lotesFiltrados],
  );

  const hayFiltro = lotesFiltrados.length !== lotes.length;

  const resumen = useMemo(
    () =>
      lotes.reduce(
        (acc, lote) => {
          acc[lote.estado] += 1;
          return acc;
        },
        { disponible: 0, reservado: 0, vendido: 0 },
      ),
    [lotes],
  );

  if (!plano) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="font-black text-slate-900">Plano no configurado</p>
        <p className="mt-1 text-sm text-slate-500">
          Este proyecto todavía no tiene un plano interactivo asociado.
        </p>
      </div>
    );
  }

  function acercar() {
    setZoom((actual) => Math.min(Number((actual + 0.2).toFixed(2)), 3));
  }

  function alejar() {
    setZoom((actual) => Math.max(Number((actual - 0.2).toFixed(2)), 1));
  }

  function restablecer() {
    setZoom(1);
    setArrastrando(false);

    window.requestAnimationFrame(() => {
      viewportRef.current?.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });
  }

  async function pantallaCompleta() {
    const elemento = viewportRef.current?.parentElement;
    if (!elemento) return;

    try {
      if (!document.fullscreenElement) {
        await elemento.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // El plano sigue funcionando aunque el navegador bloquee fullscreen.
    }
  }

  function comenzarArrastre(evento: ReactPointerEvent<HTMLDivElement>) {
    if (zoom <= 1 || !viewportRef.current) return;

    const target = evento.target as HTMLElement;
    if (target.closest("[data-lote-plano='true']")) return;

    evento.currentTarget.setPointerCapture(evento.pointerId);
    dragRef.current = {
      pointerId: evento.pointerId,
      x: evento.clientX,
      y: evento.clientY,
      scrollLeft: viewportRef.current.scrollLeft,
      scrollTop: viewportRef.current.scrollTop,
    };
    setArrastrando(true);
  }

  function moverArrastre(evento: ReactPointerEvent<HTMLDivElement>) {
    if (
      !arrastrando ||
      dragRef.current.pointerId !== evento.pointerId ||
      !viewportRef.current
    ) {
      return;
    }

    const dx = evento.clientX - dragRef.current.x;
    const dy = evento.clientY - dragRef.current.y;

    viewportRef.current.scrollLeft = dragRef.current.scrollLeft - dx;
    viewportRef.current.scrollTop = dragRef.current.scrollTop - dy;
  }

  function terminarArrastre(evento: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current.pointerId === evento.pointerId) {
      try {
        evento.currentTarget.releasePointerCapture(evento.pointerId);
      } catch {
        // Sin acción.
      }
    }

    dragRef.current.pointerId = -1;
    setArrastrando(false);
  }

  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-[#071625] shadow-sm">
      <header className="flex flex-col gap-3 border-b border-white/10 bg-[#081b30] px-3 py-3 text-white xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-1">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#F5AA17]">
              Plano del proyecto
            </p>
            <p className="mt-0.5 text-[11px] text-white/55">
              Clic en un lote = abrir ficha
            </p>
          </div>

          <Leyenda
            color="bg-emerald-500"
            texto={`Disponibles ${resumen.disponible}`}
          />
          <Leyenda
            color="bg-amber-400"
            texto={`Reservados ${resumen.reservado}`}
          />
          <Leyenda color="bg-rose-500" texto={`Vendidos ${resumen.vendido}`} />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {hayFiltro && (
            <span className="mr-1 inline-flex items-center gap-1.5 rounded-xl border border-sky-400/20 bg-sky-400/10 px-2.5 py-2 text-[10px] font-bold text-sky-100">
              <Search className="h-3.5 w-3.5" />
              {lotesFiltrados.length} resultado
              {lotesFiltrados.length === 1 ? "" : "s"}
            </span>
          )}

          <button
            type="button"
            onClick={() => setMostrarCodigos((actual) => !actual)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-[10px] font-bold text-white/80 transition hover:bg-white/10"
          >
            <Tag className="h-3.5 w-3.5" />
            {mostrarCodigos ? "Ocultar códigos" : "Mostrar códigos"}
          </button>

          <ControlPlano onClick={alejar} disabled={zoom <= 1} title="Alejar">
            <ZoomOut className="h-4 w-4" />
          </ControlPlano>

          <span className="min-w-11 text-center text-[10px] font-black text-white/65">
            {Math.round(zoom * 100)}%
          </span>

          <ControlPlano onClick={acercar} disabled={zoom >= 3} title="Acercar">
            <ZoomIn className="h-4 w-4" />
          </ControlPlano>

          <ControlPlano onClick={restablecer} title="Ver plano completo">
            <RotateCcw className="h-4 w-4" />
          </ControlPlano>

          <ControlPlano
            onClick={() => void pantallaCompleta()}
            title={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            <Maximize2 className="h-4 w-4" />
          </ControlPlano>
        </div>
      </header>

      <div
        ref={viewportRef}
        onPointerDown={comenzarArrastre}
        onPointerMove={moverArrastre}
        onPointerUp={terminarArrastre}
        onPointerCancel={terminarArrastre}
        onDoubleClick={(evento) => {
          const target = evento.target as HTMLElement;
          if (!target.closest("[data-lote-plano='true']")) restablecer();
        }}
        className={`relative bg-slate-950 ${
          zoom > 1 || fullscreen ? "max-h-[84vh] overflow-auto" : "overflow-hidden"
        } ${zoom > 1 ? (arrastrando ? "cursor-grabbing" : "cursor-grab") : ""}`}
        style={{ touchAction: zoom > 1 ? "none" : "auto" }}
      >
        <div
          className="relative origin-top-left"
          style={{
            width: `${zoom * 100}%`,
            minWidth: "100%",
            aspectRatio: `${plano.ancho} / ${plano.alto}`,
          }}
        >
          {!imagenError && (
            <img
              key={plano.imagen}
              src={plano.imagen}
              alt={plano.alt}
              draggable={false}
              onLoad={() => {
                setImagenLista(true);
                setImagenError(false);
              }}
              onError={() => {
                setImagenLista(false);
                setImagenError(true);
              }}
              className={`absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-300 ${
                imagenLista ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {!imagenLista && !imagenError && (
            <div className="absolute inset-0 grid place-items-center bg-[#0b1728]">
              <div className="text-center text-white/70">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-white/15 border-t-[#F5AA17]" />
                <p className="mt-3 text-xs font-bold">Cargando plano...</p>
              </div>
            </div>
          )}

          {imagenError && (
            <div className="absolute inset-0 grid place-items-center bg-[#0b1728] p-6">
              <div className="max-w-xl rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5 text-center text-white">
                <AlertCircle className="mx-auto h-8 w-8 text-rose-300" />
                <p className="mt-3 font-black">No se encontró la imagen del plano</p>
                <p className="mt-2 text-xs leading-5 text-white/65">
                  Copia el archivo exactamente en:
                </p>
                <code className="mt-2 block rounded-lg bg-black/25 px-3 py-2 text-[11px] text-rose-100">
                  public{plano.imagen}
                </code>
              </div>
            </div>
          )}

          {imagenLista &&
            plano.marcadores.map((marcador) => {
              const lote = lotesPorNumero.get(marcador.numero);
              if (!lote) return null;

              const config = ESTADO[lote.estado];
              const coincide = idsVisibles.has(lote.id);
              const apagado = hayFiltro && !coincide;
              const escala = marcador.escala ?? 1;

              return (
                <button
                  key={marcador.numero}
                  data-lote-plano="true"
                  type="button"
                  onClick={(evento) => {
                    evento.stopPropagation();
                    onSeleccionar(lote);
                  }}
                  onDoubleClick={(evento) => evento.stopPropagation()}
                  style={{
                    left: `${marcador.x}%`,
                    top: `${marcador.y}%`,
                    width: `calc(clamp(30px, 3vw, 46px) * ${escala})`,
                    height: `calc(clamp(30px, 3vw, 46px) * ${escala})`,
                  }}
                  className={`group absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none transition duration-150 ${
                    apagado
                      ? "pointer-events-none scale-75 opacity-10 grayscale"
                      : "hover:z-40 hover:scale-125 focus-visible:z-40 focus-visible:scale-125"
                  }`}
                  aria-label={`${lote.numero} - ${config.label}`}
                >
                  {/* El centro queda casi transparente para no tapar el número original del plano. */}
                  <span
                    className={`absolute inset-[12%] rounded-full border-[3px] ring-2 transition group-hover:ring-4 ${config.anillo} ${config.fondo}`}
                  />

                  <span
                    className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white shadow-md ${config.punto}`}
                  />

                  {mostrarCodigos && (
                    <span
                      className={`absolute left-1/2 top-[calc(100%+3px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950/85 px-1.5 py-0.5 text-[8px] font-black shadow-lg backdrop-blur ${config.texto}`}
                    >
                      {lote.numero}
                    </span>
                  )}

                  <span className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 hidden w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-slate-950/95 p-3 text-left text-white shadow-2xl backdrop-blur group-hover:block group-focus-visible:block">
                    <span className="flex items-center justify-between gap-2">
                      <strong className="text-sm">{lote.numero}</strong>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white/70">
                        <i className={`h-2 w-2 rounded-full ${config.punto}`} />
                        {config.label}
                      </span>
                    </span>

                    <span className="mt-2 block text-[11px] text-white/65">
                      {lote.area} m² ·{" "}
                      {moneda(lote.operacion?.precioVenta ?? lote.precioLista)}
                    </span>

                    {lote.cliente?.nombres && (
                      <span className="mt-1 block truncate text-[11px] font-semibold text-white/90">
                        {lote.cliente.nombres}
                      </span>
                    )}

                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#F5AA17]">
                      <MousePointer2 className="h-3 w-3" />
                      Clic para abrir la ficha
                    </span>
                  </span>
                </button>
              );
            })}
        </div>

        {imagenLista && (
          <div className="pointer-events-none sticky bottom-3 z-30 mx-auto mb-3 flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-[9px] font-semibold text-white/60 shadow-lg backdrop-blur">
            {zoom > 1 ? (
              <>
                <Move className="h-3 w-3" /> Arrastra para moverte · doble clic para
                ver todo
              </>
            ) : (
              <>Pasa el cursor sobre un lote o haz clic para editarlo</>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Leyenda({
  color,
  texto,
}: {
  color: string;
  texto: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[9px] font-bold text-white/75 sm:text-[10px]">
      <i className={`h-2 w-2 rounded-full ${color}`} />
      {texto}
    </span>
  );
}

function ControlPlano({
  children,
  onClick,
  title,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}