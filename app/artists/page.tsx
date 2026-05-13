'use client'

import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SEED_ARTISTS } from '@/lib/seed-data'

export default function ArtistsPage() {
  return (
    <>
      <Navigation />
      <main className="bg-white">
        <div className="container py-12">
          <h1 className="text-4xl font-bold mb-4">Our Artists</h1>
          <p className="text-xl text-gray-600 mb-12">
            Discover talented artists from North Carolina
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SEED_ARTISTS.map((artist) => (
              <Link
                key={artist.id}
                href={`/artist/${artist.id}`}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <img
                  src={artist.profile_photo_url}
                  alt={artist.name}
                  className="w-full h-56 rounded-lg object-cover mb-4"
                />
                <h3 className="text-xl font-bold mb-2">{artist.name}</h3>
                <p className="text-gray-600 mb-3">{artist.bio}</p>
                <p className="text-sm text-gray-500 mb-4">{artist.location}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
