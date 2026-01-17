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

// ✅ Datos del negocio (Marca SEO principal)
const companyInfo = {
  name: "Compra y Venta de Terrenos Ayacucho",
  legalName: "Compra y Venta de Terrenos Ayacucho",
  alternateName: "Casagrande Bienes y Raíces",
  description:
    "Compra y venta de terrenos en Ayacucho y lotes en Qorihuillca con asesoría completa y procesos seguros. Más de 400 lotes vendidos en Huamanga – Ayacucho. Ideal para vivienda, casa de campo o inversión.",
  url: "https://www.ayacuchoterrenos.com/", // 👈 CAMBIA ESTO
  logo: "https://www.ayacuchoterrenos.com/logo.svg", // 👈 CAMBIA ESTO
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
    facebook: "https://www.facebook.com/profile.php?id=61584966996472",
    instagram: "https://www.instagram.com/henriinmobiliaria/",
    tiktok: "https://www.tiktok.com/@henriinmobiliaria",
    youtube: "https://www.youtube.com/",
    linkedin: "https://www.linkedin.com/in/henri-avenda%C3%B1o-4bab663a0/",
  },
};

// ✅ Schema.org optimizado para inmobiliaria
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${companyInfo.url}#organization`,
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
  priceRange: "$$",
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
  sameAs: Object.values(companyInfo.socialMedia),
  areaServed: [
    { "@type": "City", name: "Huamanga" },
    { "@type": "City", name: "Ayacucho" },
    { "@type": "Country", name: "Perú" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Compra y venta de terrenos en Ayacucho y servicios inmobiliarios",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Compra y venta de terrenos en Ayacucho",
          description:
            "Terrenos y lotes en Huamanga – Ayacucho (Qorihuillca y alrededores). Opciones para vivienda, casa de campo e inversión.",
          provider: { "@type": "Organization", name: companyInfo.name },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Venta de lotes en Qorihuillca",
          description:
            "Lotes con alto potencial de valorización, accesos vehiculares y entorno natural. Acompañamiento en visita y proceso de compra.",
          provider: { "@type": "Organization", name: companyInfo.name },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Asesoría inmobiliaria y documentación",
          description:
            "Acompañamiento para compra/venta, revisión de documentación, estrategia comercial y soporte legal-comunitario.",
          provider: { "@type": "Organization", name: companyInfo.name },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Lotización, valorización y estrategia de venta",
          description:
            "Asesoría a propietarios: lotización, valorización, documentación y estrategia para vender o alquilar.",
          provider: { "@type": "Organization", name: companyInfo.name },
        },
      },
    ],
  },
  foundingDate: "2023",
  knowsAbout: [
    "compra y venta de terrenos ayacucho",
    "venta de terrenos en Ayacucho",
    "lotes en Ayacucho",
    "terrenos en Qorihuillca",
    "lotes en Qorihuillca",
    "inversión inmobiliaria",
    "valorización de terrenos",
    "lotización",
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Compra y Venta de Terrenos Ayacucho | Lotes en Qorihuillca",
    template: "%s | Compra y Venta de Terrenos Ayacucho",
  },
  description: companyInfo.description,

  authors: [{ name: companyInfo.name }],
  creator: companyInfo.name,
  publisher: companyInfo.name,
  category: "Real Estate",
  classification: "Inmobiliaria – Compra y venta de terrenos y lotes en Ayacucho",

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

  // ⚠️ Esto NO es verificación de Search Console (ese token es distinto).
  verification: {
    google: "G-7TJCWC5JMR",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
    title: "Compra y Venta de Terrenos Ayacucho | Lotes en Qorihuillca",
    description:
      "Compra terrenos en Ayacucho y lotes en Qorihuillca con asesoría completa. Opciones para vivienda, casa de campo e inversión con alta valorización.",
    emails: [companyInfo.email],
    phoneNumbers: [companyInfo.phone],
    images: [
      {
        url: `${companyInfo.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Compra y Venta de Terrenos Ayacucho - Lotes en Qorihuillca",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Compra y Venta de Terrenos Ayacucho | Lotes en Qorihuillca",
    description:
      "Terrenos y lotes en Ayacucho (Qorihuillca) para vivienda o inversión. Acompañamiento y procesos seguros.",
    images: [`${companyInfo.url}/og-image.jpg`],
  },

  alternates: {
    canonical: companyInfo.url,
    languages: {
      "es-PE": companyInfo.url,
    },
  },

  metadataBase: new URL(companyInfo.url),

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
