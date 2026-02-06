// app/sitemap.ts
import type { MetadataRoute } from "next";
import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://www.casagrande-inmobilaria.com";

// Helpers seguros para leer JSON local (no rompe build si falta un archivo)
async function readJsonFile<T>(relativeFilePath: string, fallback: T): Promise<T> {
  try {
    const fullPath = path.join(process.cwd(), relativeFilePath);
    const content = await fs.readFile(fullPath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

// Ajusta estos tipos según tu JSON real
type PropiedadItem = {
  slug?: string;
  id?: string;
  title?: string;
};

type ProyectoItem = {
  slug?: string;
  id?: string;
  title?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ✅ Static routes (según tu estructura)
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/inmuebles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/venta-terreno`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9, // página de captación (intermediación)
    },
    {
      url: `${SITE_URL}/alquileres`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/ganadinero`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  /**
   * ✅ DYNAMIC: /propiedades/[slug]
   * Lee: app/data/propiedades.json  (según tu repo)
   *
   * IMPORTANTE:
   * - Tu JSON debe contener "slug" por cada propiedad.
   * - Si tu JSON usa otro campo, cámbialo aquí.
   */
  const propiedades = await readJsonFile<PropiedadItem[]>(
    "app/data/propiedades.json",
    []
  );

  const propiedadesUrls: MetadataRoute.Sitemap = propiedades
    .map((p) => p.slug || p.id)
    .filter(Boolean)
    .map((slug) => ({
      url: `${SITE_URL}/propiedades/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  /**
   * ✅ DYNAMIC: /proyectos/[slug]
   * Lee: app/data/proyectos.json  (si existe)
   *
   * Si todavía no tienes proyectos.json, no pasa nada: quedará vacío.
   */
  const proyectos = await readJsonFile<ProyectoItem[]>(
    "app/data/proyectos.json",
    []
  );

  const proyectosUrls: MetadataRoute.Sitemap = proyectos
    .map((p) => p.slug || p.id)
    .filter(Boolean)
    .map((slug) => ({
      url: `${SITE_URL}/proyectos/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.82,
    }));

  return [...staticUrls, ...propiedadesUrls, ...proyectosUrls];
}
