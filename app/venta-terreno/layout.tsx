// app/venta-terreno/layout.tsx
import type { Metadata } from "next";

/**
 * ✅ Página para captación de propietarios (intermediación):
 * “Quiero vender mi terreno / lote / casa”
 *
 * IMPORTANTE:
 * - NO incluyas GoogleAnalytics aquí (solo va en app/layout.tsx)
 */

const SITE_URL = "https://www.casagrande-inmobilaria.com";
const PAGE_PATH = "/venta-terreno";
const CANONICAL = `${SITE_URL}${PAGE_PATH}`;

const BRAND_NAME = "Casagrande Bienes y Raíces";
const ALT_BRAND = "Casagrande Inmobiliaria Ayacucho";

const PHONE = "+51916194372";
const EMAIL = "u19217724@gmail.com";

// ✅ crea esta imagen en /public/og-venta-terreno.jpg (1200x630)
const OG_IMAGE = `${SITE_URL}/og-venta-terreno.jpg`;

export const metadata: Metadata = {
  title: "Vende tu Terreno en Ayacucho | Casagrande Bienes y Raíces",
  description:
    "¿Quieres vender tu terreno, lote, casa o propiedad en Ayacucho? En Casagrande Bienes y Raíces intermediamos tu venta con asesoría, verificación y difusión para conseguir compradores reales. Contáctanos por WhatsApp.",
  keywords: [
    "vender terreno ayacucho",
    "vender lote ayacucho",
    "vender casa ayacucho",
    "inmobiliaria ayacucho",
    "intermediación inmobiliaria",
    "publicar terreno en ayacucho",
    "compradores de terrenos ayacucho",
    "casagrande bienes y raices",
  ],

  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,

  alternates: {
    canonical: CANONICAL,
    languages: { "es-PE": CANONICAL },
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
    title: "Vende tu Terreno en Ayacucho | Intermediación Inmobiliaria",
    description:
      "Intermediamos la venta de tu terreno, lote o casa en Ayacucho. Difusión, filtrado de compradores y acompañamiento en el proceso para vender con seguridad.",
    type: "website",
    url: CANONICAL,
    siteName: BRAND_NAME,
    locale: "es_PE",
    emails: [EMAIL],
    phoneNumbers: [PHONE],
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Vende tu terreno en Ayacucho - Casagrande Bienes y Raíces",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Vende tu Terreno en Ayacucho | Casagrande Bienes y Raíces",
    description:
      "Intermediación inmobiliaria en Ayacucho para vender terrenos, lotes y casas con seguridad y asesoría.",
    images: [OG_IMAGE],
  },

  category: "Real Estate",
  classification: "Captación de propiedades – Intermediación inmobiliaria",
};

function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export default function VentaTerrenoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * ✅ Schema principal: Service + RealEstateAgent + WebPage
   * - Refuerza intención: “vender propiedad / intermediación”
   * - Refuerza entidad local (Ayacucho)
   */

  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${CANONICAL}#webpage`,
    url: CANONICAL,
    name: "Vende tu Terreno en Ayacucho",
    description:
      "Página para propietarios que desean vender terreno, lote, casa o propiedad en Ayacucho con intermediación y asesoría.",
    inLanguage: "es-PE",
    isPartOf: {
      "@type": "WebSite",
      url: SITE_URL,
      name: BRAND_NAME,
    },
  };

  const schemaOrganization = {
    "@context": "https://schema.org",
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
    geo: {
      "@type": "GeoCoordinates",
      latitude: -13.155749,
      longitude: -74.220991,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Ayacucho" },
      { "@type": "City", name: "Huamanga" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: PHONE,
        email: EMAIL,
        availableLanguage: ["es"],
        areaServed: "PE-AYA",
      },
    ],
    sameAs: [
      "https://www.facebook.com/profile.php?id=61584966996472",
      "https://www.instagram.com/henriinmobiliaria/",
      "https://www.tiktok.com/@henriinmobiliaria",
    ],
  };

  const schemaService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${CANONICAL}#service`,
    name: "Intermediación para vender terrenos, lotes y casas en Ayacucho",
    description:
      "Servicio de intermediación inmobiliaria para propietarios: evaluación, estrategia de precio, publicación y difusión, filtrado de interesados, visitas y acompañamiento durante el proceso de venta.",
    provider: { "@id": `${SITE_URL}#organization` },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Ayacucho" },
      { "@type": "City", name: "Huamanga" },
    ],
    serviceType: [
      "Intermediación inmobiliaria",
      "Venta de terrenos",
      "Venta de lotes",
      "Venta de casas",
    ],
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BRAND_NAME, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Vende tu Propiedad", item: CANONICAL },
    ],
  };

  return (
    <>
      {children}

      {/* WebPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clean(schemaWebPage)) }}
      />

      {/* Entity / Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaOrganization)),
        }}
      />

      {/* Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaService)),
        }}
      />

      {/* Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaBreadcrumb)),
        }}
      />
    </>
  );
}
