
import type { Metadata } from "next";

import AnimacionEntrenamiento from "./animacion";
import Temario from "./temario";
import Mosaico from "./mosaico";
import Expositor from "./expositor";
import Cierre from "./cierre";

// ==========================================
// CONFIGURACIÓN PÚBLICA
// ==========================================

const DOMINIO =
  "https://www.casagrande-inmobiliaria.com";

const URL_PAGINA =
  `${DOMINIO}/entrenamiento`;

// Imagen horizontal JPG: 1200 x 630 px
// Archivo: public/cimenta-compartir-v3.jpg

const IMAGEN_COMPARTIR =
  `${DOMINIO}/INVITACION.webp`;

// ==========================================
// INFORMACIÓN DEL EVENTO
// ==========================================

const TITULO =
  "MEGA ENTRENAMIENTO INMOBILIARIO | CIMENTA - AYACUCHO";

const DESCRIPCION =
  "CIMENTA presenta el Mega Entrenamiento Inmobiliario en Ayacucho. Viernes 30 de octubre de 2026 a las 6:00 p. m. en el Hotel Santa Rosa. Aprende, conecta y potencia tus habilidades comerciales. ¡Solicita tu inscripción!";

// ==========================================
// METADATOS PARA COMPARTIR Y SEO
// ==========================================

export const metadata: Metadata = {
  metadataBase: new URL(DOMINIO),

  // EVITAR AGREGAR EL TÍTULO DE CASAGRANDE
  title: {
    absolute: TITULO,
  },

  description: DESCRIPCION,

  applicationName: "CIMENTA",

  keywords: [
    "CIMENTA",
    "Mega Entrenamiento Inmobiliario",
    "Mega Entrenamiento Ayacucho",
    "Capacitación Inmobiliaria",
    "Entrenamiento de Ventas",
    "Formación Inmobiliaria",
    "Evento Inmobiliario Ayacucho",
    "Hotel Santa Rosa",
    "Ayacucho 2026",
  ],

  alternates: {
    canonical: URL_PAGINA,
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
  // WHATSAPP, FACEBOOK Y MESSENGER
  // ========================================

  openGraph: {
    type: "website",

    locale: "es_PE",

    url: URL_PAGINA,

    siteName: "CIMENTA",

    title: TITULO,

    description: DESCRIPCION,

    images: [
      {
        url: IMAGEN_COMPARTIR,

        secureUrl: IMAGEN_COMPARTIR,

        width: 1200,

        height: 630,

        type: "image/jpeg",

        alt:
          "Mega Entrenamiento Inmobiliario CIMENTA en Ayacucho. Viernes 30 de octubre de 2026 a las 6:00 p. m.",
      },
    ],
  },

  // ========================================
  // X / TWITTER
  // ========================================

  twitter: {
    card: "summary_large_image",

    title: TITULO,

    description: DESCRIPCION,

    images: [
      {
        url: IMAGEN_COMPARTIR,
        alt:
          "Invitación al Mega Entrenamiento Inmobiliario de CIMENTA.",
      },
    ],
  },

  // ========================================
  // INFORMACIÓN ADICIONAL
  // ========================================

  category: "Formación y capacitación inmobiliaria",

  other: {
    "event:start_time":
      "2026-10-30T18:00:00-05:00",

    "event:location":
      "Hotel Santa Rosa, Ayacucho, Perú",
  },
};

// ==========================================
// LANDING DE CIMENTA
// ==========================================

export default function EntrenamientoPage() {
  return (
    <AnimacionEntrenamiento>
      <Temario />
      <Mosaico />
      <Expositor />
      <Cierre />
    </AnimacionEntrenamiento>
  );
}
