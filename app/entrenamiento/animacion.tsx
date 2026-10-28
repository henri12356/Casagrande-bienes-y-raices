
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  MapPin,
  ArrowUpRight,
  MessageCircle,
  Clock3,
} from "lucide-react";

import styles from "./entrenamiento.module.css";

// ==========================================
// CONFIGURACIÓN GENERAL
// ==========================================

// 4200 = 4.2 segundos antes de comenzar la salida
const DURACION_INTRO_MS = 4200;

// Transición de salida en segundos
const DURACION_SALIDA = 0.55;

// Viernes 30 de octubre, 6:00 p. m., hora de Perú
const FECHA_EVENTO = new Date(
  "2026-10-30T18:00:00-05:00"
).getTime();

// Google Maps - Hotel Santa Rosa
const UBICACION_MAPS =
  "https://maps.app.goo.gl/W2jsGFZtvhxM4gXq9";

// WhatsApp de inscripción
const NUMERO_WHATSAPP = "51917702692";

const MENSAJE_WHATSAPP =
  "Hola, deseo recibir información para inscribirme al Mega Entrenamiento Inmobiliario de CIMENTA, el viernes 30 de octubre en el Hotel Santa Rosa de Ayacucho.";

const URL_WHATSAPP =
  `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(MENSAJE_WHATSAPP)}`;

const ease = [0.22, 1, 0.36, 1] as const;

// ==========================================
// TIPOS
// ==========================================

type TiempoRestante = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  finalizado: boolean;
};

// ==========================================
// INTRO ANIMADA
// DISEÑO ANTERIOR + NUEVA TIPOGRAFÍA
// ==========================================

function Introduccion({
  reducido,
}: {
  reducido: boolean;
}) {
  return (
    <motion.div
      className={styles.intro}
      aria-hidden="true"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: reducido ? 1 : 1.035,
        filter: reducido ? "none" : "blur(5px)",
      }}
      transition={{
        duration: reducido ? 0 : DURACION_SALIDA,
        ease: "easeInOut",
      }}
    >
      {/* FONDO ORIGINAL */}

      <div
        className={styles.introFondo}
        aria-hidden="true"
      />

      <div className={styles.introContenido}>
        {/* MARCA */}

        <motion.p
          className={styles.introPresenta}
          initial={
            reducido
              ? false
              : {
                  opacity: 0,
                  y: -18,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          CIMENTA PRESENTA
        </motion.p>

        {/* MEGA ENTRENAMIENTO */}

        <div
          className={styles.introLogo}
          role="img"
          aria-label="Mega Entrenamiento Inmobiliario"
        >
          <motion.div
            className={styles.introPalabraMega}
            initial={
              reducido
                ? false
                : {
                    opacity: 0,
                    y: 80,
                    scale: 0.86,
                    filter: "blur(10px)",
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.9,
              delay: reducido ? 0 : 0.2,
              ease,
            }}
          >
            <span className={styles.introMega}>
              MEGA
            </span>
          </motion.div>

          <motion.div
            className={styles.introPalabraEntrenamiento}
            initial={
              reducido
                ? false
                : {
                    opacity: 0,
                    y: 55,
                    scale: 0.92,
                    filter: "blur(9px)",
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.85,
              delay: reducido ? 0 : 0.7,
              ease,
            }}
          >
            <span className={styles.introEntrenamiento}>
              ENTRENAMIENTO
            </span>
          </motion.div>
        </div>

        {/* INMOBILIARIO */}

        <motion.p
          className={styles.introInmobiliario}
          initial={
            reducido
              ? false
              : {
                  opacity: 0,
                  y: 22,
                  filter: "blur(7px)",
                }
          }
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.7,
            delay: reducido ? 0 : 1.3,
            ease,
          }}
        >
          INMOBILIARIO
        </motion.p>

        {/* LÍNEA NARANJA */}

        <motion.div
          className={styles.introLinea}
          initial={
            reducido
              ? false
              : {
                  opacity: 0,
                  scaleX: 0,
                }
          }
          animate={{
            opacity: 1,
            scaleX: 1,
          }}
          transition={{
            duration: 0.7,
            delay: reducido ? 0 : 1.8,
            ease,
          }}
          aria-hidden="true"
        />

        {/* AYACUCHO */}

        <motion.p
          className={styles.introCiudad}
          initial={
            reducido
              ? false
              : {
                  opacity: 0,
                  y: 23,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: reducido ? 0 : 2.05,
            ease,
          }}
        >
          AYACUCHO, PERÚ
        </motion.p>

        <motion.span
          className={styles.introAnio}
          initial={
            reducido
              ? false
              : { opacity: 0 }
          }
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: reducido ? 0 : 2.4,
          }}
        >
          2026
        </motion.span>
      </div>
    </motion.div>
  );
}

// ==========================================
// CONTADOR DE EVENTO
// ==========================================

function ContadorEvento() {
  const [tiempo, setTiempo] =
    useState<TiempoRestante | null>(null);

  useEffect(() => {
    const actualizar = () => {
      const diferencia = Math.max(
        0,
        FECHA_EVENTO - Date.now()
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

  const formato = (valor?: number) => {
    if (valor === undefined) {
      return "--";
    }

    return String(valor).padStart(2, "0");
  };

  const unidades = [
    {
      nombre: "DÍAS",
      valor: formato(tiempo?.dias),
    },
    {
      nombre: "HORAS",
      valor: formato(tiempo?.horas),
    },
    {
      nombre: "MIN",
      valor: formato(tiempo?.minutos),
    },
    {
      nombre: "SEG",
      valor: formato(tiempo?.segundos),
    },
  ];

  return (
    <div className={styles.contador}>
      <div className={styles.contadorCabecera}>
        <Clock3 size={14} />

        <span>
          {tiempo?.finalizado
            ? "LA FECHA DEL EVENTO HA LLEGADO"
            : "EL EVENTO COMIENZA EN"}
        </span>
      </div>

      <div
        className={styles.contadorUnidades}
        role="timer"
        aria-live="off"
        aria-label="Cuenta regresiva del Mega Entrenamiento"
      >
        {unidades.map((unidad, indice) => (
          <div
            key={unidad.nombre}
            className={styles.contadorGrupo}
          >
            {indice > 0 && (
              <span
                className={styles.contadorSeparador}
                aria-hidden="true"
              >
                :
              </span>
            )}

            <div className={styles.contadorUnidad}>
              <span className={styles.contadorNumero}>
                {unidad.valor}
              </span>

              <span className={styles.contadorEtiqueta}>
                {unidad.nombre}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// HERO PRINCIPAL RESTAURADO
// ==========================================

function HeroPrincipal({
  visible,
  reducido,
}: {
  visible: boolean;
  reducido: boolean;
}) {
  return (
    <section
      className={styles.hero}
      aria-labelledby="titulo-mega-entrenamiento"
      id="inicio"
    >
      <div
        className={styles.heroFondo}
        aria-hidden="true"
      />

      <motion.div
        className={styles.heroContenedor}
        initial={
          reducido
            ? false
            : {
                opacity: 0,
                y: 32,
                filter: "blur(8px)",
              }
        }
        animate={
          visible
            ? {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }
            : {
                opacity: 0,
                y: 32,
                filter: "blur(8px)",
              }
        }
        transition={{
          duration: reducido ? 0 : 0.85,
          ease,
        }}
      >
        {/* COLUMNA IZQUIERDA */}

        <div className={styles.heroContenido}>
          <div className={styles.heroPresenta}>
            <span className={styles.heroIndicador} />

            CIMENTA PRESENTA · 2026
          </div>

          {/* NUEVA TIPOGRAFÍA SIN RELIEVE */}

          <h1
            id="titulo-mega-entrenamiento"
            className={styles.heroTitulo}
            aria-label="Mega Entrenamiento Inmobiliario"
          >
            <span className={styles.heroMega}>
              MEGA
            </span>

            <span className={styles.heroEntrenamiento}>
              ENTRENAMIENTO
            </span>
          </h1>

          {/* CIUDAD */}

          <p className={styles.heroCiudad}>
            AYACUCHO, PERÚ
          </p>

          <div
            className={styles.heroLinea}
            aria-hidden="true"
          />

          {/* FECHA Y LUGAR */}

          <div className={styles.heroDatos}>
            <time
              className={styles.heroFecha}
              dateTime="2026-10-30"
            >
              <span className={styles.heroDia}>
                30
              </span>

              <span className={styles.heroMes}>
                <strong>OCT</strong>
                <small>2026</small>
              </span>
            </time>

            <span
              className={styles.heroDivisor}
              aria-hidden="true"
            />

            <div className={styles.heroLugar}>
              <span className={styles.heroDatoEtiqueta}>
                LUGAR DEL EVENTO
              </span>

              <strong>
                Hotel Santa Rosa
              </strong>

              <span className={styles.heroHora}>
                Viernes · 6:00 p. m.
              </span>

              <a
                href={UBICACION_MAPS}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.heroMapa}
                aria-label="Cómo llegar al Hotel Santa Rosa en Google Maps"
              >
                <MapPin size={15} />

                Cómo llegar

                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          {/* CUENTA REGRESIVA ORIGINAL */}

          <ContadorEvento />

          {/* BOTÓN WHATSAPP */}

          <div className={styles.heroAcciones}>
            <a
              href={URL_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroWhatsapp}
            >
              <MessageCircle
                size={18}
                strokeWidth={2}
              />

              Quiero inscribirme

              <ArrowUpRight
                size={17}
                strokeWidth={2}
              />
            </a>
          </div>
        </div>

        {/* COLUMNA DERECHA:
            CÍRCULO ORIGINAL */}

        <div
          className={styles.heroDecoracion}
          aria-hidden="true"
        >
          <div className={styles.heroCirculo}>
            <span>30</span>
          </div>

          <div className={styles.heroDecoracionTexto}>
            <span>OCTUBRE</span>
            <span>2026</span>
          </div>
        </div>
      </motion.div>

      <span
        className={styles.heroLineaInferior}
        aria-hidden="true"
      />
    </section>
  );
}

// ==========================================
// LANDING COMPLETA
// ==========================================

export default function AnimacionEntrenamiento({
  children,
}: {
  children: ReactNode;
}) {
  const reducido = Boolean(useReducedMotion());

  const [mostrarIntro, setMostrarIntro] =
    useState(true);

  // CERRAR INTRO AUTOMÁTICAMENTE

  useEffect(() => {
    const temporizador = window.setTimeout(() => {
      setMostrarIntro(false);
    }, reducido ? 0 : DURACION_INTRO_MS);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [reducido]);

  // BLOQUEAR SCROLL MIENTRAS APARECE LA INTRO

  useEffect(() => {
    if (!mostrarIntro) {
      return;
    }

    const html = document.documentElement;
    const body = document.body;

    const anteriorHtml = html.style.overflow;
    const anteriorBody = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = anteriorHtml;
      body.style.overflow = anteriorBody;
    };
  }, [mostrarIntro]);

  return (
    <main
      className={styles.pagina}
      data-cimenta-entrenamiento
    >
      <HeroPrincipal
        visible={!mostrarIntro}
        reducido={reducido}
      />

      {/* TEMARIO, MOSAICO, EXPOSITOR Y CIERRE */}

      {children}

      {/* INTRO ANIMADA */}

      <AnimatePresence>
        {mostrarIntro && (
          <Introduccion
            key="intro-cimenta"
            reducido={reducido}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
