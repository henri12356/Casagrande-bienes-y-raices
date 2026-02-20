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
const SITE_URL = "https://www.casagrande-inmobilaria.com";

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
    slug: "machayhuycco-ayacucho",
    tipo: "proyecto",
    titulo: "CAMPO REAL",
    subtitulo: "Ayacucho",
    categoria: "Lotes",
    ubicacion: "Machayhuaycco , Huamanga – Ayacucho",
    precioDesdeSol: "S/ 20000",
    precioDesdeDolar: "",
    pagoContado: "S/ 2,000",
    imagen: "/MACHAYHUAYCCO/MACHAYHUAYCCOHERO.webp",
    etiquetas: [
      "Alta plusvalía",
      "Acceso vehicular",
      "Servicios básicos",
      "Entorno natural",
      "Proyección de valorización",
    ],
    descripcion:
      "MACHAYHUYCCO es un proyecto de lotes en Huamanga – Ayacucho, ideal para vivienda, casa de campo o inversión. Cuenta con acceso vehicular y servicios básicos (agua y luz), en un entorno natural con alta proyección de valorización. Proyecto pensado para compra segura, con acompañamiento durante el proceso de separación y adquisición.",
    stockLotes: { total: 18, restantes: 12, actualizado: "16/01/2026" },
    caracteristicas: [
      { label: "Área típica", value: "200 m²" },
      { label: "Lotes especiales", value: "206 m², 217 m² y 298 m²" },
      { label: "Área total del proyecto", value: "3793.54 m²" },
      { label: "Precio por lote", value: "S/ 20,000" },
      { label: "Tipo de uso", value: "Vivienda / casa de campo / inversión" },
      {
        label: "Servicios",
        value: "Agua y luz (según disponibilidad y expansión de zona)",
      },
      { label: "Accesos", value: "Acceso vehicular y rutas en mejora" },
      { label: "Entorno", value: "Zona natural con proyección de valorización" },
    ],
  },
  {
    slug: "bungavilia-ayacucho",
    tipo: "proyecto",
    titulo: "BUGAMBILIAS",
    subtitulo: "Ayacucho",
    categoria: "Lotes",
    ubicacion: "Bungavilia, Huamanga – Ayacucho",
    precioDesdeSol: "S/ 20000",
    precioDesdeDolar: "",
    pagoContado: "S/ 2,000",
    imagen: "/BUNGAVILIA/BUNGAVILIAHERO.webp",
    etiquetas: [
      "Ayacucho",
      "Alta plusvalía",
      "Acceso vehicular",
      "Servicios básicos",
      "Entorno natural",
      "Proyección de valorización",
    ],
    descripcion:
      "BUNGAVILIA es un proyecto de lotes en Huamanga – Ayacucho, ideal para vivienda, casa de campo o inversión. Cuenta con acceso vehicular y servicios básicos (agua y luz), en un entorno natural con alta proyección de valorización. Proyecto pensado para compra segura, con acompañamiento durante el proceso de separación y adquisición.",
    stockLotes: { total: 20, restantes: 4, actualizado: "16/01/2026" },
    caracteristicas: [
      { label: "Área típica", value: "220 m²" },
      { label: "Lotes especiales", value: "220 m², 220 m² y 298 m²" },
      { label: "Área total del proyecto", value: "3793.54 m²" },
      { label: "Precio por lote", value: "S/ 20,000" },
      { label: "Tipo de uso", value: "Vivienda / casa de campo / inversión" },
      {
        label: "Servicios",
        value: "Agua y luz (según disponibilidad y expansión de zona)",
      },
      { label: "Accesos", value: "Acceso vehicular y rutas en mejora" },
      { label: "Entorno", value: "Zona natural con proyección de valorización" },
    ],
  },
  {
    slug: "huanupata",
    tipo: "proyecto",
    titulo: "HUANUPATA",
    subtitulo: "Ayacucho",
    categoria: "Lotes",
    ubicacion: "Huanupata, Huamanga – Ayacucho",
    precioDesdeSol: "S/ 16000",
    precioDesdeDolar: "",
    pagoContado: "S/ 2,000",
    imagen: "/HUANUPATA/HUANUPATA01.webp",
    etiquetas: [
      "Ayacucho",
      "Alta plusvalía",
      "Acceso vehicular",
      "Servicios básicos",
      "Entorno natural",
      "Proyección de valorización",
    ],
    descripcion:
      "HUANUPATA es un proyecto de lotes en Huamanga – Ayacucho, ideal para vivienda, casa de campo o inversión. Cuenta con acceso vehicular y servicios básicos (agua y luz), en un entorno natural con alta proyección de valorización. Proyecto pensado para compra segura, con acompañamiento durante el proceso de separación y adquisición.",
    stockLotes: { total: 15, restantes: 3, actualizado: "16/01/2026" },
    caracteristicas: [
      { label: "Área típica", value: "200 m²" },
      { label: "Lotes especiales", value: "200 m², 217 m² y 298 m²" },
      { label: "Área total del proyecto", value: "3793.54 m²" },
      { label: "Precio por lote", value: "S/ 16,000" },
      { label: "Tipo de uso", value: "Vivienda / casa de campo / inversión" },
      {
        label: "Servicios",
        value: "Agua y luz (según disponibilidad y expansión de zona)",
      },
      { label: "Accesos", value: "Acceso vehicular y rutas en mejora" },
      { label: "Entorno", value: "Zona natural con proyección de valorización" },
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