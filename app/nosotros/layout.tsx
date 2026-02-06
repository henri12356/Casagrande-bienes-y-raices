// app/nosotros/layout.tsx
import type { Metadata } from "next";

/**
 * SEO – Página Nosotros
 * Empresa: Casagrande Bienes y Raíces (INMOBILIARIA)
 * IMPORTANTE:
 * - NO incluir GoogleAnalytics aquí (va solo en app/layout.tsx)
 */

const SITE_URL = "https://www.casagrande-inmobilaria.com";
const PAGE_PATH = "/nosotros";
const CANONICAL = `${SITE_URL}${PAGE_PATH}`;

const BRAND_NAME = "Casagrande Bienes y Raíces";
const ALT_BRAND = "Casagrande Inmobiliaria Ayacucho";

const PHONE = "+51916194372";
const EMAIL = "u19217724@gmail.com";

// Imagen OG (crear en /public/og-nosotros.jpg – 1200x630)
const OG_IMAGE = `${SITE_URL}/og-nosotros.jpg`;

export const metadata: Metadata = {
  title: "Nosotros | Casagrande Bienes y Raíces – Inmobiliaria en Ayacucho",
  description:
    "Conoce Casagrande Bienes y Raíces, inmobiliaria en Ayacucho especializada en venta de terrenos y lotes en Huamanga y Ccorihuillca. Más de 400 lotes vendidos, procesos seguros y acompañamiento completo.",

  keywords: [
    "casagrande bienes y raices",
    "inmobiliaria en ayacucho",
    "venta de terrenos ayacucho",
    "lotes en ayacucho",
    "terrenos en huamanga",
    "lotes en ccorihuillca",
    "empresa inmobiliaria ayacucho",
    "compra y venta de terrenos",
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
    title: "Nosotros | Casagrande Bienes y Raíces – Inmobiliaria en Ayacucho",
    description:
      "Inmobiliaria especializada en terrenos y lotes en Ayacucho. Acompañamiento legal, procesos seguros y alta proyección de valorización.",
    type: "website",
    url: CANONICAL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Casagrande Bienes y Raíces - Nosotros",
      },
    ],
    siteName: BRAND_NAME,
    locale: "es_PE",
    emails: [EMAIL],
    phoneNumbers: [PHONE],
  },

  twitter: {
    card: "summary_large_image",
    title: "Nosotros | Casagrande Bienes y Raíces",
    description:
      "Inmobiliaria en Ayacucho especializada en terrenos y lotes para vivienda e inversión.",
    images: [OG_IMAGE],
  },

  category: "Real Estate",
  classification: "Inmobiliaria – Venta de terrenos y lotes en Ayacucho",
};

function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Schema AboutPage – INMOBILIARIA
  const schemaAboutPage = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${CANONICAL}#about`,
    name: `Nosotros | ${BRAND_NAME}`,
    description:
      "Casagrande Bienes y Raíces es una inmobiliaria en Ayacucho especializada en venta de terrenos y lotes con procesos seguros y acompañamiento completo.",
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
      knowsAbout: [
        "Venta de terrenos",
        "Venta de lotes",
        "Inversión inmobiliaria",
        "Terrenos en Ayacucho",
        "Lotes en Ccorihuillca",
        "Valorización de terrenos",
        "Asesoría inmobiliaria",
        "Compra y venta de posesión",
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
    },
  };

  // ✅ Breadcrumb
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
        name: "Nosotros",
        item: CANONICAL,
      },
    ],
  };

  return (
    <>
      {children}

      {/* Schema AboutPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaAboutPage)),
        }}
      />

      {/* Schema Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaBreadcrumb)),
        }}
      />
    </>
  );
}
