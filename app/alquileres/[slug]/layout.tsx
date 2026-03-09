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

// ✅ TU DOMINIO REAL (INMOBILIARIA) — revisa el typo si aplica
const SITE_URL = "https://www.casagrande-inmobiliaria.com";

const BRAND_NAME = "Casagrande Bienes y Raíces";
const ALT_BRAND = "Casagrande Inmobiliaria Ayacucho";
const WHATSAPP = "+51916194372";
const EMAIL = "u19217724@gmail.com";

// ✅ OG fallback (debe existir en /public)
const FALLBACK_OG = `${SITE_URL}/og-propiedades.jpg`;

type ProjectJson = {
  slug: string;
  tipo: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  ubicacion: string;
  precioDesdeSol: string;
  precioDesdeDolar?: string;
  pagoContado?: string;
  imagen: string;
  etiquetas?: string[];
  descripcion: string;
  equipamiento?: string[];
  stockLotes?: { total: number; restantes: number; actualizado?: string };
  caracteristicas?: Array<{ label: string; value: string }>;
  mapsUrl?: string;
};

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

const proyectosJson: ProjectJson[] = [
  {
    slug: "propiedad-san-juan-bautista-ayacucho",
    tipo: "propiedad",
    titulo: "San Juan Bautista",
    subtitulo: "Ayacucho",
    categoria: "Propiedad",
    ubicacion:
      "San Juan Bautista, Huamanga – Ayacucho (cerca del Mercado Las Américas y Mirador de Acuchimay)",
    precioDesdeSol: "S/ 240000",
    precioDesdeDolar: "",
    pagoContado: "",
    imagen: "/SANJUAN/SANJUAN01.webp",

    etiquetas: [
      "San Juan Bautista",
      "Mercado Las Américas",
      "Mirador de Acuchimay",
      "Agua",
      "Luz",
      "Desagüe",
      "Título de Propiedad",
      "Todo en regla",
    ],

    descripcion:
      "Se vende propiedad ubicada en San Juan Bautista, Huamanga – Ayacucho, en una zona estratégica y de fácil acceso, cerca del Mercado Las Américas y del Mirador de Acuchimay. Cuenta con agua, luz y desagüe, además de título de propiedad con documentación completamente en regla. Excelente oportunidad para vivienda o inversión en una zona consolidada y con alta demanda.",

    caracteristicas: [
      { label: "Precio", value: "S/ 240,000" },
      {
        label: "Ubicación",
        value:
          "San Juan Bautista, cerca del Mercado Las Américas y Mirador de Acuchimay",
      },
      { label: "Servicios", value: "Agua, luz y desagüe" },
      { label: "Documentación", value: "Título de propiedad en regla" },
      { label: "Uso", value: "Vivienda / inversión" },
    ],
  },
];

// ---------------- helpers ----------------
function toNumberFromMoneyPEN(input?: string): number | undefined {
  if (!input) return undefined;
  // "S/ 20,000" | "S/ 20000" | "20000"
  const cleaned = input
    .replace(/s\/\s*/gi, "")
    .replace(/[^\d.]/g, ""); // deja dígitos y punto
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

function areaFromCaracteristicas(
  caracteristicas?: Array<{ label: string; value: string }>
): number | undefined {
  const area = caracteristicas?.find((c) =>
    c.label.toLowerCase().includes("área típica")
  )?.value;
  if (!area) return undefined;
  const m = area.match(/(\d+(\.\d+)?)/);
  if (!m) return undefined;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : undefined;
}

function keywordsFromProject(p: ProjectJson): string[] {
  const base = [
    p.titulo.toLowerCase(),
    "terrenos en ayacucho",
    "lotes ayacucho",
    "venta de lotes ayacucho",
    "terrenos en huamanga",
    "inmobiliaria en ayacucho",
    "casagrande bienes y raices",
  ];

  const extra = (p.etiquetas ?? []).map((x) => x.toLowerCase());
  const ubic = [
    ...(p.ubicacion ? [p.ubicacion.toLowerCase()] : []),
    ...(p.subtitulo ? [p.subtitulo.toLowerCase()] : []),
  ];

  // dedupe simple
  return Array.from(new Set([...base, ...extra, ...ubic])).filter(Boolean);
}

function makeMetaFromProject(p: ProjectJson): PropertyMeta {
  const pricePEN = toNumberFromMoneyPEN(p.precioDesdeSol);
  const areaM2 = areaFromCaracteristicas(p.caracteristicas);
  const restantes = p.stockLotes?.restantes ?? 0;
  const availability =
    restantes > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut";

  const title = `${p.titulo} | Lotes en ${p.subtitulo} (${p.ubicacion})`;
  const description = p.descripcion;

  return {
    title,
    description,
    keywords: keywordsFromProject(p),
    image: p.imagen?.startsWith("/") ? p.imagen : `/${p.imagen}`,
    canonical: `${SITE_URL}/propiedades/${p.slug}`,
    locationText: p.ubicacion,
    address: {
      addressLocality: "Huamanga",
      addressRegion: "Ayacucho",
      addressCountry: "PE",
    },
    areaM2,
    pricePEN,
    availability,
  };
}

// ✅ Slug => meta
const propiedadesMetadata = Object.fromEntries(
  proyectosJson.map((p) => [p.slug, makeMetaFromProject(p)])
) satisfies Record<string, PropertyMeta>;

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
        "La propiedad que buscas no está disponible. Revisa terrenos y lotes en Ayacucho (Huamanga y alrededores).",
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
  const imageUrl = data?.image ? `${SITE_URL}${data.image}` : FALLBACK_OG;

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