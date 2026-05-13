import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Mail, ExternalLink, MapPin } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SEED_ARTISTS, SEED_ARTWORKS } from '@/lib/seed-data'
import { FavoriteArtistButton } from './_components/favorite-artist-button'

const SITE_URL = 'https://artkindred.vercel.app'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return SEED_ARTISTS.map((a) => ({ id: a.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const artist = SEED_ARTISTS.find((a) => a.id === id)
  if (!artist) {
    return { title: 'Artist not found' }
  }
  const title = `${artist.name} — Artist on Artkindred`
  const description = `${artist.bio} Based in ${artist.location}. Working in ${artist.mediums.join(', ')}.`

  return {
    title,
    description,
    alternates: { canonical: `/artist/${artist.id}` },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${SITE_URL}/artist/${artist.id}`,
      images: [
        {
          url: artist.profile_photo_url,
          width: 400,
          height: 400,
          alt: `Portrait of ${artist.name}`
        }
      ]
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [artist.profile_photo_url]
    }
  }
}

export default async function ArtistPage({ params }: Props) {
  const { id } = await params
  const artist = SEED_ARTISTS.find((a) => a.id === id)

  if (!artist) {
    notFound()
  }

  const artistWorks = SEED_ARTWORKS.filter((a) => a.artist_id === artist.id)

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/artist/${artist.id}`,
    name: artist.name,
    description: artist.bio,
    image: artist.profile_photo_url,
    url: `${SITE_URL}/artist/${artist.id}`,
    sameAs: artist.website ? [artist.website] : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: artist.location.split(',')[0]?.trim(),
      addressRegion: 'NC',
      addressCountry: 'US'
    },
    jobTitle: 'Visual Artist',
    knowsAbout: artist.mediums
  }

  return (
    <>
      <Navigation />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <main id="main-content" className="bg-white">
        <section
          aria-labelledby="artist-name"
          className="bg-gradient-to-r from-blue-50 to-purple-50 py-10 md:py-14"
        >
          <div className="container">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden shadow-lg bg-gray-100 flex-shrink-0">
                <Image
                  src={artist.profile_photo_url}
                  alt={`Portrait of ${artist.name}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 10rem, 12rem"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3 gap-4">
                  <div>
                    <h1 id="artist-name" className="text-3xl md:text-4xl font-bold">
                      {artist.name}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <MapPin size={14} aria-hidden="true" />
                      {artist.location}
                    </p>
                  </div>
                  <FavoriteArtistButton artistId={artist.id} artistName={artist.name} />
                </div>

                <p className="text-lg text-gray-700 mb-6 max-w-3xl">{artist.bio}</p>

                <dl className="grid sm:grid-cols-2 gap-4 mb-6 text-sm max-w-xl">
                  <div>
                    <dt className="text-gray-600 mb-1">Mediums</dt>
                    <dd className="font-semibold">{artist.mediums.join(', ')}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600 mb-1">Works available</dt>
                    <dd className="font-semibold">{artistWorks.length} {artistWorks.length === 1 ? 'piece' : 'pieces'}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-gray-600 mb-1">Price range</dt>
                    <dd className="font-semibold">
                      ${artist.price_range_min.toLocaleString()} – ${artist.price_range_max.toLocaleString()}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:hello@artkindred.com?subject=Question about ${encodeURIComponent(artist.name)}`}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Mail size={18} aria-hidden="true" />
                    Contact artist
                  </a>
                  {artist.website && (
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline inline-flex items-center gap-2"
                    >
                      <ExternalLink size={18} aria-hidden="true" />
                      Personal website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="artist-statement"
          className="container py-10 md:py-12 border-b"
        >
          <h2 id="artist-statement" className="text-xl md:text-2xl font-bold mb-4">
            About their work
          </h2>
          <blockquote className="text-lg text-gray-700 leading-relaxed italic max-w-3xl border-l-4 border-blue-200 pl-4">
            {artist.artist_statement}
          </blockquote>
        </section>

        <section aria-labelledby="artist-works" className="container py-10 md:py-12">
          <h2 id="artist-works" className="text-2xl md:text-3xl font-bold mb-6">
            Works by {artist.name}
          </h2>

          {artistWorks.length === 0 ? (
            <p className="text-gray-600">No works available yet — check back soon.</p>
          ) : (
            <ul className="grid_auto" role="list">
              {artistWorks.map((artwork) => (
                <li key={artwork.id}>
                  <Link
                    href={`/artwork/${artwork.slug}`}
                    className="card overflow-hidden hover:shadow-lg transition-shadow block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <div className="relative bg-gray-100 aspect-[4/3]">
                      <Image
                        src={artwork.image_urls[0]}
                        alt={`${artwork.title} — ${artwork.category}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{artwork.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 capitalize">{artwork.category} · {artwork.medium}</p>
                      <p className="text-xl font-bold text-blue-600">${artwork.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
