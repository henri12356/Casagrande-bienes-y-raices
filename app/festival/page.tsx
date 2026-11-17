
import type { Metadata } from "next";
import FestivalClient from "./festival-client";

const DOMINIO =
  "https://www.casagrande-inmobiliaria.com";

const URL_FESTIVAL = `${DOMINIO}/festival`;

const PORTADA = `${DOMINIO}/festival/festival.webp`;

// TÍTULO CORTO PARA WHATSAPP
const TITULO =
  "🎉 ¡Estás invitado al Festival de Lotes!";

// DESCRIPCIÓN CORTA PARA WHATSAPP
const DESCRIPCION =
  "🏡 Lotes desde S/ 14,000 y 15% de descuento. " +
  "📅 Domingo 6 de diciembre de 2026. " +
  "📍 Parque del Avión, ENACE, Ayacucho. " +
  "¡Confirma tu asistencia!";

export const metadata: Metadata = {
  metadataBase: new URL(DOMINIO),

  title: {
    absolute: TITULO,
  },

  description: DESCRIPCION,

  alternates: {
    canonical: URL_FESTIVAL,
  },

  openGraph: {
    type: "website",
    locale: "es_PE",
    url: URL_FESTIVAL,
    siteName: "Casagrande Inmobiliaria",
    title: TITULO,
    description: DESCRIPCION,

    images: [
      {
        url: PORTADA,
        alt: "Festival de Lotes",
        type: "image/webp",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
    images: [PORTADA],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function FestivalPage() {
  return <FestivalClient />;
}
