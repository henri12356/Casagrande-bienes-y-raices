"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";
import styles from "./festival.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

type LanzamientoPopupProps = {
  /** Se ejecuta al cerrar: botón X, CTA principal, Escape o clic fuera. */
  onClose: () => void;
  ariaLabel?: string;
  eyebrow?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  priceFrom?: string;
  discount?: string;
  eventDate?: string;
  eventLocation?: string;
  ctaLabel?: string;
};

const contenidoVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.25 },
  },
};

const insigniaVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

const logoReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.8,
    rotateX: -10,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

const lineReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

const ofertaVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: EASE },
  },
};

const fechaVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

/**
 * Presentación del Festival de Lotes.
 * CAMBIO: el fondo completo ahora es MUY claro (casi blanco) para
 * maximizar el contraste con el logo oscuro (azul marino + dorado).
 * El SVG /FESTIVALLOTES.svg conserva sus colores originales.
 * No requiere modificar festival.module.css.
 */
export default function LanzamientoPopup({
  onClose,
  ariaLabel = "Presentación del Festival de Lotes",
  eyebrow = "CASAGRANDE INMOBILIARIA PRESENTA",
  logoSrc = "/FESTIVALLOTES.svg",
  logoAlt = "Festival de Lotes",
  logoWidth = 1744,
  logoHeight = 694,
  priceFrom = "DESDE S/ 12,500",
  discount = "AHORRA S/ 7,500",
  eventDate = "DOMINGO 06 DE DICIEMBRE",
  eventLocation = "AYACUCHO",
  ctaLabel = "Ver invitación",
}: LanzamientoPopupProps) {
  const reducirMovimiento = Boolean(useReducedMotion());
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = overflowPrevio;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      ref={dialogRef}
      tabIndex={-1}
      className={styles.intro}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reducirMovimiento ? 1 : 1.04 }}
      transition={{ duration: reducirMovimiento ? 0 : 0.5, ease: "easeInOut" }}
      style={{
        background: "#F6F9FF",
        isolation: "isolate",
      }}
    >
      {/*
        CAMBIO PRINCIPAL: fondo CLARO de PANTALLA COMPLETA.
        No usamos styles.introFondo porque esa clase contiene el fondo azul.
        Esta capa también permite cerrar al hacer clic fuera del contenido.
        Gradiente muy claro y uniforme para máximo contraste con el logo oscuro.
      */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse at 50% 40%, #FFFFFF 0%, #FDFEFF 45%, #F6F9FF 75%, #EEF4FC 100%)",
        }}
      />

      {/* Detalles decorativos tenues, siempre detrás del SVG. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(88vw,780px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ zIndex: 2, border: "1px solid rgba(10,59,135,0.07)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(65vw,570px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ zIndex: 2, border: "1px solid rgba(230,153,0,0.10)" }}
      />

      {/* BOTÓN CERRAR: fondo azul para mantener contraste sobre el fondo claro. */}
      <button
        type="button"
        className={styles.introCerrar}
        onClick={onClose}
        aria-label="Cerrar"
        style={{
          zIndex: 30,
          color: "#FFFFFF",
          background: "#072F74",
          border: "1px solid rgba(7,47,116,0.20)",
          boxShadow: "0 6px 18px rgba(7,47,116,0.18)",
        }}
      >
        <X size={18} strokeWidth={2.5} aria-hidden="true" />
      </button>

      <div className="relative z-10 flex w-full max-w-[1000px] flex-col items-center px-4 py-8">
        <motion.div
          className={styles.introContenido}
          variants={contenidoVariants}
          initial={reducirMovimiento ? "visible" : "hidden"}
          animate="visible"
        >
          {/* PRESENTACIÓN */}
          <motion.div
            className={styles.introInsignia}
            variants={insigniaVariants}
            style={{ color: "#0A3375" }}
          >
            <Sparkles
              size={13}
              aria-hidden="true"
              style={{ color: "#B87300" }}
            />
            <p className={styles.introPresenta} style={{ color: "#0A3375" }}>
              {eyebrow}
            </p>
          </motion.div>

          {/* LOGO SVG ORIGINAL: SIN TARJETA NI RECUADRO. */}
          <motion.div
            variants={logoReveal}
            className="relative mx-auto flex w-full max-w-[940px] items-center justify-center"
          >
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              priority
              unoptimized
              sizes="(max-width: 600px) 94vw, 900px"
              className={styles.introLogo}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                objectFit: "contain",
                opacity: 1,
                mixBlendMode: "normal",
                // Sombra azul más definida para separar el logo del fondo claro.
                filter:
                  "drop-shadow(0 4px 3px rgba(6,38,96,0.45)) drop-shadow(0 14px 24px rgba(6,38,96,0.18))",
              }}
            />
          </motion.div>

          {/* DIVISOR DORADO */}
          <motion.div
            className={styles.introLinea}
            variants={lineReveal}
            style={{
              background: "linear-gradient(90deg, transparent, #E5A400, transparent)",
            }}
          />

          {/* OFERTA: el texto ahora es oscuro para leerse sobre el fondo claro. */}
          <motion.div
            className={styles.introOferta}
            variants={ofertaVariants}
            style={{ color: "#092B68" }}
          >
            <span className={styles.ofertaPrecio} style={{ color: "#092B68" }}>
              {priceFrom}
            </span>
            <strong className={styles.ofertaDescuento} style={{ color: "#9B5700" }}>
              {discount}
            </strong>
          </motion.div>

          <motion.p
            className={styles.introFecha}
            variants={fechaVariants}
            style={{ color: "#173C74" }}
          >
            {eventDate} · {eventLocation}
          </motion.p>
        </motion.div>
      </div>

      {/* BOTÓN CONTRASTANTE */}
      <motion.button
        type="button"
        className={styles.introSaltar}
        onClick={onClose}
        initial={reducirMovimiento ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: reducirMovimiento ? 0 : 1.3, ease: EASE }}
        style={{
          zIndex: 30,
          color: "#FFFFFF",
          background: "#07357E",
          border: "1px solid #07357E",
          boxShadow: "0 8px 22px rgba(7,53,126,0.18)",
        }}
      >
        {ctaLabel}
        <ArrowRight size={17} className={styles.iconoFlecha} aria-hidden="true" />
      </motion.button>
    </motion.div>
  );
}