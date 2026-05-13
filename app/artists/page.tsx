import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SEED_ARTISTS, SEED_ARTWORKS } from '@/lib/seed-data'

export const metadata: Metadata = {
  title: 'Our Artists',
  description:
    'Browse all artists on Artkindred. Discover talented painters, photographers, sculptors, and print artists across North Carolina.',
  alternates: { canonical: '/artists' }
}

export default function ArtistsPage() {
  const published = SEED_ARTISTS.filter((a) => a.is_published)

  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-white min-h-screen">
        <div className="container py-10 md:py-12">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Our Artists</h1>
            <p className="text-lg text-gray-600">
              {published.length} artists creating work across North Carolina
            </p>
          </header>

          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {published.map((artist, idx) => {
              const workCount = SEED_ARTWORKS.filter((a) => a.artist_id === artist.id).length
              return (
                <li key={artist.id}>
                  <Link
                    href={`/artist/${artist.id}`}
                    className="card p-5 hover:shadow-lg transition-shadow block h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
                      <Image
                        src={artist.profile_photo_url}
                        alt={`Portrait of ${artist.name}`}
                        fill
                        priority={idx < 3}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-bold mb-2">{artist.name}</h2>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{artist.bio}</p>
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <MapPin size={12} aria-hidden="true" />
                      {artist.location}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-medium">
                        {artist.mediums.slice(0, 2).join(' · ')}
                      </span>
                      <span className="text-blue-600 font-semibold">
                        {workCount} {workCount === 1 ? 'work' : 'works'}
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  )
}
