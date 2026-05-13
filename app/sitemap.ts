import { MetadataRoute } from 'next'
import { SEED_ARTWORKS, SEED_ARTISTS } from '@/lib/seed-data'

const BASE_URL = 'https://artkindred.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/discover`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/artists`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/onboarding`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/recommended`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/artist-info`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/artist-login`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 }
  ]

  const artworkPages: MetadataRoute.Sitemap = SEED_ARTWORKS
    .filter(a => a.status === 'published')
    .map(a => ({
      url: `${BASE_URL}/artwork/${a.slug}`,
      lastModified: new Date(a.updated_at),
      changeFrequency: 'weekly',
      priority: 0.8
    }))

  const artistPages: MetadataRoute.Sitemap = SEED_ARTISTS
    .filter(a => a.is_published)
    .map(a => ({
      url: `${BASE_URL}/artist/${a.id}`,
      lastModified: new Date(a.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7
    }))

  return [...staticPages, ...artworkPages, ...artistPages]
}
