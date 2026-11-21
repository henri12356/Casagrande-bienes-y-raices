"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Eye,
  MapPin,
  MessageCircle,
  Navigation,
  Sparkles,
  X,
} from "lucide-react";

// ==================================================
// CONFIGURACIÓN DEL FESTIVAL
// ==================================================

const CONFIG = {
  // VIDEO DE YOUTUBE
  videoId: "1czI9RGIRYY",

  // CAMBIAR SI QUIERES EMPEZAR MÁS ADELANTE
  videoInicio: 60,

  // IMÁGENES EN PUBLIC
  festivalSvg: "/FESTIVALLOTES.svg",
  logo: "/logo.svg",

  // IMAGEN DEL BOTÓN "VER PROYECTO" (guardarla en public)
  imagenProyecto: "/EL-MIRADOR-DE-CCORIHUILLCA/PLANOCCORIHUILLCA.webp",

  // DURACIÓN DE INTRO
  duracionIntro: 3000,

  // DOMINGO 06 DE DICIEMBRE DE 2026, 9:00 A. M. (PERÚ)
  fechaEvento: "2026-12-06T09:00:00-05:00",
  horaEvento: "9:00 a. m.",

  // PROMOCIÓN
  // El precio aparece primero como "precioInicial"
  // y baja con animación hasta "precioDesde".
  precioInicial: 20000,
  precioDesde: 12500,

  // ANIMACIÓN COMPACTA DEL PRECIO (en milisegundos)
  // Mostrar precio regular → tacharlo → bajar a precio festival.
  pausaPrecio: 950,
  pausaTachado: 720,
  duracionPrecio: 2000,

  // WHATSAPP
  // (el mensaje se arma abajo con el precio y el descuento)
  whatsapp: "51916194372",

  // PUNTO DE ENCUENTRO
  maps:
    "https://maps.app.goo.gl/aXs8Vfe5SZjAu5e47",
};

const formatoPrecio = (valor: number) =>
  valor.toLocaleString("en-US");

const AHORRO = CONFIG.precioInicial - CONFIG.precioDesde;
const DESCUENTO_PORCENTAJE =
  (AHORRO / CONFIG.precioInicial) * 100;

const MENSAJE_WHATSAPP =
  `Hola, vi la invitación al Festival de Lotes de Casagrande del domingo 6 de diciembre a las 9:00 a. m. ` +
  `Deseo confirmar mi asistencia y recibir información sobre los lotes desde ` +
  `S/ ${formatoPrecio(CONFIG.precioDesde)}.`;

const URL_WHATSAPP =
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
    MENSAJE_WHATSAPP
  )}`;

const EASE = [0.22, 1, 0.36, 1] as const;

// FRENA SUAVE AL LLEGAR AL PRECIO FINAL
const EASE_PRECIO = [0.33, 1, 0.68, 1] as const;

// ==================================================
// FONDO: VIDEO DE YOUTUBE
// ==================================================

function FondoYoutube() {
  const reducirMovimiento =
    Boolean(useReducedMotion());

  const urlVideo =
    `https://www.youtube-nocookie.com/embed/${CONFIG.videoId}` +
    `?autoplay=1` +
    `&mute=1` +
    `&controls=0` +
    `&loop=1` +
    `&playlist=${CONFIG.videoId}` +
    `&playsinline=1` +
    `&rel=0` +
    `&disablekb=1` +
    `&fs=0` +
    `&start=${CONFIG.videoInicio}`;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#041531]"
      aria-hidden="true"
    >
      {/* FONDO DE RESPALDO */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#061638] via-[#01338C] to-[#04142D]" />

      {/* VIDEO DE YOUTUBE */}

      {!reducirMovimiento && (
        <iframe
          src={urlVideo}
          title="Video de fondo del Festival de Lotes"
          tabIndex={-1}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; encrypted-media; picture-in-picture"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[max(100svh,56.25vw)] w-[max(100vw,177.78svh)] -translate-x-1/2 -translate-y-1/2 scale-[1.12] border-0"
        />
      )}

      {/* OSCURECIMIENTO SUAVE Y UNIFORME */}

      <div className="absolute inset-0 bg-[#06142E]/45" />

      {/* DEGRADADO INFERIOR */}

      <div className="absolute inset-0 bg-gradient-to-b from-[#04112A]/25 via-transparent to-[#04112A]/60" />

      {/* ILUMINACIÓN ANIMADA */}

      <motion.div
        className="absolute -right-[20%] top-[10%] h-[75%] w-[65%] rounded-full bg-blue-400/10 blur-[110px]"
        animate={
          reducirMovimiento
            ? undefined
            : {
                x: [-30, 35, -30],
                y: [-20, 20, -20],
                opacity: [0.2, 0.5, 0.2],
              }
        }
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// ==================================================
// LOGO CASAGRANDE
// ==================================================

function LogoCasagrande() {
  const [disponible, setDisponible] =
    useState(true);

  return (
    <div className="flex items-center">
      {disponible ? (
        <div className="rounded-md bg-white/90 px-2.5 py-1.5 shadow-lg">
          <Image
            src={CONFIG.logo}
            alt="Casagrande Inmobiliaria"
            width={270}
            height={90}
            priority
            unoptimized
            onError={() => setDisponible(false)}
            className="h-auto max-h-[35px] w-auto max-w-[150px] object-contain sm:max-h-[42px] sm:max-w-[220px]"
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <strong className="text-[20px] leading-none font-black text-white">
            CASAGRANDE
          </strong>

          <span className="mt-1 text-[10px] font-bold tracking-[0.2em] text-[#FFB200]">
            INMOBILIARIA
          </span>
        </div>
      )}
    </div>
  );
}

// ==================================================
// INTRO CINEMATOGRÁFICA
// ==================================================

function IntroFestival({
  onClose,
}: {
  onClose: () => void;
}) {
  const reducirMovimiento =
    Boolean(useReducedMotion());

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Presentación Festival de Lotes"
      initial={{
        opacity: 1,
        clipPath: "inset(0 0 0% 0)",
      }}
      exit={
        reducirMovimiento
          ? { opacity: 0 }
          : {
              clipPath: "inset(0 0 100% 0)",
            }
      }
      transition={{
        duration: reducirMovimiento ? 0 : 0.85,
        ease: EASE,
      }}
      className="fixed inset-0 z-[99999] flex min-h-dvh items-center justify-center overflow-y-auto overflow-x-hidden bg-[#01338C] px-4 py-20 text-white sm:px-5"
    >
      {/* FONDO DE INTRO */}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#205CAB_0%,#01338C_50%,#031336_100%)]" />

      {/* CÍRCULOS ANIMADOS */}

      <motion.div
        className="pointer-events-none absolute aspect-square w-[min(90vw,760px)] rounded-full border border-white/10"
        animate={
          reducirMovimiento
            ? undefined
            : {
                scale: [0.9, 1.07, 0.9],
                opacity: [0.3, 0.8, 0.3],
              }
        }
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="pointer-events-none absolute aspect-square w-[min(65vw,520px)] rounded-full border border-[#FFB200]/20" />

      {/* CONTENIDO */}

      <div className="relative z-10 flex w-full max-w-[960px] flex-col items-center text-center">
        <motion.p
          initial={
            reducirMovimiento
              ? false
              : { opacity: 0, y: -25 }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mb-3 text-[9px] font-extrabold tracking-[0.12em] text-blue-100 sm:mb-7 sm:text-[13px] sm:tracking-[0.2em]"
        >
          CASAGRANDE INMOBILIARIA PRESENTA
        </motion.p>

        {/* SVG ORIGINAL */}

        <motion.div
          initial={
            reducirMovimiento
              ? false
              : {
                  opacity: 0,
                  y: 65,
                  scale: 0.75,
                  filter: "blur(12px)",
                }
          }
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 1.1,
            delay: reducirMovimiento ? 0 : 0.2,
            ease: EASE,
          }}
          className="flex w-full items-center justify-center"
        >
          <Image
            src={CONFIG.festivalSvg}
            alt="Festival de Lotes"
            width={1744}
            height={694}
            priority
            unoptimized
            className="h-auto w-full max-w-[870px] object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
          />
        </motion.div>

        {/* LÍNEA ANIMADA */}

        <motion.div
          initial={
            reducirMovimiento
              ? false
              : { scaleX: 0, opacity: 0 }
          }
          animate={{
            scaleX: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.65,
            delay: reducirMovimiento ? 0 : 1.1,
          }}
          className="mt-4 h-[2px] w-[min(340px,65vw)] origin-center bg-gradient-to-r from-transparent via-[#FFB200] to-transparent sm:mt-7"
        />

        {/* PROMOCIÓN */}

        <motion.div
          initial={
            reducirMovimiento
              ? false
              : { opacity: 0, y: 20 }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            delay: reducirMovimiento ? 0 : 1.4,
          }}
          className="mt-4 flex flex-col items-center justify-center gap-x-5 gap-y-1 text-[12px] font-black sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-y-2 sm:text-[22px]"
        >
          <span>PRECIOS QUE TE VAN A SORPRENDER</span>

          <span className="hidden h-7 w-px bg-white/30 sm:block" />

          <strong className="text-[#FFB200]">
            SOLO POR EL FESTIVAL
          </strong>
        </motion.div>

        <motion.p
          initial={
            reducirMovimiento
              ? false
              : { opacity: 0 }
          }
          animate={{ opacity: 1 }}
          transition={{
            delay: reducirMovimiento ? 0 : 1.8,
            duration: 0.6,
          }}
          className="mt-3 text-[10px] font-bold tracking-[0.08em] text-blue-100 sm:mt-5 sm:text-[14px] sm:tracking-[0.12em]"
        >
          DOMINGO 06 DE DICIEMBRE · 9:00 A. M. · AYACUCHO
        </motion.p>
      </div>

      {/* SALTAR INTRO */}

      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 bottom-4 z-20 flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-[12px] font-bold text-white transition hover:bg-white/20 sm:right-5 sm:bottom-6 sm:px-4 sm:py-3"
      >
        Ver invitación
        <ArrowRight size={17} />
      </button>

      {/* BARRA DE PROGRESO */}

      {!reducirMovimiento && (
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: CONFIG.duracionIntro / 1000,
            ease: "linear",
          }}
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-[#FFB200]"
        />
      )}
    </motion.div>
  );
}

// ==================================================
// CONTADOR REGRESIVO
// ==================================================

type Tiempo = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  finalizado: boolean;
};

function CuentaRegresiva() {
  const [tiempo, setTiempo] =
    useState<Tiempo | null>(null);

  useEffect(() => {
    const fecha = new Date(
      CONFIG.fechaEvento
    ).getTime();

    const actualizar = () => {
      const diferencia = Math.max(
        0,
        fecha - Date.now()
      );

      setTiempo({
        dias: Math.floor(
          diferencia / 86400000
        ),
        horas: Math.floor(
          (diferencia / 3600000) % 24
        ),
        minutos: Math.floor(
          (diferencia / 60000) % 60
        ),
        segundos: Math.floor(
          (diferencia / 1000) % 60
        ),
        finalizado: diferencia === 0,
      });
    };

    actualizar();

    const intervalo = window.setInterval(
      actualizar,
      1000
    );

    return () => {
      window.clearInterval(intervalo);
    };
  }, []);

  const formato = (valor?: number) =>
    valor === undefined
      ? "--"
      : String(valor).padStart(2, "0");

  const unidades = [
    {
      nombre: "Días",
      valor: formato(tiempo?.dias),
    },
    {
      nombre: "Horas",
      valor: formato(tiempo?.horas),
    },
    {
      nombre: "Minutos",
      valor: formato(tiempo?.minutos),
    },
    {
      nombre: "Segundos",
      valor: formato(tiempo?.segundos),
    },
  ];

  return (
    <div className="w-full">
      <div
        role="timer"
        aria-live="off"
        className="grid grid-cols-4 gap-0 rounded-lg border border-white/70 bg-black/10 px-1 py-3 backdrop-blur-[3px] sm:border-2 sm:px-3 sm:py-6"
      >
        {unidades.map((item, index) => (
          <div
            key={item.nombre}
            className={`flex min-w-0 flex-col items-center justify-center gap-1 sm:gap-2 ${
              index > 0
                ? "border-l border-white/20"
                : ""
            }`}
          >
            <strong className="text-[clamp(22px,6.6vw,49px)] leading-none font-black tracking-[-0.06em] text-white tabular-nums sm:text-[clamp(25px,4vw,49px)]">
              {item.valor}
            </strong>

            <span className="text-[9px] font-semibold text-white/85 sm:text-[12px]">
              {item.nombre}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-2 flex items-center justify-center gap-2 text-[9px] font-bold tracking-[0.06em] text-blue-100 sm:mt-3 sm:text-[10px]">
        <Clock3 size={14} className="text-[#FFB200]" />
        {tiempo?.finalizado
          ? "LA FECHA DEL FESTIVAL HA LLEGADO"
          : "FALTAN PARA EL 06 DE DICIEMBRE · 9:00 A. M."}
      </p>
    </div>
  );
}

// ==================================================
// PRECIO ANIMADO COMPACTO, SIN TARJETA NI FONDO
// ==================================================

type EtapaPrecio = "inicial" | "tachado" | "bajando" | "final";

function PrecioOferta({ activo }: { activo: boolean }) {
  const reducirMovimiento = Boolean(useReducedMotion());
  const [etapa, setEtapa] = useState<EtapaPrecio>("inicial");
  const [valor, setValor] = useState(CONFIG.precioInicial);

  useEffect(() => {
    // El precio se revela al terminar la intro. No se anima si el
    // usuario tiene activada la preferencia de reducir movimiento.
    if (!activo) return;
    if (reducirMovimiento) {
      setValor(CONFIG.precioDesde);
      setEtapa("final");
      return;
    }

    let control: { stop: () => void } | undefined;

    const tachar = window.setTimeout(() => {
      setEtapa("tachado");
    }, CONFIG.pausaPrecio);

    const bajar = window.setTimeout(() => {
      setEtapa("bajando");
      control = animate(CONFIG.precioInicial, CONFIG.precioDesde, {
        duration: CONFIG.duracionPrecio / 1000,
        ease: EASE_PRECIO,
        onUpdate: (numero) => setValor(Math.round(numero)),
        onComplete: () => {
          setValor(CONFIG.precioDesde);
          setEtapa("final");
        },
      });
    }, CONFIG.pausaPrecio + CONFIG.pausaTachado);

    return () => {
      window.clearTimeout(tachar);
      window.clearTimeout(bajar);
      control?.stop();
    };
  }, [activo, reducirMovimiento]);

  const terminado = etapa === "final";
  const tachando = etapa === "tachado";
  // El precio anterior queda visible, en pequeño y tachado,
  // desde que comienza a bajar el importe.
  const mostrarPrecioAnterior = etapa === "bajando" || terminado;

  return (
    // Mismo tamaño aproximado del precio original, sin contenedor.
    <div className="mt-5 flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:mt-6 sm:gap-x-5">
      <div className="flex items-baseline justify-center gap-1.5 sm:gap-2">
        <span className="whitespace-nowrap text-[10px] font-extrabold text-white/85 min-[375px]:text-[11px] sm:text-[12px]">
          LOTES DESDE
        </span>
        <span className="text-[17px] font-black text-white min-[375px]:text-[19px] sm:text-[21px]">
          S/
        </span>
        <motion.strong
          initial={false}
          animate={{
            color: terminado ? "#FFB200" : "#FFFFFF",
            scale: tachando ? 0.94 : terminado ? 1.045 : 1,
            y: tachando ? 2 : 0,
          }}
          transition={
            terminado && !reducirMovimiento
              ? { type: "spring", stiffness: 350, damping: 17 }
              : { duration: 0.35, ease: EASE }
          }
          className="relative inline-block whitespace-nowrap text-[clamp(31px,8.6vw,52px)] leading-none font-black tracking-[-0.06em] tabular-nums sm:text-[clamp(35px,5vw,52px)]"
        >
          {formatoPrecio(valor)}

          {/* Precio anterior pequeño, visible después de la rebaja.
              Va sobre los números, sin crear tarjeta ni aumentar el alto. */}
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={{
              opacity: mostrarPrecioAnterior ? 1 : 0,
              y: mostrarPrecioAnterior ? 0 : 5,
            }}
            transition={{ duration: reducirMovimiento ? 0 : 0.32, ease: EASE }}
            className="pointer-events-none absolute -top-[15px] right-0 flex items-center gap-1 whitespace-nowrap text-[9px] font-bold leading-none tracking-normal text-white/85 min-[375px]:-top-[17px] min-[375px]:text-[10px] sm:-top-[19px] sm:text-[11px]"
          >
            <span>ANTES</span>
            <span className="line-through decoration-[#FFB200] decoration-2">
              S/ {formatoPrecio(CONFIG.precioInicial)}
            </span>
          </motion.span>

          {/* Tachado dorado del precio original. Desaparece al bajar. */}
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={{
              scaleX: tachando ? 1 : 0,
              opacity: tachando ? 1 : 0,
            }}
            transition={{ duration: 0.48, ease: EASE }}
            className="pointer-events-none absolute -left-[5%] -right-[5%] top-[52%] h-[3px] origin-left -rotate-[5deg] rounded-full bg-[#FFB200] shadow-[0_0_12px_rgba(255,178,0,0.75)]"
          />

          {/* Destello final: no ocupa espacio en el diseño. */}
          <AnimatePresence>
            {terminado && !reducirMovimiento && (
              <motion.span
                key="precio-brillo"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.3, rotate: -25, y: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 12, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 15 }}
                className="pointer-events-none absolute -right-5 -top-4 text-[#FFD457] sm:-right-7"
              >
                <Sparkles size={19} strokeWidth={2.5} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.strong>
      </div>

      <span aria-hidden="true" className="hidden h-9 w-px bg-white/40 sm:block" />

      {/* Se reserva una altura mínima para evitar saltos de diseño. */}
      <div className="flex min-h-[36px] flex-col items-center justify-center sm:min-h-[41px] sm:items-start">
        <AnimatePresence mode="wait" initial={false}>
          {terminado ? (
            <motion.div
              key="precio-ahorro"
              initial={reducirMovimiento ? false : { opacity: 0, x: -8, scale: 0.88 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: reducirMovimiento ? 0 : 0.38, ease: EASE }}
              className="flex flex-col items-center leading-tight sm:items-start"
            >
              <strong className="whitespace-nowrap text-[17px] font-black text-[#FFB200] sm:text-[clamp(19px,3vw,27px)]">
                {DESCUENTO_PORCENTAJE}% OFF
              </strong>
              <span className="whitespace-nowrap text-[10px] font-extrabold tracking-[0.03em] text-white/90 sm:text-[11px]">
                AHORRA S/ {formatoPrecio(AHORRO)}
              </span>
            </motion.div>
          ) : (
            <motion.span
              key="precio-espera"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="whitespace-nowrap text-[11px] font-extrabold text-[#FFB200] sm:text-[14px]"
            >
              PRECIO FESTIVAL
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {terminado
          ? `Precio festival: ${formatoPrecio(CONFIG.precioDesde)} soles. Ahorra ${formatoPrecio(AHORRO)} soles.`
          : ""}
      </span>
    </div>
  );
}

// ==================================================
// COLUMNA IZQUIERDA
// ==================================================

function ColumnaIzquierda({
  animar,
}: {
  animar: boolean;
}) {
  const reducirMovimiento =
    Boolean(useReducedMotion());

  return (
    <div className="flex w-full flex-col items-center text-center">
      {/* ETIQUETA */}

      <motion.p
        initial={
          reducirMovimiento
            ? false
            : { opacity: 0, y: -15 }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
        className="mb-2 text-[11px] font-bold tracking-[0.11em] text-white/90 sm:mb-4 sm:text-[15px] sm:tracking-[0.13em]"
      >
        CASAGRANDE PRESENTA
      </motion.p>

      {/* SVG FESTIVAL */}

      <motion.div
        animate={
          reducirMovimiento
            ? undefined
            : {
                y: [0, -6, 0],
              }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-full max-w-[430px] sm:max-w-[520px]"
      >
        <Image
          src={CONFIG.festivalSvg}
          alt="Festival de Lotes"
          width={1744}
          height={694}
          priority
          unoptimized
          sizes="(max-width: 640px) calc(100vw - 32px), 520px"
          className="block h-auto w-full object-contain drop-shadow-[0_5px_12px_rgba(255,255,255,0.3)]"
        />
      </motion.div>

      {/* UBICACIÓN GENERAL */}

      <div className="mt-2 rounded-md bg-[#FFB200] px-4 py-1.5 text-[11px] font-black tracking-[0.07em] text-[#063277] sm:mt-4 sm:px-7 sm:py-2 sm:text-[16px] sm:tracking-[0.12em]">
        CCORIHUILLCA · AYACUCHO
      </div>

      {/* PRECIO SIN FONDO, CON ANIMACIÓN DE TACHADO Y BAJADA */}
      <PrecioOferta activo={animar} />
    </div>
  );
}

// ==================================================
// COLUMNA DERECHA
// ==================================================

function ColumnaDerecha({
  onVerProyecto,
}: {
  onVerProyecto: () => void;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center text-center sm:items-start sm:text-left">
      <h2 className="text-[clamp(23px,6vw,39px)] leading-tight font-black tracking-[-0.035em] text-white sm:text-[clamp(27px,4vw,39px)]">
        ¡No te lo pierdas!
      </h2>

      <div className="mt-1.5 flex items-start gap-2 text-left text-[14px] text-white sm:mt-2 sm:text-[19px]">
        <MapPin size={19} className="mt-0.5 shrink-0 text-[#FFB200] sm:size-[21px]" />
        <div>
          <span className="border-b border-white/70 pb-0.5 font-semibold sm:pb-1">
            Parque del Avión · ENACE
          </span>
          <p className="mt-1 text-[11px] text-blue-100 sm:mt-2 sm:text-[12px]">Ayacucho, Perú</p>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-[12px] font-bold text-[#FFDC87] sm:mt-4 sm:text-[13px]">
        <Clock3 size={16} aria-hidden="true" />
        Domingo 06 de diciembre · {CONFIG.horaEvento}
      </div>

      <div className="mt-4 w-full sm:mt-7">
        <CuentaRegresiva />
      </div>

      {/* Celular: CTA principal completo; ubicación y plano en la misma fila. */}
      <div className="mt-4 grid w-full grid-cols-2 gap-2 sm:mt-7 sm:gap-3">
        <a
          href={URL_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="group col-span-2 flex min-h-[48px] min-w-0 items-center justify-center gap-2 rounded-lg bg-[#FFB200] px-3 py-2.5 text-[12px] font-black text-[#05285E] shadow-[0_10px_24px_rgba(255,178,0,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#FFD04E] sm:col-span-1 sm:min-h-[52px] sm:text-[13px]"
        >
          <MessageCircle size={18} className="shrink-0" aria-hidden="true" />
          <span>Confirmar asistencia</span>
          <ArrowRight size={15} className="hidden shrink-0 transition-transform group-hover:translate-x-1 lg:block" aria-hidden="true" />
        </a>

        <a
          href={CONFIG.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[46px] min-w-0 items-center justify-center gap-1.5 rounded-lg border border-white/65 bg-white/10 px-2 py-2 text-[11px] font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-white/20 sm:min-h-[52px] sm:gap-2 sm:px-3 sm:text-[13px]"
        >
          <Navigation size={17} className="shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Cómo llegar</span>
          <ArrowUpRight size={14} className="hidden shrink-0 lg:block" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={onVerProyecto}
          aria-haspopup="dialog"
          className="flex min-h-[46px] min-w-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#FFB200]/70 bg-[#FFB200]/10 px-2 py-2 text-[11px] font-extrabold text-[#FFDC87] transition-all hover:-translate-y-0.5 hover:bg-[#FFB200]/20 sm:col-span-2 sm:min-h-[52px] sm:text-[13px]"
        >
          <Eye size={17} className="shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Ver proyecto</span>
        </button>
      </div>

      <p className="mt-2 text-[9px] leading-relaxed text-blue-100/80 sm:mt-4 sm:text-[10px]">
        Precio promocional sujeto a condiciones y disponibilidad.
      </p>
    </div>
  );
}

// ==================================================
// VENTANA "VER PROYECTO"
// ==================================================

function ModalProyecto({
  onClose,
}: {
  onClose: () => void;
}) {
  const reducirMovimiento =
    Boolean(useReducedMotion());

  const botonCerrar =
    useRef<HTMLButtonElement>(null);

  const [imagenDisponible, setImagenDisponible] =
    useState(true);

  // CERRAR CON ESCAPE
  useEffect(() => {
    const cerrar = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", cerrar);

    return () =>
      window.removeEventListener("keydown", cerrar);
  }, [onClose]);

  // BLOQUEO DE SCROLL Y MANEJO DEL FOCO
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previoHtml = html.style.overflow;
    const previoBody = body.style.overflow;
    const previoFoco =
      document.activeElement as HTMLElement | null;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    botonCerrar.current?.focus();

    return () => {
      html.style.overflow = previoHtml;
      body.style.overflow = previoBody;
      previoFoco?.focus();
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Proyecto de Casagrande Inmobiliaria"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: reducirMovimiento ? 0 : 0.3,
      }}
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020B1F]/90 p-2 backdrop-blur-sm sm:p-8"
    >
      {/* BOTÓN CERRAR */}

      <button
        ref={botonCerrar}
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#FFB200] text-[#05285E] shadow-lg transition hover:scale-110 sm:top-6 sm:right-6"
      >
        <X size={22} strokeWidth={3} />
      </button>

      {/* IMAGEN DEL PROYECTO */}

      <motion.div
        initial={
          reducirMovimiento
            ? false
            : { opacity: 0, y: 30, scale: 0.94 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={
          reducirMovimiento
            ? { opacity: 0 }
            : { opacity: 0, y: 20, scale: 0.96 }
        }
        transition={{
          duration: reducirMovimiento ? 0 : 0.45,
          ease: EASE,
        }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[1200px]"
      >
        {imagenDisponible ? (
          <Image
            src={CONFIG.imagenProyecto}
            alt="Proyecto de Casagrande Inmobiliaria"
            width={1600}
            height={1200}
            unoptimized
            onError={() => setImagenDisponible(false)}
            className="mx-auto h-auto max-h-[78dvh] w-auto max-w-full rounded-xl border border-white/20 object-contain shadow-2xl sm:max-h-[82svh]"
          />
        ) : (
          <p className="mx-auto w-fit max-w-full rounded-xl border border-white/20 bg-white/10 px-8 py-12 text-center text-[14px] font-bold text-white">
            La imagen del proyecto no está disponible por ahora.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ==================================================
// PÁGINA PRINCIPAL DEL FESTIVAL
// ==================================================

export default function FestivalClient() {
  const reducirMovimiento =
    Boolean(useReducedMotion());

  const [mostrarIntro, setMostrarIntro] =
    useState(true);

  const [mostrarProyecto, setMostrarProyecto] =
    useState(false);

  // CIERRE AUTOMÁTICO DE INTRO
  useEffect(() => {
    const timer = window.setTimeout(
      () => setMostrarIntro(false),
      reducirMovimiento
        ? 0
        : CONFIG.duracionIntro
    );

    return () => window.clearTimeout(timer);
  }, [reducirMovimiento]);

  // BLOQUEO DE SCROLL DURANTE INTRO
  useEffect(() => {
    if (!mostrarIntro) return;

    const html = document.documentElement;
    const body = document.body;

    const previoHtml = html.style.overflow;
    const previoBody = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previoHtml;
      body.style.overflow = previoBody;
    };
  }, [mostrarIntro]);

  // CERRAR INTRO CON ESCAPE
  useEffect(() => {
    const cerrar = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMostrarIntro(false);
      }
    };

    window.addEventListener("keydown", cerrar);

    return () =>
      window.removeEventListener("keydown", cerrar);
  }, []);

  return (
    <>
      <main
        id="festival-invitacion"
        className="relative isolate flex min-h-svh w-full flex-col overflow-hidden bg-[#061636] text-white"
      >
        {/* FRANJA AZUL SUPERIOR */}

        <div className="relative z-20 flex min-h-[58px] items-center justify-center bg-[#01338C] px-3 py-2 text-center shadow-[0_3px_18px_rgba(0,0,0,0.25)] sm:min-h-[56px] sm:px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
            <CalendarDays
              size={20}
              className="hidden text-[#FFB200] sm:block"
            />

            <span className="text-[12px] font-black tracking-[0.01em] text-white sm:text-[clamp(14px,2.2vw,24px)]">
              DOMINGO 06 DE DICIEMBRE DE 2026
            </span>
            <span className="whitespace-nowrap text-[12px] font-black text-[#FFCB42] sm:text-[15px]">
              9:00 A. M.
            </span>
          </div>
        </div>

        {/* ESCENARIO PRINCIPAL */}

        <div className="relative isolate flex min-h-[calc(100svh-58px)] flex-1 flex-col">
          {/* VIDEO */}

          <FondoYoutube />

          {/* CONTENEDOR DE CONTENIDO */}

          <div className="relative z-10 mx-auto flex w-full max-w-[1260px] flex-1 flex-col px-4 sm:px-8 lg:px-10">
            {/* LOGO EMPRESARIAL */}

            <header className="flex items-center justify-start pt-3 sm:pt-6 lg:pt-7">
              <LogoCasagrande />
            </header>

            {/* HERO DE DOS COLUMNAS */}

            <motion.section
              aria-label="Invitación al Festival de Lotes"
              initial={
                reducirMovimiento
                  ? false
                  : {
                      opacity: 0,
                      y: 35,
                    }
              }
              animate={
                mostrarIntro
                  ? {
                      opacity: 0,
                      y: 35,
                    }
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              transition={{
                duration: reducirMovimiento ? 0 : 0.9,
                ease: EASE,
              }}
              className="grid flex-1 grid-cols-1 items-center gap-5 py-6 sm:gap-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] lg:gap-10 lg:py-8"
            >
              {/* COLUMNA IZQUIERDA */}

              <motion.div
                initial={
                  reducirMovimiento
                    ? false
                    : { opacity: 0, x: -25 }
                }
                animate={
                  mostrarIntro
                    ? { opacity: 0, x: -25 }
                    : { opacity: 1, x: 0 }
                }
                transition={{
                  duration: reducirMovimiento ? 0 : 0.8,
                  delay: reducirMovimiento ? 0 : 0.1,
                  ease: EASE,
                }}
                className="flex min-w-0 items-center justify-center"
              >
                <ColumnaIzquierda animar={!mostrarIntro} />
              </motion.div>

              {/* LÍNEA DIVISORIA VERTICAL */}

              <div
                aria-hidden="true"
                className="hidden h-[390px] w-px bg-white/50 lg:block"
              />

              {/* COLUMNA DERECHA */}

              <motion.div
                initial={
                  reducirMovimiento
                    ? false
                    : { opacity: 0, x: 25 }
                }
                animate={
                  mostrarIntro
                    ? { opacity: 0, x: 25 }
                    : { opacity: 1, x: 0 }
                }
                transition={{
                  duration: reducirMovimiento ? 0 : 0.8,
                  delay: reducirMovimiento ? 0 : 0.25,
                  ease: EASE,
                }}
                className="min-w-0"
              >
                <ColumnaDerecha
                  onVerProyecto={() =>
                    setMostrarProyecto(true)
                  }
                />
              </motion.div>
            </motion.section>

            {/* PIE INFERIOR */}

            <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-white/15 py-3 text-center text-[9px] font-semibold text-white/70 sm:justify-between sm:gap-3 sm:py-4 sm:text-[10px]">
              <span>CASAGRANDE INMOBILIARIA</span>

              <span>FESTIVAL DE LOTES · AYACUCHO</span>
            </footer>
          </div>
        </div>
      </main>

      {/* INTRO DE LANZAMIENTO */}

      <AnimatePresence>
        {mostrarIntro && (
          <IntroFestival
            key="intro-festival"
            onClose={() => {
              setMostrarIntro(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* VENTANA DEL PROYECTO */}

      <AnimatePresence>
        {mostrarProyecto && (
          <ModalProyecto
            key="modal-proyecto"
            onClose={() => {
              setMostrarProyecto(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}