// app/propiedades/[slug]/layout.tsx
import type { Metadata } from "next";

/**
 * ✅ IMPORTANTE
 * - NO incluyas GoogleAnalytics aquí (debe estar SOLO en app/layout.tsx)
 * - Este layout es para SEO por propiedad: /propiedades/[slug]
 */

interface PropertyLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// ✅ TU DOMINIO REAL (INMOBILIARIA)
const SITE_URL = "https://www.casagrande-inmobilaria.com";

const BRAND_NAME = "Casagrande Bienes y Raíces";
const ALT_BRAND = "Casagrande Inmobiliaria Ayacucho";
const WHATSAPP = "+51916194372";
const EMAIL = "u19217724@gmail.com";

// ✅ OG fallback (debe existir en /public)
const FALLBACK_OG = `${SITE_URL}/og-propiedades.jpg`;

type PropertyMeta = {
  title: string;
  description: string;
  keywords: string | string[];
  image: string; // debe empezar con "/"
  canonical: string; // URL absoluta
  locationText: string;
  address: {
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
    streetAddress?: string;
    postalCode?: string;
  };
  areaM2?: number;
  pricePEN?: number;
  availability?: string; // schema.org url
};

// ✅ Las llaves deben ser EXACTAMENTE el slug real (/propiedades/[slug])
const propiedadesMetadata = {
  "villa-sol-2-qorihuillca": {
    title: "Villa Sol 2 | Lotes en Qorihuillca, Ayacucho (desde 200 m²)",
    description:
      "Villa Sol 2: lotes en Ccorihuillca/Qorihuillca – Ayacucho desde 200 m². Ideal para vivienda, casa de campo o inversión. Agenda tu visita y revisa disponibilidad.",
    keywords: [
      "villa sol 2",
      "lotes en qorihuillca",
      "terrenos en ayacucho",
      "venta de terrenos ayacucho",
      "lotes ayacucho",
      "terrenos en huamanga",
      "comprar terreno ayacucho",
      "inmobiliaria en ayacucho",
      "casagrande bienes y raices",
    ],
    image: "/villasol01.webp",
    canonical: `${SITE_URL}/propiedades/villa-sol-2-qorihuillca`,
    locationText: "Ccorihuillca / Qorihuillca, Huamanga – Ayacucho",
    address: {
      addressLocality: "Huamanga",
      addressRegion: "Ayacucho",
      addressCountry: "PE",
    },
    areaM2: 200,
    pricePEN: 19000,
    availability: "https://schema.org/InStock",
  },

  "proyecto-esperanza": {
    title: "Proyecto Esperanza | Terrenos en Ayacucho (Huamanga)",
    description:
      "Proyecto Esperanza: terrenos en Ayacucho con alta proyección de valorización. Opciones para inversión, vivienda o casa de campo. Solicita información y agenda visita.",
    keywords: [
      "proyecto esperanza",
      "terrenos ayacucho",
      "venta de lotes ayacucho",
      "comprar terreno huamanga",
      "lotes para casa de campo ayacucho",
      "inmobiliaria en ayacucho",
      "casagrande bienes y raices",
    ],
    image: "/images/proyectos/proyecto-esperanza.webp",
    canonical: `${SITE_URL}/propiedades/proyecto-esperanza`,
    locationText: "Huamanga – Ayacucho",
    address: {
      addressLocality: "Huamanga",
      addressRegion: "Ayacucho",
      addressCountry: "PE",
    },
    areaM2: 370,
    pricePEN: 49000,
    availability: "https://schema.org/InStock",
  },

  "casera-qorihuillca-200m2": {
    title: "Casera Qorihuillca 200 m² | Lotes en Ayacucho (Qorihuillca)",
    description:
      "Lote Casera Ccorihuillca/Qorihuillca de 200 m² en Ayacucho. Acceso vehicular y entorno tranquilo. Ideal para inversión o vivienda. Consulta precio y disponibilidad.",
    keywords: [
      "casera qorihuillca",
      "lote 200 m2 ayacucho",
      "terrenos en qorihuillca",
      "venta de terrenos en ayacucho",
      "lotes huamanga",
      "inmobiliaria en ayacucho",
      "casagrande bienes y raices",
    ],
    image: "/images/proyectos/casera-qorihuillca.webp",
    canonical: `${SITE_URL}/propiedades/casera-qorihuillca-200m2`,
    locationText: "Ccorihuillca / Qorihuillca, Huamanga – Ayacucho",
    address: {
      addressLocality: "Huamanga",
      addressRegion: "Ayacucho",
      addressCountry: "PE",
    },
    areaM2: 200,
    pricePEN: 33000,
    availability: "https://schema.org/InStock",
  },
} satisfies Record<string, PropertyMeta>;

type PropertySlug = keyof typeof propiedadesMetadata;

export async function generateMetadata({
  params,
}: PropertyLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const data = propiedadesMetadata[slug as PropertySlug];

  if (!data) {
    return {
      title: `Propiedad no encontrada | ${BRAND_NAME}`,
      description:
        "La propiedad que buscas no está disponible. Revisa terrenos y lotes en Ayacucho (Ccorihuillca/Qorihuillca y alrededores).",
      alternates: { canonical: `${SITE_URL}/propiedades` },
      robots: { index: false, follow: false },
    };
  }

  const imageUrl = `${SITE_URL}${data.image}`;

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,

    authors: [{ name: BRAND_NAME }],
    creator: BRAND_NAME,
    publisher: BRAND_NAME,
    category: "Real Estate",

    alternates: {
      canonical: data.canonical,
      languages: { "es-PE": data.canonical },
    },

    openGraph: {
      title: data.title,
      description: data.description,
      url: data.canonical,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      siteName: BRAND_NAME,
      locale: "es_PE",
      emails: [EMAIL],
      phoneNumbers: [WHATSAPP],
    },

    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: [imageUrl],
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
  };
}

export async function generateStaticParams() {
  return Object.keys(propiedadesMetadata).map((slug) => ({ slug }));
}

function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export default async function PropertyLayout({
  children,
  params,
}: PropertyLayoutProps) {
  const { slug } = await params;
  const data = propiedadesMetadata[slug as PropertySlug];

  const canonical = data?.canonical ?? `${SITE_URL}/propiedades/${slug}`;
  const imageUrl = data?.image
    ? `${SITE_URL}${data.image}`
    : FALLBACK_OG;

  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: data?.title ?? `Propiedad | ${BRAND_NAME}`,
    description: data?.description,
    inLanguage: "es-PE",
    isPartOf: {
      "@type": "WebSite",
      url: SITE_URL,
      name: BRAND_NAME,
    },
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BRAND_NAME, item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Propiedades",
        item: `${SITE_URL}/propiedades`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data?.title ?? slug,
        item: canonical,
      },
    ],
  };

  const schemaListing = data
    ? {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "@id": `${canonical}#listing`,
        name: data.title,
        description: data.description,
        url: canonical,
        image: [imageUrl],

        provider: {
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
        },

        address: {
          "@type": "PostalAddress",
          ...data.address,
        },

        floorSize: data.areaM2
          ? {
              "@type": "QuantitativeValue",
              value: data.areaM2,
              unitText: "M2",
            }
          : undefined,

        offers: data.pricePEN
          ? {
              "@type": "Offer",
              priceCurrency: "PEN",
              price: String(data.pricePEN),
              availability: data.availability ?? "https://schema.org/InStock",
              url: canonical,
            }
          : undefined,
      }
    : null;

  return (
    <>
      {children}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clean(schemaWebPage)) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clean(schemaBreadcrumb)),
        }}
      />

      {schemaListing && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(clean(schemaListing)),
          }}
        />
      )}
    </>
  );
}
