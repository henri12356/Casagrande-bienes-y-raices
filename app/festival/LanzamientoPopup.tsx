"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";
import styles from "./festival.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

type LanzamientoPopupProps = {
  /** Se ejecuta al cerrar: botón "X", el CTA principal, Escape o click fuera de la tarjeta. */
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

/* ───────── Variants de animación ─────────
   Todo el tiempo de entrada vive acá: un único "reveal" escalonado
   (stagger) en vez de delays sueltos repetidos por elemento. */

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
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

/**
 * Popup de lanzamiento a pantalla completa.
 *
 * Se cierra con el botón "X", el CTA principal, la tecla Escape o un
 * click fuera de la tarjeta. Todo el contenido (textos, oferta, fecha,
 * logo) se recibe por props con los valores actuales como default, para
 * poder reutilizar este mismo componente en los próximos lanzamientos
 * sin tocar animaciones ni lógica.
 */
export default function LanzamientoPopup({
  onClose,
  ariaLabel = "Presentación del Festival de Lotes",
  eyebrow = "CASAGRANDE INMOBILIARIA PRESENTA",
  logoSrc = "/FESTIVALLOTES.svg",
  logoAlt = "Festival de Lotes",
  logoWidth = 1744,
  logoHeight = 694,
  priceFrom = "DESDE S/ 14,000",
  discount = "15% DE DESCUENTO",
  eventDate = "DOMINGO 06 DE DICIEMBRE",
  eventLocation = "AYACUCHO",
  ctaLabel = "Ver invitación",
}: LanzamientoPopupProps) {
  const reducirMovimiento = Boolean(useReducedMotion());
  const dialogRef = useRef<HTMLDivElement>(null);

  // Bloquea el scroll del fondo y lleva el foco al diálogo al abrir.
  useEffect(() => {
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = overflowPrevio;
    };
  }, []);

  // Permite cerrar con Escape.
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
    >
      {/* FONDO — también funciona como área para cerrar al hacer click afuera */}
      <div className={styles.introFondo} aria-hidden="true" onClick={onClose} />

      {/* BOTÓN CERRAR */}
      <button
        type="button"
        className={styles.introCerrar}
        onClick={onClose}
        aria-label="Cerrar"
      >
        <X size={18} strokeWidth={2.5} aria-hidden="true" />
      </button>

      {/* TARJETA DE CONTENIDO */}
      <div className="relative z-10 flex w-full max-w-[1000px] flex-col items-center px-4 py-8">
        <motion.div
          className={styles.introContenido}
          variants={contenidoVariants}
          initial={reducirMovimiento ? "visible" : "hidden"}
          animate="visible"
        >
          {/* INSIGNIA */}
          <motion.div className={styles.introInsignia} variants={insigniaVariants}>
            <Sparkles size={13} className={styles.iconoAcento} aria-hidden="true" />
            <p className={styles.introPresenta}>{eyebrow}</p>
          </motion.div>

          {/* LOGO */}
          <motion.div className={styles.introLogoContenedor} variants={logoReveal}>
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              priority
              unoptimized
              sizes="(max-width: 600px) 94vw, 900px"
              className={styles.introLogo}
            />
          </motion.div>

          {/* LÍNEA DIVISORIA */}
          <motion.div className={styles.introLinea} variants={lineReveal} />

          {/* OFERTA */}
          <motion.div className={styles.introOferta} variants={ofertaVariants}>
            <span className={styles.ofertaPrecio}>{priceFrom}</span>
            <strong className={styles.ofertaDescuento}>{discount}</strong>
          </motion.div>

          {/* FECHA */}
          <motion.p className={styles.introFecha} variants={fechaVariants}>
            {eventDate} · {eventLocation}
          </motion.p>
        </motion.div>
      </div>

      {/* CTA PRINCIPAL */}
      <motion.button
        type="button"
        className={styles.introSaltar}
        onClick={onClose}
        initial={reducirMovimiento ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: reducirMovimiento ? 0 : 1.3, ease: EASE }}
      >
        {ctaLabel}
        <ArrowRight size={17} className={styles.iconoFlecha} aria-hidden="true" />
      </motion.button>
    </motion.div>
  );
}