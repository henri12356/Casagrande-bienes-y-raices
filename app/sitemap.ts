// app/sitemap.ts
import type { MetadataRoute } from "next";

/**
 * Sitemap para: https://www.casagrande-inmobiliaria.com/
 * Incluye:
 * - Home
 * - Inmuebles (y ancla #proyectos SOLO como referencia; NO se agrega al sitemap porque Google ignora hashes)
 * - Listados /proyectos y /propiedades
 * - Detalles dinámicos /proyectos/[slug] y /propiedades/[slug]
 */

// ✅ Dominio real
const baseUrl = "https://www.casagrande-inmobiliaria.com/";

/**
 * ⚠️ Nota:
 * Google NO indexa anchors (#proyectos) como URL separada.
 * Así que NO tiene sentido meter `/inmuebles#proyectos` en el sitemap.
 * Lo correcto es incluir `/inmuebles` y las rutas reales.
 */

// ✅ Slugs de proyectos (pon aquí los reales)
const proyectosSlugs = [
  "cañones-ayacucho-qorihuillca",
  // agrega los demás:
  // "villa-sol-2-qorihuillca",
  // "la-florencia-qorihuillca",
];

// ✅ Slugs de propiedades (pon aquí los reales)
const propiedadesSlugs = [
  "machayhuycco-ayacucho",
  "bungavilia-ayacucho",
  "huanupata",
  // agrega los demás...
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ✅ URLs estáticas principales (ajusta según tu app)
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/inmuebles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/proyectos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    // Si existen en tu web, descomenta:
    {
      url: `${baseUrl}/nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // {
    //   url: `${baseUrl}/contacto`,
    //   lastModified: now,
    //   changeFrequency: "monthly",
    //   priority: 0.7,
    // },
    // {
    //   url: `${baseUrl}/blog`,
    //   lastModified: now,
    //   changeFrequency: "weekly",
    //   priority: 0.6,
    // },
  ];

  // ✅ Detalles de proyectos: /proyectos/[slug]
  const proyectosUrls: MetadataRoute.Sitemap = proyectosSlugs.map((slug) => ({
    // Next/Google lo manejarán URL-encoded (ñ -> %C3%B1) automáticamente
    url: `${baseUrl}/proyectos/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // ✅ Detalles de propiedades: /propiedades/[slug]
  const propiedadesUrls: MetadataRoute.Sitemap = propiedadesSlugs.map(
    (slug) => ({
      url: `${baseUrl}/propiedades/${encodeURIComponent(slug)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    })
  );

  return [...staticUrls, ...proyectosUrls, ...propiedadesUrls];
}