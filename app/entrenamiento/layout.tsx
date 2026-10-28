
import type { ReactNode } from "react";
import type { Metadata } from "next";

import {
  Barlow_Condensed,
  Manrope,
} from "next/font/google";

// ==========================================
// CONFIGURACIÓN DEL SITIO
// ==========================================

// Cambiar si el dominio público de tu landing
// es diferente al dominio de Casagrande.

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.casagrande-inmobiliaria.com";

// URL pública de la imagen que aparecerá
// cuando se comparta la página.
//
// Archivo físico:
// public/INVITACION.WEBP

const IMAGEN_COMPARTIR = "/INVITACION.WEBP";

// ==========================================
// INFORMACIÓN DEL EVENTO
// ==========================================

const TITULO =
  "MEGA ENTRENAMIENTO INMOBILIARIO | CIMENTA - AYACUCHO";

const DESCRIPCION =
  "🎓 CIMENTA presenta el Mega Entrenamiento Inmobiliario. 📅 Viernes 30 de octubre de 2026. 🕕 6:00 p. m. 📍 Hotel Santa Rosa, Ayacucho, Perú. Aprende, conecta y potencia tus habilidades comerciales. ¡Solicita tu inscripción!";

// ==========================================
// SEO Y METADATOS DE COMPARTIR
// ==========================================

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: TITULO,

  description: DESCRIPCION,

  applicationName: "CIMENTA",

  keywords: [
    "CIMENTA",
    "Mega Entrenamiento",
    "Mega Entrenamiento Inmobiliario",
    "Mega Entrenamiento Ayacucho",
    "Capacitación Inmobiliaria",
    "Formación Inmobiliaria",
    "Evento Inmobiliario Ayacucho",
    "Hotel Santa Rosa",
    "Ventas Inmobiliarias",
    "Ayacucho 2026",
  ],

  alternates: {
    canonical: "/entrenamiento",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ========================================
  // FACEBOOK, WHATSAPP Y MESSENGER
  // ========================================

  openGraph: {
    type: "website",

    locale: "es_PE",

    url: "/entrenamiento",

    siteName: "CIMENTA",

    title: TITULO,

    description: DESCRIPCION,

    images: [
      {
        url: IMAGEN_COMPARTIR,
        alt:
          "Invitación al Mega Entrenamiento Inmobiliario de CIMENTA, viernes 30 de octubre de 2026, Hotel Santa Rosa, Ayacucho.",
      },
    ],
  },

  // ========================================
  // TWITTER / X
  // ========================================

  twitter: {
    card: "summary_large_image",

    title: TITULO,

    description: DESCRIPCION,

    images: [IMAGEN_COMPARTIR],
  },

  // ========================================
  // INFORMACIÓN ADICIONAL
  // ========================================

  category: "Educación y capacitación inmobiliaria",

  other: {
    "event:start_time": "2026-10-30T18:00:00-05:00",
    "event:location": "Hotel Santa Rosa, Ayacucho, Perú",
  },
};

// ==========================================
// FUENTES EXCLUSIVAS DE CIMENTA
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
// LAYOUT PRINCIPAL DE ENTRENAMIENTO
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
             OCULTAR PUBLICIDAD DE CASAGRANDE
             SOLO EN /entrenamiento
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
             CONTENEDOR DE CIMENTA
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
