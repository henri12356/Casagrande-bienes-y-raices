// app/propiedades/layout.tsx
import type { Metadata } from "next";

/**
 * ✅ IMPORTANTE
 * - NO pongas GoogleAnalytics aquí si ya lo tienes en app/layout.tsx
 * - Este layout solo debe encargarse del SEO de /propiedades
 */

const SITE_URL = "https://www.casagrande-inmobilaria.com"; // ✅ tu dominio real
const CATALOG_PATH = "/propiedades";
const CANONICAL = `${SITE_URL}${CATALOG_PATH}`;

const BRAND_NAME = "Casagrande Bienes y Raíces"; // ✅ marca real
const ALT_BRAND = "Casagrande Inmobiliaria Ayacucho";
const WHATSAPP = "+51916194372";
const EMAIL = "u19217724@gmail.com";

// ✅ crea esta imagen en /public/og-propiedades.jpg (1200x630)
const OG_IMAGE = `${SITE_URL}/og-propiedades.jpg`;

export const metadata: Metadata = {
  title: "Propiedades en Ayacucho | Lotes, Terrenos y Proyectos",
  description:
    "Catálogo de propiedades en Ayacucho: lotes y terrenos en Huamanga y Ccorihuillca/Qorihuillca, proyectos para vivienda, casa de campo o inversión. Asesoría completa y procesos seguros. Agenda tu visita por WhatsApp.",
  keywords: [
    "propiedades ayacucho",
    "terrenos ayacucho",
    "venta de terrenos ayacucho",
    "lotes ayacucho",
    "lotes en qorihuillca",
    "terrenos en huamanga",
    "proyectos inmobiliarios ayacucho",
    "inmobiliaria en ayacucho",
    "casagrande bienes y raices",
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
    title: "Propiedades en Ayacucho | Lotes y Terrenos (Huamanga y Qorihuillca)",
    description:
      "Explora lotes y terrenos en Ayacucho con alta proyección de valorización. Ideal para vivienda, casa de campo o inversión. Agenda visita por WhatsApp.",
    type: "website",
    url: CANONICAL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Propiedades en Ayacucho - Lotes, terrenos y proyectos",
      },
    ],
    siteName: BRAND_NAME,
    locale: "es_PE",
    emails: [EMAIL],
    phoneNumbers: [WHATSAPP],
  },

  twitter: {
    card: "summary_large_image",
    title: "Propiedades en Ayacucho | Lotes, Terrenos y Proyectos",
    description:
      "Catálogo de lotes y terrenos en Ayacucho (Huamanga y Qorihuillca). Acompañamiento y procesos seguros.",
    images: [OG_IMAGE],
  },

  category: "Real Estate",
  classification: "Catálogo inmobiliario – Terrenos y propiedades en Ayacucho",
};

function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export default function PropiedadesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaCollectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${CANONICAL}#collection`,
    name: "Propiedades en Ayacucho | Lotes, Terrenos y Proyectos",
    description:
      "Catálogo de propiedades en Ayacucho: lotes, terrenos y proyectos en Huamanga y Ccorihuillca/Qorihuillca para vivienda, casa de campo o inversión.",
    url: CANONICAL,
    inLanguage: "es-PE",
    isPartOf: {
      "@type": "WebSite",
      url: SITE_URL,
      name: BRAND_NAME,
    },
    about: [
      { "@type": "Thing", name: "Terrenos en Ayacucho" },
      { "@type": "Thing", name: "Lotes en Qorihuillca" },
      { "@type": "Thing", name: "Proyectos inmobiliarios en Ayacucho" },
    ],
    mainEntity: {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}#organization`,
      name: BRAND_NAME,
      alternateName: ALT_BRAND,
      url: SITE_URL,
      telephone: WHATSAPP,
      email: EMAIL,
      areaServed: [
        { "@type": "AdministrativeArea", name: "Ayacucho" },
        { "@type": "City", name: "Huamanga" },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jirón Quinua 570",
        addressLocality: "Huamanga",
        addressRegion: "Ayacucho",
        addressCountry: "PE",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: WHATSAPP,
        availableLanguage: ["es"],
      },
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
        name: "Propiedades",
        item: CANONICAL,
      },
    ],
  };

  return (
    <>
      {children}

      {/* ✅ Schema Markup - CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaCollectionPage)),
        }}
      />

      {/* ✅ Schema Markup - BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaBreadcrumb)),
        }}
      />
    </>
  );
}
