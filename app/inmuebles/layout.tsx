import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

const SITE_URL = "https://www.ayacuchoterrenos.com"; // ✅ sin "/" al final
const CATALOG_PATH = "/propiedades"; // cambia a "/proyectos" si tu catálogo es /proyectos
const CANONICAL = `${SITE_URL}${CATALOG_PATH}`;

const BRAND_NAME = "Compra y Venta de Terrenos Ayacucho";
const ALT_BRAND = "Casagrande Bienes y Raíces";
const WHATSAPP = "+51916194372";
const EMAIL = "u19217724@gmail.com";

// ✅ Imagen OG del catálogo (recomendado crearla en /public)
const OG_IMAGE = `${SITE_URL}/og-propiedades.jpg`;

export const metadata: Metadata = {
  title: "Propiedades en Ayacucho | Lotes, Terrenos y Proyectos",
  description:
    "Catálogo de propiedades en Ayacucho: lotes y terrenos en Huamanga y Qorihuillca, proyectos para vivienda, casa de campo o inversión. Asesoría completa y procesos seguros. Agenda tu visita por WhatsApp.",
  keywords: [
    "propiedades ayacucho",
    "terrenos ayacucho",
    "venta de terrenos ayacucho",
    "lotes ayacucho",
    "lotes en qorihuillca",
    "terrenos en huamanga",
    "proyectos inmobiliarios ayacucho",
    "compra y venta de terrenos ayacucho",
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

export default function PropiedadesLayout({ children }: { children: React.ReactNode }) {
  const schemaCollectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${CANONICAL}#collection`,
    name: "Propiedades en Ayacucho | Lotes, Terrenos y Proyectos",
    description:
      "Catálogo de propiedades en Ayacucho: lotes, terrenos y proyectos en Huamanga y Qorihuillca para vivienda, casa de campo o inversión.",
    url: CANONICAL,
    inLanguage: "es-PE",
    isPartOf: {
      "@type": "WebSite",
      url: SITE_URL,
      name: BRAND_NAME,
    },
    mainEntity: {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}#organization`,
      name: BRAND_NAME,
      alternateName: ALT_BRAND,
      url: SITE_URL,
      telephone: WHATSAPP,
      email: EMAIL,
      areaServed: [
        { "@type": "City", name: "Huamanga" },
        { "@type": "City", name: "Ayacucho" },
        { "@type": "Country", name: "Perú" },
      ],
    },
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Propiedades", item: CANONICAL },
    ],
  };

  return (
    <>
      {children}
      <GoogleAnalytics gaId="G-7TJCWC5JMR" />

      {/* Schema Markup - CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaCollectionPage)),
        }}
      />

      {/* Schema para Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaBreadcrumb)),
        }}
      />
    </>
  );
}
