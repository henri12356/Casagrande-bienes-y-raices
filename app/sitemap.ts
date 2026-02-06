import { MetadataRoute } from 'next'

// Datos de servicios y proyectos (puedes mover esto a una base de datos después)
const serviciosSlugs = [
  'geotecnia',
  'geologia', 
  'estudio-de-suelos',
  'laboratorio-de-suelo',
  'ensayo-de-campo',
  'geofisica',
  'geomecanica',
  'hidrogeologia',
  'control-de-calidad'
]

const proyectosSlugs = [
  'aeropuerto-internacional-jorge-chavez',
  'hospital-nacional',
  'carretera-interoceanica',
  'metro-de-lima',
  'presa-hidroelectrica',
  'edificio-corporativo',
  'centro-comercial'
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.casagrandegeotecnia.com.pe'
  
  // URLs de servicios individuales
  const servicioUrls = serviciosSlugs.map((slug) => ({
    url: `${baseUrl}/servicios/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // URLs de proyectos individuales
  const proyectosUrls = proyectosSlugs.map((slug) => ({
    url: `${baseUrl}/proyectos/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // URLs estáticas principales
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const, // Cambiado de yearly a monthly
      priority: 1.0,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/proyectos`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8, // Aumentado de 0.7 a 0.8
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7, // Aumentado para importancia SEO local
    }
  ]

  return [...staticUrls, ...servicioUrls, ...proyectosUrls]
}