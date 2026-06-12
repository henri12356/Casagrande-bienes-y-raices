// app/concurso-dia-padre/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * SEO – Página Concurso Día del Padre
 * Empresa: Casagrande Bienes y Raíces
 * IMPORTANTE:
 * - NO incluir GoogleAnalytics aquí.
 * - GoogleAnalytics debe ir solo en app/layout.tsx.
 */

const SITE_URL = "https://www.casagrande-inmobiliaria.com";
const PAGE_PATH = "/concurso";
const CANONICAL = `${SITE_URL}${PAGE_PATH}`;

const BRAND_NAME = "Casagrande Bienes y Raíces";
const ALT_BRAND = "Casagrande Inmobiliaria Ayacucho";

const PHONE = "+51916194372";
const EMAIL = "u19217724@gmail.com";

// Imagen ubicada en /public/hero06.webp
const OG_IMAGE = `${SITE_URL}/hero06.webp`;

export const metadata: Metadata = {
  title: "Concurso Día del Padre | Bases Oficiales – Casagrande Bienes y Raíces",
  description:
    "Consulta las bases oficiales del concurso por el Día del Padre “¡Foto con Papá!” organizado por Casagrande Bienes y Raíces en Ayacucho.",

  keywords: [
    "concurso día del padre",
    "foto con papá",
    "concurso casagrande",
    "casagrande bienes y raíces",
    "casagrande inmobiliaria ayacucho",
    "concurso inmobiliaria ayacucho",
    "bases concurso día del padre",
    "sorteo día del padre ayacucho",
  ],

  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,

  alternates: {
    canonical: CANONICAL,
    languages: {
      "es-PE": CANONICAL,
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Concurso Día del Padre | “¡Foto con Papá!”",
    description:
      "Revisa las bases oficiales del concurso por el Día del Padre organizado por Casagrande Bienes y Raíces.",
    type: "website",
    url: CANONICAL,
    siteName: BRAND_NAME,
    locale: "es_PE",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Concurso Día del Padre - Casagrande Bienes y Raíces",
      },
    ],
    emails: [EMAIL],
    phoneNumbers: [PHONE],
  },

  twitter: {
    card: "summary_large_image",
    title: "Concurso Día del Padre | Casagrande Bienes y Raíces",
    description:
      "Bases oficiales del concurso “¡Foto con Papá!” por el Día del Padre.",
    images: [OG_IMAGE],
  },

  category: "Real Estate",
  classification: "Concurso promocional – Casagrande Bienes y Raíces",
};

function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export default function ConcursoDiaPadreLayout({
  children,
}: {
  children: ReactNode;
}) {
  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${CANONICAL}#webpage`,
    name: "Concurso Día del Padre | Bases Oficiales",
    description:
      "Página oficial de bases del concurso por el Día del Padre “¡Foto con Papá!” organizado por Casagrande Bienes y Raíces.",
    url: CANONICAL,
    inLanguage: "es-PE",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: OG_IMAGE,
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: BRAND_NAME,
    },
    publisher: {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}#organization`,
      name: BRAND_NAME,
      alternateName: ALT_BRAND,
      url: SITE_URL,
      telephone: PHONE,
      email: EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jirón Quinua 570",
        addressLocality: "Huamanga",
        addressRegion: "Ayacucho",
        addressCountry: "PE",
      },
      areaServed: [
        {
          "@type": "AdministrativeArea",
          name: "Ayacucho",
        },
        {
          "@type": "City",
          name: "Huamanga",
        },
      ],
      sameAs: [
        "https://www.facebook.com/profile.php?id=61584966996472",
        "https://www.instagram.com/henriinmobiliaria/",
        "https://www.tiktok.com/@henriinmobiliaria",
      ],
    },
  };

  const schemaContest = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${CANONICAL}#contest`,
    name: "Concurso “¡Foto con Papá!”",
    alternateName: "Concurso Día del Padre Casagrande",
    description:
      "Concurso fotográfico por el Día del Padre organizado por Casagrande Bienes y Raíces.",
    image: OG_IMAGE,
    url: CANONICAL,
    inLanguage: "es-PE",
    genre: "Concurso fotográfico",
    about: [
      "Día del Padre",
      "Fotografía familiar",
      "Concurso promocional",
      "Casagrande Bienes y Raíces",
    ],
    publisher: {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}#organization`,
      name: BRAND_NAME,
      url: SITE_URL,
      telephone: PHONE,
      email: EMAIL,
    },
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: BRAND_NAME,
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Concurso Día del Padre",
        item: CANONICAL,
      },
    ],
  };

  return (
    <>
      {children}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaWebPage)),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaContest)),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaBreadcrumb)),
        }}
      />
    </>
  );
}