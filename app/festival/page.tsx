
import type { Metadata } from "next";
import FestivalClient from "./festival-client";

// ==========================================
// CONFIGURACIÓN PARA COMPARTIR
// ==========================================

const DOMINIO =
  "https://www.casagrande-inmobiliaria.com";

const URL_FESTIVAL = `${DOMINIO}/festival`;

const IMAGEN_PORTADA =
  `${DOMINIO}/festival.webp`;

// TÍTULO QUE VERÁ EL CLIENTE EN WHATSAPP
const TITULO =
  "🎉 ¡Estás invitado al Festival de Lotes! | Casagrande Inmobiliaria";

// DESCRIPCIÓN DE LA INVITACIÓN
const DESCRIPCION =
  "🏡 ¡Conoce nuestros lotes en Ccorihuillca! " +
  "📅 Domingo 6 de diciembre de 2026. " +
  "📍 Parque del Avión, ENACE, Ayacucho. " +
  "💰 Lotes desde S/ 14,000 y promoción especial del 15% de descuento. " +
  "¡Confirma tu asistencia! Consulta condiciones y disponibilidad.";

// ==========================================
// METADATOS SEO Y REDES SOCIALES
// ==========================================

export const metadata: Metadata = {
  metadataBase: new URL(DOMINIO),

  title: {
    absolute: TITULO,
  },

  description: DESCRIPCION,

  applicationName: "Casagrande Inmobiliaria",

  keywords: [
    "Festival de Lotes",
    "Festival de Lotes Ayacucho",
    "Casagrande Inmobiliaria",
    "Terrenos en Ayacucho",
    "Lotes en Ccorihuillca",
    "Terrenos desde 14000 soles",
    "Festival inmobiliario",
    "Inversión inmobiliaria Ayacucho",
  ],

  alternates: {
    canonical: URL_FESTIVAL,
  },

  // ========================================
  // WHATSAPP, FACEBOOK Y OTRAS REDES
  // ========================================

  openGraph: {
    type: "website",

    locale: "es_PE",

    url: URL_FESTIVAL,

    siteName: "Casagrande Inmobiliaria",

    title: TITULO,

    description: DESCRIPCION,

    images: [
      {
        url: IMAGEN_PORTADA,
        width: 1200,
        height: 630,
        alt:
          "Invitación al Festival de Lotes de Casagrande Inmobiliaria en Ayacucho",
        type: "image/webp",
      },
    ],
  },

  // ========================================
  // VISTA PREVIA DE X / TWITTER
  // ========================================

  twitter: {
    card: "summary_large_image",

    title: TITULO,

    description: DESCRIPCION,

    images: [IMAGEN_PORTADA],
  },

  // ========================================
  // INDEXACIÓN
  // ========================================

  robots: {
    index: true,
    follow: true,
  },
};

// ==========================================
// PÁGINA DEL FESTIVAL
// ==========================================

export default function FestivalPage() {
  return <FestivalClient />;
}
