import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SEED_ARTWORKS, SEED_ARTISTS } from '@/lib/seed-data'
import { ArtworkActions } from './_components/artwork-actions'
import { PricingBreakdown } from './_components/pricing-breakdown'

const SITE_URL = 'https://artkindred.vercel.app'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return SEED_ARTWORKS.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artwork = SEED_ARTWORKS.find((a) => a.slug === slug)
  if (!artwork) {
    return { title: 'Artwork not found' }
  }
  const artist = SEED_ARTISTS.find((a) => a.id === artwork.artist_id)
  const title = `${artwork.title} by ${artist?.name ?? 'Artist'}`
  const description = `${artwork.title} — ${artwork.medium}, ${artwork.dimensions}. ${artwork.description.slice(0, 140)}`

  return {
    title,
    description,
    alternates: { canonical: `/artwork/${artwork.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${SITE_URL}/artwork/${artwork.slug}`,
      images: [
        {
          url: artwork.image_urls[0],
          width: 1200,
          height: 1200,
          alt: `${artwork.title} by ${artist?.name ?? 'Artist'}`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [artwork.image_urls[0]]
    }
  }
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params
  const artwork = SEED_ARTWORKS.find((a) => a.slug === slug)

  if (!artwork) {
    notFound()
  }

  const artist = SEED_ARTISTS.find((a) => a.id === artwork.artist_id)

  // JSON-LD: Product schema for SEO + rich results
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: artwork.title,
    description: artwork.description,
    image: artwork.image_urls,
    sku: artwork.id,
    brand: artist ? { '@type': 'Person', name: artist.name } : undefined,
    category: artwork.category,
    material: artwork.medium,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/artwork/${artwork.slug}`,
      priceCurrency: 'USD',
      price: artwork.price,
      availability:
        artwork.quantity_available > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: artist
        ? { '@type': 'Person', name: artist.name }
        : { '@type': 'Organization', name: 'Artkindred' }
    }
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Discover',
        item: `${SITE_URL}/discover`
      },
      artist && {
        '@type': 'ListItem',
        position: 2,
        name: artist.name,
        item: `${SITE_URL}/artist/${artist.id}`
      },
      {
        '@type': 'ListItem',
        position: artist ? 3 : 2,
        name: artwork.title
      }
    ].filter(Boolean)
  }

  return (
    <>
      <Navigation />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main id="main-content" className="bg-white">
        <div className="container py-8 md:py-12">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm">
            <ol className="flex flex-wrap items-center gap-1 text-gray-600" role="list">
              <li>
                <Link href="/discover" className="hover:text-blue-600 hover:underline">
                  Discover
                </Link>
              </li>
              {artist && (
                <>
                  <li aria-hidden="true">
                    <ChevronRight size={14} className="text-gray-400" />
                  </li>
                  <li>
                    <Link
                      href={`/artist/${artist.id}`}
                      className="hover:text-blue-600 hover:underline"
                    >
                      {artist.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">
                <ChevronRight size={14} className="text-gray-400" />
              </li>
              <li aria-current="page" className="text-gray-900 font-medium">
                {artwork.title}
              </li>
            </ol>
          </nav>

          <article className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
            <div>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <Image
                  src={artwork.image_urls[0]}
                  alt={`${artwork.title} — a ${artwork.category} by ${artist?.name ?? 'the artist'}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 border-b pb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">by</p>
                  {artist && (
                    <Link
                      href={`/artist/${artist.id}`}
                      className="inline-block text-2xl font-bold hover:text-blue-600 transition-colors"
                    >
                      {artist.name}
                    </Link>
                  )}
                  {artist && (
                    <p className="text-sm text-gray-600 mt-1">{artist.location}</p>
                  )}
                </div>
              </div>

              <header>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{artwork.title}</h1>
                <p className="text-base text-gray-700 leading-relaxed">{artwork.description}</p>
              </header>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 bg-gray-50 p-4 rounded-lg text-sm">
                <div>
                  <dt className="text-gray-600">Category</dt>
                  <dd className="font-semibold capitalize">{artwork.category}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Medium</dt>
                  <dd className="font-semibold">{artwork.medium}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Dimensions</dt>
                  <dd className="font-semibold">{artwork.dimensions}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Year</dt>
                  <dd className="font-semibold">{artwork.year_created}</dd>
                </div>
                {artwork.edition_type === 'limited' && artwork.edition_size && (
                  <div>
                    <dt className="text-gray-600">Edition</dt>
                    <dd className="font-semibold">
                      {artwork.edition_number}/{artwork.edition_size}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-600">Condition</dt>
                  <dd className="font-semibold">{artwork.condition}</dd>
                </div>
                {artwork.has_coa && (
                  <div className="col-span-2">
                    <dt className="text-gray-600">Authenticity</dt>
                    <dd className="font-semibold text-green-700">
                      ✓ Certificate of Authenticity included
                    </dd>
                  </div>
                )}
              </dl>

              <PricingBreakdown
                artworkPrice={artwork.price}
                shippingPrice={artwork.shipping_price}
              />


              <ArtworkActions artwork={artwork} artist={artist ?? null} />

              <p
                className={`p-3 rounded-lg border text-sm font-medium ${
                  artwork.quantity_available > 0
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
                aria-live="polite"
              >
                {artwork.quantity_available > 0
                  ? `✓ ${artwork.quantity_available} available — ships from ${artist?.location ?? 'North Carolina'}`
                  : 'Currently sold out'}
              </p>
            </div>
          </article>

          {artist && (
            <section aria-labelledby="about-artist" className="border-t pt-12">
              <h2 id="about-artist" className="text-2xl md:text-3xl font-bold mb-6">
                About the Artist
              </h2>
              <div className="card p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={artist.profile_photo_url}
                    alt={`Portrait of ${artist.name}`}
                    fill
                    sizes="(max-width: 768px) 8rem, 12rem"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{artist.name}</h3>
                  <p className="text-gray-700 mb-3">{artist.bio}</p>
                  <blockquote className="text-gray-700 mb-4 italic border-l-4 border-blue-200 pl-4">
                    {artist.artist_statement}
                  </blockquote>
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-semibold">Based in:</span> {artist.location}
                  </p>
                  <Link href={`/artist/${artist.id}`} className="btn-primary">
                    View all works by {artist.name}
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
