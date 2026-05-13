import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { DiscoverClient } from './_components/discover-client'
import { SEED_ARTWORKS } from '@/lib/seed-data'

const SITE_URL = 'https://artkindred.vercel.app'

export const metadata: Metadata = {
  title: 'Discover Art',
  description:
    'Browse and filter artworks by category, price, color, and medium. Find paintings, prints, photography, and sculpture from North Carolina artists.',
  alternates: { canonical: '/discover' },
  openGraph: {
    title: 'Discover Art on Artkindred',
    description:
      'Browse and filter artworks by category, price, color, and medium from emerging artists.',
    url: `${SITE_URL}/discover`,
    type: 'website'
  }
}

export default function DiscoverPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Available artworks',
    itemListElement: SEED_ARTWORKS.filter((a) => a.status === 'published').map(
      (artwork, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/artwork/${artwork.slug}`,
        name: artwork.title
      })
    )
  }

  return (
    <>
      <Navigation />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <main id="main-content" className="bg-white min-h-screen">
        <DiscoverClient />
      </main>
      <Footer />
    </>
  )
}
