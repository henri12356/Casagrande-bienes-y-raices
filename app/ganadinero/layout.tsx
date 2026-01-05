import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Empresa de Geotecnia | geotecnia peru  ",
  description: "Consultora especializada en ingeniería geotécnica con más de 6 años de experiencia. Equipo de ingenieros certificados, laboratorio propio y certificaciones ISO 9001, 14001 y 37001.",
  

  authors: [{ name: "Casagrande Geotecnia" }],
  creator: "Casagrande Geotecnia",
  publisher: "Casagrande Geotecnia",
  
  openGraph: {
    title: "Casagrande Geotecnia - Trayectoria y Equipo Profesional",
    description: "Más de 6 años brindando soluciones geotécnicas en Perú. Equipo de ingenieros especializados, laboratorio certificado y compromiso con la excelencia.",
    type: "website",
    url: "https://www.casagrandegeotecnia.com.pe/nosotros",
    images: [
      {
        url: "https://www.casagrandegeotecnia.com.pe/valores.webp",
        width: 1200,
        height: 630,
        alt: "Equipo Casagrande Geotecnia - Expertos en Estudios Geotécnicos",
      },
    ],
    siteName: "Casagrande Geotecnia",
    locale: "es_PE",
    emails: ["comercial@casagrandegeotecnia.com.pe"],
    phoneNumbers: ["+51962835652"],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Nosotros | Casagrande Geotecnia - Expertos en Geotecnia",
    description: "Equipo de ingenieros geotécnicos con experiencia en proyectos de construcción e infraestructura en todo el Perú.",
    images: ["https://www.casagrandegeotecnia.com.pe/valores.webp"],
    site: "@CasagrandeGeo",
    creator: "@CasagrandeGeo",
  },
  
  alternates: {
    canonical: "https://www.casagrandegeotecnia.com.pe/nosotros",
    languages: {
      'es-PE': 'https://www.casagrandegeotecnia.com.pe/nosotros',
    },
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  category: 'engineering',
  classification: 'Consultoría en Ingeniería Geotécnica'
};

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <GoogleAnalytics gaId="G-HSYFNDRHDW" />
      
      {/* Schema Markup - AboutPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": "https://www.casagrandegeotecnia.com.pe/nosotros#webpage",
            "name": "Nosotros - Casagrande Geotecnia",
            "description": "Conoce nuestra trayectoria, equipo profesional y compromiso con la excelencia en estudios geotécnicos y consultoría en ingeniería civil",
            "url": "https://www.casagrandegeotecnia.com.pe/nosotros",
            "inLanguage": "es-PE",
            "isPartOf": {
              "@type": "WebSite",
              "url": "https://www.casagrandegeotecnia.com.pe"
            },
            "mainEntity": {
              "@type": "Organization",
              "@id": "https://www.casagrandegeotecnia.com.pe#organization",
              "name": "Casagrande Geotecnia",
              "alternateName": "Casagrande Geotecnia y Concreto",
              "description": "Consultora líder en estudios geotécnicos, mecánica de suelos, laboratorio certificado y control de calidad en construcción. Más de 20 años de experiencia en proyectos en todo el Perú.",
              "foundingDate": "2005", // ⚠️ Confirma el año real de fundación
              "legalName": "Casagrande Geotecnia S.A.C.", // ⚠️ Confirma razón social exacta
              "url": "https://www.casagrandegeotecnia.com.pe",
              "logo": "https://www.casagrandegeotecnia.com.pe/logo.png",
              "image": "https://www.casagrandegeotecnia.com.pe/valores.webp",
              "telephone": "+51962835652",
              "email": "comercial@casagrandegeotecnia.com.pe",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jirón Quinua 570",
                "addressLocality": "Ayacucho",
                "addressRegion": "Ayacucho",
                "postalCode": "05003",
                "addressCountry": "PE"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -13.1631,
                "longitude": -74.2236
              },
              "areaServed": [
                {
                  "@type": "Country",
                  "name": "Perú"
                },
                {
                  "@type": "State",
                  "name": "Lima"
                },
                {
                  "@type": "State",
                  "name": "Arequipa"
                },
                {
                  "@type": "State",
                  "name": "Cusco"
                },
                {
                  "@type": "State",
                  "name": "Ayacucho"
                }
              ],
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "value": "25", // ⚠️ Actualiza con número real
                "minValue": "20",
                "maxValue": "30"
              },
              "knowsAbout": [
                "Estudios Geotécnicos",
                "Mecánica de Suelos",
                "Ingeniería Civil",
                "Laboratorio de Suelos",
                "Geología Aplicada",
                "Estudios de Cimentación",
                "Control de Calidad",
                "Mecánica de Rocas",
                "Hidrogeología",
                "Estudios Geofísicos",
                "Estabilidad de Taludes",
                "Ensayos de Laboratorio"
              ],
              "memberOf": [
                {
                  "@type": "Organization",
                  "name": "Colegio de Ingenieros del Perú",
                  "url": "https://www.cip.org.pe"
                }
              ],
              "hasCredential": [
                {
                  "@type": "EducationalOccupationalCredential",
                  "credentialCategory": "certification",
                  "name": "ISO 9001:2015 - Sistemas de Gestión de Calidad",
                  "recognizedBy": {
                    "@type": "Organization",
                    "name": "International Organization for Standardization"
                  }
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  "credentialCategory": "certification",
                  "name": "ISO 14001:2015 - Sistemas de Gestión Ambiental",
                  "recognizedBy": {
                    "@type": "Organization",
                    "name": "International Organization for Standardization"
                  }
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  "credentialCategory": "certification",
                  "name": "ISO 37001:2016 - Sistemas de Gestión Antisoborno",
                  "recognizedBy": {
                    "@type": "Organization",
                    "name": "International Organization for Standardization"
                  }
                }
              ],
              "slogan": "Cimentando tu confianza con excelencia técnica", // ⚠️ Ajusta según tu slogan real
              "sameAs": [
                "https://www.linkedin.com/company/casagrande-geotecnia-y-concreto/",
                "https://www.facebook.com/profile.php?id=100077864046528",
                "https://www.instagram.com/casagrandegeotecnia/",
                "https://www.youtube.com/@CasagrandeGeotecnia-s5m",
                "https://www.tiktok.com/@casagrandegeotecnia"
              ]
            }
          })
        }}
      />

      {/* Schema para Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://www.casagrandegeotecnia.com.pe"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Nosotros",
                "item": "https://www.casagrandegeotecnia.com.pe/nosotros"
              }
            ]
          })
        }}
      />
    </>
  );
}