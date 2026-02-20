// app/layout.tsx
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import FloatingButtons from "./floating-buttons";
import "./globals.css";

const font = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});

// ✅ Config central (fácil de mantener)
const companyInfo = {
  name: "Casagrande Bienes y Raíces",
  legalName: "Casagrande Bienes y Raíces",
  alternateName: "Casagrande Inmobiliaria Ayacucho",
  description:
    "Casagrande Bienes y Raíces: venta de terrenos y lotes en Ayacucho (Huamanga) con proyectos en Ccorihuillca/Qorihuillca. Asesoría completa y procesos seguros. Más de 400 lotes vendidos. Ideal para vivienda, casa de campo o inversión.",

  // ✅ Tu dominio real
  url: "https://www.casagrande-inmobilaria.com",

  // ✅ Mejor: usar rutas relativas y que Next las resuelva con metadataBase
  logoPath: "/logo.svg",
  ogImagePath: "/hero01.webp",

  phone: "+51916194372",
  email: "u19217724@gmail.com",

  address: {
    street: "Jr. Quinua N° 570",
    city: "Huamanga",
    region: "Ayacucho",
    postalCode: "05003",
    country: "PE",
  },

  coordinates: {
    latitude: -13.155749,
    longitude: -74.220991,
  },

  socialMedia: {
    facebook: "https://www.facebook.com/Casagrande.Bienes.R",
    instagram: "https://www.instagram.com/casagrandeinmobilaria/",
    tiktok: "https://www.tiktok.com/@casagrandeinmb.24",
    linkedin: "https://www.linkedin.com/company/casagrande-bienes-y-raices/",
  },

  openingHours: {
    opens: "09:00",
    closes: "18:30",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },

  pages: {
    home: "/",
    inmuebles: "/inmuebles",
    proyectos: "/proyectos",
    propiedades: "/propiedades",
    ventaTerreno: "/venta-terreno",
    nosotros: "/nosotros",
    contacto: "/contacto",
  },
};

// ✅ helpers (URLs absolutas consistentes)
const abs = (path: string) => `${companyInfo.url}${path.startsWith("/") ? path : `/${path}`}`;

// ✅ JSON-LD (Entidad + SEO Local)
// ⚠️ NO uses hashes (#proyectos/#propiedades) en OfferCatalog, Google los ignora.
// Mejor enlazar a rutas reales: /proyectos y /propiedades
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${companyInfo.url}#real-estate-agent`,

  name: companyInfo.name,
  legalName: companyInfo.legalName,
  alternateName: companyInfo.alternateName,
  description: companyInfo.description,
  url: companyInfo.url,

  logo: {
    "@type": "ImageObject",
    url: abs(companyInfo.logoPath),
    width: "512",
    height: "512",
  },

  image: [abs(companyInfo.logoPath), abs(companyInfo.ogImagePath)],

  telephone: companyInfo.phone,
  email: companyInfo.email,

  address: {
    "@type": "PostalAddress",
    streetAddress: companyInfo.address.street,
    addressLocality: companyInfo.address.city,
    addressRegion: companyInfo.address.region,
    postalCode: companyInfo.address.postalCode,
    addressCountry: companyInfo.address.country,
  },

  geo: {
    "@type": "GeoCoordinates",
    latitude: companyInfo.coordinates.latitude,
    longitude: companyInfo.coordinates.longitude,
  },

  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: companyInfo.phone,
      contactType: "sales",
      areaServed: "PE-AYA",
      availableLanguage: ["es"],
    },
  ],

  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: companyInfo.openingHours.days,
      opens: companyInfo.openingHours.opens,
      closes: companyInfo.openingHours.closes,
    },
  ],

  areaServed: [
    { "@type": "AdministrativeArea", name: "Ayacucho" },
    { "@type": "City", name: "Huamanga" },
  ],

  sameAs: Object.values(companyInfo.socialMedia),

  knowsAbout: [
    "inmobiliaria en Ayacucho",
    "terrenos en Ayacucho",
    "lotes en Ayacucho",
    "terrenos en Ccorihuillca",
    "lotes en Qorihuillca",
    "compra y venta de terrenos",
    "inversión en terrenos",
    "valorización de lotes",
    "documentación de terrenos",
  ],

  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Inmuebles, proyectos y venta de terrenos en Ayacucho",
    itemListElement: [
      {
        "@type": "Offer",
        url: abs(companyInfo.pages.ventaTerreno),
        itemOffered: {
          "@type": "Service",
          name: "Venta de terrenos y lotes en Ayacucho",
          description:
            "Terrenos y lotes en Ayacucho (Huamanga) con asesoría completa, procesos seguros y acompañamiento durante la compra.",
          provider: { "@type": "Organization", name: companyInfo.name },
        },
      },
      {
        "@type": "Offer",
        url: abs(companyInfo.pages.inmuebles),
        itemOffered: {
          "@type": "Service",
          name: "Inmuebles en Ayacucho",
          description: "Explora proyectos y propiedades disponibles en Ayacucho.",
          provider: { "@type": "Organization", name: companyInfo.name },
        },
      },
      {
        "@type": "Offer",
        url: abs(companyInfo.pages.proyectos),
        itemOffered: {
          "@type": "Service",
          name: "Proyectos inmobiliarios en Ayacucho",
          description:
            "Proyectos de lotes/terrenos con alta proyección de valorización en Ayacucho (incluye Ccorihuillca/Qorihuillca).",
          provider: { "@type": "Organization", name: companyInfo.name },
        },
      },
      {
        "@type": "Offer",
        url: abs(companyInfo.pages.propiedades),
        itemOffered: {
          "@type": "Service",
          name: "Propiedades disponibles en Ayacucho",
          description:
            "Listado de propiedades e inmuebles disponibles para compra en Ayacucho.",
          provider: { "@type": "Organization", name: companyInfo.name },
        },
      },
    ],
  },

  foundingDate: "2023",

  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": abs(companyInfo.pages.home),
  },
};

// ✅ Metadata global mejorado:
// - metadataBase + alternates OK
// - OpenGraph/Twitter usan rutas relativas (Next las vuelve absolutas)
// - keywords (ayuda un poco, no es magia)
// - verification listo para Search Console (si lo tienes)
export const metadata: Metadata = {
  metadataBase: new URL(companyInfo.url),

  title: {
    default:
      "Casagrande Bienes y Raíces | Terrenos y Lotes en Ayacucho (Ccorihuillca)",
    template: "%s | Casagrande Bienes y Raíces",
  },

  description: companyInfo.description,

  keywords: [
    "terrenos en ayacucho",
    "lotes en ayacucho",
    "inmobiliaria ayacucho",
    "terrenos en huamanga",
    "lotes en qorihuillca",
    "ccorihuillca",
    "casa de campo ayacucho",
    "inversión en terrenos",
    "casagrande bienes y raíces",
  ],

  applicationName: companyInfo.name,
  authors: [{ name: companyInfo.name }],
  creator: companyInfo.name,
  publisher: companyInfo.name,
  category: "Real Estate",
  classification:
    "Inmobiliaria – Venta de terrenos, lotes e inmuebles en Ayacucho (Huamanga)",

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

  // ✅ Si ya tienes token de Search Console:
  // verification: { google: "TU_TOKEN_REAL" },

  alternates: {
    canonical: companyInfo.url,
    languages: {
      "es-PE": companyInfo.url,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  manifest: "/site.webmanifest",

  openGraph: {
    type: "website",
    locale: "es_PE",
    url: companyInfo.url,
    siteName: companyInfo.name,
    title:
      "Casagrande Bienes y Raíces | Terrenos y Lotes en Ayacucho (Ccorihuillca)",
    description:
      "Terrenos y lotes en Ayacucho (Huamanga) con proyectos en Ccorihuillca/Qorihuillca. Compra segura con asesoría completa y alta proyección de valorización.",
    emails: [companyInfo.email],
    phoneNumbers: [companyInfo.phone],
    images: [
      {
        url: companyInfo.ogImagePath, // relativo -> absoluto por metadataBase
        width: 1200,
        height: 630,
        alt: "Casagrande Bienes y Raíces - Terrenos y Lotes en Ayacucho",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Casagrande Bienes y Raíces | Terrenos y Lotes en Ayacucho (Ccorihuillca)",
    description:
      "Venta de terrenos y lotes en Ayacucho (Ccorihuillca/Qorihuillca) para vivienda o inversión. Acompañamiento y procesos seguros.",
    images: [companyInfo.ogImagePath],
  },

  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: companyInfo.name,
  },

  other: {
    "msapplication-TileColor": "#2d89ef",
    "theme-color": "#ffffff",
  },
};

function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify directo es OK; si quieres “limpio”, puedes hacer JSON.parse(JSON.stringify())
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-PE" suppressHydrationWarning className={font.variable}>
      <head>
        <StructuredData />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>

      <body className={`${font.className} antialiased`}>
        {children}
        <FloatingButtons />

        {/* ✅ GA solo aquí (como ya lo tienes) */}
        <GoogleAnalytics gaId="G-9GG0X367Q4" />
      </body>
    </html>
  );
}