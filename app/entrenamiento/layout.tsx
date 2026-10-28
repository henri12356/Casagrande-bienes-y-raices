
import type { ReactNode } from "react";

import {
  Barlow_Condensed,
  Manrope,
} from "next/font/google";

// ==========================================
// FUENTES DE CIMENTA
// ==========================================

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
  variable: "--cimenta-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--cimenta-body",
});

// ==========================================
// LAYOUT EXCLUSIVO DE ENTRENAMIENTO
// ==========================================

export default function EntrenamientoLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div
      id="cimenta-entrenamiento"
      className={`${barlow.variable} ${manrope.variable}`}
      style={{
        width: "100%",
        minHeight: "100svh",
        margin: 0,
        padding: 0,
        background: "#000523",
      }}
    >
      <style>
        {`
          /* ==================================
             OCULTAR POPUP DE CASAGRANDE
             EN LA PÁGINA DE ENTRENAMIENTO
             ================================== */

          body:has(#cimenta-entrenamiento)
          section[role="dialog"][aria-label^="Gran Tour Inmobiliario"],
          body:has(#cimenta-entrenamiento)
          [data-lanzamiento-popup] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }

          /* ==================================
             CONTENEDOR INDEPENDIENTE
             ================================== */

          #cimenta-entrenamiento {
            position: relative;
            isolation: isolate;
            width: 100%;
            min-height: 100svh;
            margin: 0;
            padding: 0;
            background: #000523;
          }
        `}
      </style>

      {children}
    </div>
  );
}
