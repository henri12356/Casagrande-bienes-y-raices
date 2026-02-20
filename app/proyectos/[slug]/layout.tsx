// app/proyectos/[slug]/layout.tsx
import type { Metadata } from "next";

/**
 * ✅ IMPORTANTE
 * - NO incluyas GoogleAnalytics aquí (solo debe estar en app/layout.tsx)
 * - Layout SEO por proyecto: /proyectos/[slug]
 */

interface ProjectLayoutProps {
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
const FALLBACK_OG = `${SITE_URL}/og-proyectos.jpg`;

type ProjectJson = {
  slug: string;
  tipo: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  ubicacion: string;

  precioDesdeSol?: string;
  precioDesdeDolar?: string;
  pagoContado?: string;

  imagen: string;
  etiquetas?: string[];
  descripcion: string;

  equipamiento?: string[];
  caracteristicas?: Array<{ label: string; value: string }>;

  planos?: {
    titulo?: string;
    imagen?: string;
    pdf?: string;
    nota?: string;
  };

  galeria?: {
    fotos?: string[];
    youtubeId?: string;
  };

  ubicacionImagen?: string;
  mapsUrl?: string;

  descuento?: { titulo?: string; imagen?: string };

  contacto?: {
    whatsapp?: string;
    telefono?: string;
    direccion?: string;
    horario?: string;
  };

  stockLotes?: { total: number; restantes: number; actualizado?: string };
};

type ProjectMeta = {
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
  availability?: string;
};

// ✅ TU JSON (si quieres, muévelo luego a /data/proyectos.ts)
const proyectosJson: ProjectJson[] = [
  {
    slug: "cañones-ayacucho-qorihuillca",
    tipo: "proyecto",
    titulo: "Cañones",
    subtitulo: "Qorihuillca",
    categoria: "Lotes",
    ubicacion: "Qorihuillca, Huamanga – Ayacucho",

    precioDesdeSol: "S/ 30,000",
    precioDesdeDolar: "",
    pagoContado: "S/ 2,000",

    imagen: "/CAÑONES/CAÑONES03.webp",
    etiquetas: [
      "Cañones",
      "Huamanga",
      "Ayacucho",
      "Naturaleza",
      "Zona en crecimiento",
      "Alta plusvalía",
      "Acceso vehicular",
      "Agua",
      "Luz",
      "Bioambiental",
    ],

    descripcion:
      "Cañones es un proyecto de lotes en Qorihuillca – Huamanga, Ayacucho, pensado para quienes buscan tranquilidad, aire puro y una inversión con alta proyección. Rodeado de naturaleza y con accesos en mejora, es ideal para primera vivienda, casa de campo o inversión. Cuenta con agua, luz y acceso vehicular en una zona con crecimiento sostenido y gran potencial de valorización.",

    equipamiento: [
      "Agua",
      "Luz",
      "Acceso vehicular",
      "Entorno bioambiental ",
      "Zona con proyección de valorización",
    ],

    caracteristicas: [
      { label: "Área", value: "200 m²" },
      { label: "Precio", value: "S/ 30,000" },
      { label: "Uso", value: "Vivienda / Casa de campo / Inversión" },
      { label: "Servicios", value: "Agua, Luz y acceso vehicular" },
      {
        label: "Documentación",
        value: "Acta de transferencia + contrato privado (legalizable)",
      },
      { label: "Entorno", value: "Bioambiental" },
      { label: "Valorización", value: "Zona con alta proyección de crecimiento" },
    ],

    planos: {
      titulo: "Plano del proyecto",
      imagen: "/CAÑONES/CAÑONESPLANO.webp",
      pdf: "/CAÑONES/CAÑONESPLANO.pdf",
      nota: "Haz clic para ver el plano en grande",
    },

    galeria: {
      fotos: ["/CAÑONES/CAÑONES03.webp", "/CAÑONES/CAÑONES01.webp"],
      youtubeId: "",
    },

    ubicacionImagen: "/hero03.webp",
    mapsUrl:
      "https://www.google.com/maps/place/13%C2%B008'06.3%22S+74%C2%B014'49.4%22W/@-13.135378,-74.2473034,243m/data=!3m1!1e3!4m4!3m3!8m2!3d-13.135083!4d-74.247058?entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D",

    descuento: {
      titulo: "Campaña activa: separa tu lote hoy y asegura tu precio preferencial",
      imagen: "/prueba01.webp",
    },

    contacto: {
      whatsapp: "51970993246",
      telefono: "+51 970 993 246",
      direccion: "Jr. Quinua N° 570, Ayacucho",
      horario: "Lun–Sab 9:00 AM – 7:00 PM",
    },
  },
];

// ---------------- helpers ----------------
function normalizeSlug(input: string) {
  const decoded = (() => {
    try {
      return decodeURIComponent(input);
    } catch {
      return input;
    }
  })();

  return decoded.trim().toLowerCase().normalize("NFC");
}

function slugAscii(input: string) {
  return normalizeSlug(input)
    .replace(/ñ/g, "n")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toNumberFromMoneyPEN(input?: string): number | undefined {
  if (!input) return undefined;
  const cleaned = input.replace(/s\/\s*/gi, "").replace(/[^\d.]/g, "");
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

function areaFromCaracteristicas(
  caracteristicas?: Array<{ label: string; value: string }>
): number | undefined {
  if (!caracteristicas?.length) return undefined;

  const item = caracteristicas.find((c) =>
    c.label.toLowerCase().includes("área")
  );
  const val = item?.value;
  if (!val) return undefined;

  const m = val.match(/(\d+(\.\d+)?)/);
  if (!m) return undefined;

  const n = Number(m[1]);
  return Number.isFinite(n) ? n : undefined;
}

function keywordsFromProject(p: ProjectJson): string[] {
  const base = [
    p.titulo.toLowerCase(),
    `lotes en ${p.subtitulo}`.toLowerCase(),
    "terrenos en ayacucho",
    "lotes ayacucho",
    "venta de lotes ayacucho",
    "terrenos en huamanga",
    "inmobiliaria en ayacucho",
    "casagrande bienes y raices",
  ];

  const extra = (p.etiquetas ?? []).map((x) => x.toLowerCase().trim());
  const ubic = p.ubicacion ? [p.ubicacion.toLowerCase()] : [];

  return Array.from(new Set([...base, ...extra, ...ubic])).filter(Boolean);
}

function availabilityFromStock(p: ProjectJson): string {
  const restantes = p.stockLotes?.restantes;
  if (typeof restantes === "number") {
    return restantes > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/SoldOut";
  }
  return "https://schema.org/InStock";
}

function makeMetaFromProject(p: ProjectJson): ProjectMeta {
  const pricePEN = toNumberFromMoneyPEN(p.precioDesdeSol);
  const areaM2 = areaFromCaracteristicas(p.caracteristicas);

  const titleParts = [
    `${p.titulo} | Lotes en ${p.subtitulo}, Ayacucho`,
    areaM2 ? `(${areaM2} m²)` : null,
    p.precioDesdeSol ? `(desde ${p.precioDesdeSol})` : null,
  ].filter(Boolean);

  return {
    title: titleParts.join(" "),
    description: p.descripcion,
    keywords: keywordsFromProject(p),
    image: p.imagen?.startsWith("/") ? p.imagen : `/${p.imagen}`,
    canonical: `${SITE_URL}/proyectos/${p.slug}`,
    locationText: p.ubicacion,
    address: {
      addressLocality: "Huamanga",
      addressRegion: "Ayacucho",
      addressCountry: "PE",
    },
    areaM2,
    pricePEN,
    availability: availabilityFromStock(p),
  };
}

// ✅ Slug => meta (Map con normalización + alias ASCII)
const proyectosMetadataMap = new Map<string, ProjectMeta>();

for (const p of proyectosJson) {
  const meta = makeMetaFromProject(p);

  // 1) slug original
  proyectosMetadataMap.set(p.slug, meta);

  // 2) slug normalizado (NFC)
  proyectosMetadataMap.set(normalizeSlug(p.slug), meta);

  // 3) alias ASCII (canones-...)
  proyectosMetadataMap.set(slugAscii(p.slug), meta);
}

function getProjectMeta(slug: string): ProjectMeta | undefined {
  return (
    proyectosMetadataMap.get(slug) ||
    proyectosMetadataMap.get(normalizeSlug(slug)) ||
    proyectosMetadataMap.get(slugAscii(slug))
  );
}

export async function generateMetadata({
  params,
}: ProjectLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getProjectMeta(slug);

  if (!data) {
    return {
      title: `Proyecto no encontrado | ${BRAND_NAME}`,
      description:
        "El proyecto que buscas no está disponible. Revisa nuestros proyectos y lotes en Ayacucho (Qorihuillca y alrededores).",
      alternates: { canonical: `${SITE_URL}/inmuebles#proyectos` },
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
  // ✅ genera rutas SOLO con el slug original del JSON
  return proyectosJson.map((p) => ({ slug: p.slug }));
}

function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { slug } = await params;
  const data = getProjectMeta(slug);

  const canonical = data?.canonical ?? `${SITE_URL}/proyectos/${slug}`;
  const imageUrl = data?.image ? `${SITE_URL}${data.image}` : FALLBACK_OG;

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
      { "@type": "ListItem", position: 1, name: BRAND_NAME, item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Proyectos",
        item: `${SITE_URL}/inmuebles#proyectos`,
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
          address: {
            "@type": "PostalAddress",
            streetAddress: "Jr. Quinua N° 570",
            addressLocality: "Huamanga",
            addressRegion: "Ayacucho",
            addressCountry: "PE",
          },
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