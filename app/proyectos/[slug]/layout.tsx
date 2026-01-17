import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// ✅ IMPORTANTE: sin "/" al final
const SITE_URL = "https://www.ayacuchoterrenos.com";

const BRAND_NAME = "Compra y Venta de Terrenos Ayacucho";
const ALT_BRAND = "Casagrande Bienes y Raíces";
const WHATSAPP = "+51916194372";
const EMAIL = "u19217724@gmail.com";

type ProjectMeta = {
  title: string;
  description: string;
  keywords: string;
  image: string; // ✅ debe empezar con "/"
  canonical: string; // ✅ URL absoluta
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
  availability?: string;
};

// ✅ Las llaves deben ser EXACTAMENTE el slug real (/proyectos/[slug])
const proyectosMetadata = {
  "villa-sol-2-qorihuillca": {
    title: "Villa Sol 2 | Lotes en Qorihuillca, Ayacucho (desde 200 m²)",
    description:
      "Villa Sol 2: lotes en Qorihuillca – Ayacucho desde 200 m². Ideal para vivienda, casa de campo o inversión. Agenda tu visita y conoce disponibilidad.",
    keywords:
      "lotes en qorihuillca, terrenos en ayacucho, venta de terrenos ayacucho, lotes ayacucho, terrenos en huamanga, comprar terreno ayacucho",
    image: "/villasol01.webp",
    canonical: `${SITE_URL}/proyectos/villa-sol-2-qorihuillca`,
    locationText: "Qorihuillca, Huamanga – Ayacucho",
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
    keywords:
      "proyecto de terrenos en ayacucho, terrenos ayacucho, venta de lotes ayacucho, comprar terreno huamanga, lotes para casa de campo ayacucho",
    image: "/images/proyectos/proyecto-esperanza.webp",
    canonical: `${SITE_URL}/proyectos/proyecto-esperanza`,
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
      "Lote Casera Qorihuillca de 200 m² en Ayacucho. Acceso vehicular y entorno tranquilo. Ideal para inversión o vivienda. Consulta precio y disponibilidad.",
    keywords:
      "casera qorihuillca, lote 200 m2 ayacucho, terrenos en qorihuillca, venta de terrenos en ayacucho, lotes huamanga",
    image: "/images/proyectos/casera-qorihuillca.webp",
    canonical: `${SITE_URL}/proyectos/casera-qorihuillca-200m2`,
    locationText: "Qorihuillca, Huamanga – Ayacucho",
    address: {
      addressLocality: "Huamanga",
      addressRegion: "Ayacucho",
      addressCountry: "PE",
    },
    areaM2: 200,
    pricePEN: 33000,
    availability: "https://schema.org/InStock",
  },
} satisfies Record<string, ProjectMeta>;

type ProyectoSlug = keyof typeof proyectosMetadata;

export async function generateMetadata({
  params,
}: ProjectLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const data = proyectosMetadata[slug as ProyectoSlug];

  if (!data) {
    return {
      title: `Proyecto no encontrado | ${BRAND_NAME}`,
      description:
        "El proyecto que buscas no está disponible. Revisa nuestros proyectos de terrenos en Ayacucho y lotes en Qorihuillca.",
      robots: { index: false, follow: false },
    };
  }

  // ✅ URL absoluta correcta
  const imageUrl = `${SITE_URL}${data.image}`;

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,

    authors: [{ name: BRAND_NAME }],
    creator: BRAND_NAME,
    publisher: BRAND_NAME,
    category: "Real Estate",

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

    alternates: {
      canonical: data.canonical,
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
  return Object.keys(proyectosMetadata).map((slug) => ({ slug }));
}

function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { slug } = await params;
  const data = proyectosMetadata[slug as ProyectoSlug];

  // ✅ fallback correcto en /proyectos
  const canonical = data?.canonical ?? `${SITE_URL}/proyectos/${slug}`;

  const imageUrl = data?.image
    ? `${SITE_URL}${data.image}`
    : `${SITE_URL}/og-proyectos.jpg`;

  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: data?.title ?? `Proyecto | ${BRAND_NAME}`,
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
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Proyectos",
        item: `${SITE_URL}/proyectos`,
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
            { "@type": "City", name: "Huamanga" },
            { "@type": "City", name: "Ayacucho" },
            { "@type": "Country", name: "Perú" },
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
      <GoogleAnalytics gaId="G-7TJCWC5JMR" />

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
