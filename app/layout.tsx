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


const companyInfo = {
  name: "Casagrande Bienes y Raíces",
  legalName: "Casagrande Bienes y Raíces",
  alternateName: "Casagrande Inmobiliaria Ayacucho",
  description:
    "Casagrande Bienes y Raíces: venta de terrenos y lotes en Ayacucho (Huamanga) con proyectos en Ccorihuillca/Qorihuillca. Asesoría completa y procesos seguros. Más de 400 lotes vendidos. Ideal para vivienda, casa de campo o inversión.",

  // ✅ Tu dominio real
  url: "https://www.casagrande-inmobilaria.com",

  // ⚠️ Ajusta si tu logo está en otra ruta (ideal: /logo.svg o /logo.png)
  logo: "https://www.casagrande-inmobilaria.com/logo.svg",

  phone: "+51916194372",
  email: "u19217724@gmail.com",

  address: {
    street: "Jirón Quinua 570",
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
    proyectosHash: "/inmuebles#proyectos",
    propiedadesHash: "/inmuebles#propiedades",
    ventaTerreno: "/venta-terreno",
    nosotros: "/nosotros",
  },
};

// ✅ JSON-LD (Entidad + SEO Local + ofertas apuntando a tus URLs reales)
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
    url: companyInfo.logo,
    width: "512",
    height: "512",
  },

  image: [
    companyInfo.logo,
    `${companyInfo.url}/og-image.jpg`,
    `${companyInfo.url}/assets/terrenos-ayacucho.jpg`,
  ],

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

  // ✅ “Catálogo” enlazado a tus páginas reales
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Inmuebles, proyectos y venta de terrenos en Ayacucho",
    itemListElement: [
      {
        "@type": "Offer",
        url: `${companyInfo.url}${companyInfo.pages.ventaTerreno}`,
        itemOffered: {
          "@type": "Service",
          name: "Venta de terrenos y lotes en Ayacucho",
          description:
            "Terrenos y lotes en Ayacucho (Huamanga) con asesoría completa, procesos seguros y acompañamiento en todo el proceso.",
          provider: { "@type": "Organization", name: companyInfo.name },
        },
      },
      {
        "@type": "Offer",
        url: `${companyInfo.url}${companyInfo.pages.inmuebles}`,
        itemOffered: {
          "@type": "Service",
          name: "Inmuebles en Ayacucho (proyectos y propiedades)",
          description:
            "Explora proyectos e inmuebles disponibles en Ayacucho. Opciones para vivienda, casa de campo e inversión.",
          provider: { "@type": "Organization", name: companyInfo.name },
        },
      },
      {
        "@type": "Offer",
        url: `${companyInfo.url}${companyInfo.pages.proyectosHash}`,
        itemOffered: {
          "@type": "Service",
          name: "Proyectos inmobiliarios en Ayacucho",
          description:
            "Proyectos de lotes/terrenos con proyección de valorización en Ayacucho (incluye zona Ccorihuillca/Qorihuillca).",
          provider: { "@type": "Organization", name: companyInfo.name },
        },
      },
      {
        "@type": "Offer",
        url: `${companyInfo.url}${companyInfo.pages.propiedadesHash}`,
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
    "@id": `${companyInfo.url}${companyInfo.pages.home}`,
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(companyInfo.url),

  title: {
    default:
      "Casagrande Bienes y Raíces | Terrenos y Lotes en Ayacucho (Ccorihuillca)",
    template: "%s | Casagrande Bienes y Raíces",
  },

  description: companyInfo.description,

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

  // ✅ Search Console usa un token distinto a GA4.
  // verification: { google: "TU_TOKEN_REAL_DE_SEARCH_CONSOLE" },

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
        url: `${companyInfo.url}/og-image.jpg`,
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
    images: [`${companyInfo.url}/og-image.jpg`],
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
        <GoogleAnalytics gaId="G-7TJCWC5JMR" />
      </body>
    </html>
  );
}
