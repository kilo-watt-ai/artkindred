'use client'

import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SEED_ARTISTS, SEED_ARTWORKS } from '@/lib/seed-data'
import { Mail, Heart } from 'lucide-react'
import { useState } from 'react'

export default function ArtistPage({ params }: { params: { id: string } }) {
  const artist = SEED_ARTISTS.find(a => a.id === params.id)
  const [isFavorited, setIsFavorited] = useState(false)

  if (!artist) {
    return (
      <>
        <Navigation />
        <div className="container py-20">
          <p className="text-xl text-gray-600">Artist not found</p>
          <Link href="/discover" className="btn-primary mt-4">
            Back to Discover
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const artistWorks = SEED_ARTWORKS.filter(a => a.artist_id === artist.id)

  return (
    <>
      <Navigation />
      <main className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-12">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <img
                src={artist.profile_photo_url}
                alt={artist.name}
                className="w-48 h-48 rounded-lg object-cover shadow-lg"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-4xl font-bold">{artist.name}</h1>
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorited
                        ? 'bg-red-100 text-red-600'
                        : 'bg-white text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <Heart size={28} fill={isFavorited ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <p className="text-xl text-gray-600 mb-6">{artist.bio}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-6 text-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-semibold">{artist.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Works Available</p>
                    <p className="font-semibold">{artistWorks.length} pieces</p>
                  </div>
                </div>

                <button className="btn-primary flex items-center gap-2">
                  <Mail size={18} />
                  Contact Artist
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Artist Statement */}
        <div className="container py-12 border-b">
          <h2 className="text-2xl font-bold mb-4">About Their Work</h2>
          <p className="text-lg text-gray-700 leading-relaxed italic">"{artist.artist_statement}"</p>
        </div>

        {/* Works */}
        <div className="container py-12">
          <h2 className="text-3xl font-bold mb-8">Works by {artist.name}</h2>

          {artistWorks.length === 0 ? (
            <p className="text-gray-600 text-lg">No works available yet</p>
          ) : (
            <div className="grid_auto">
              {artistWorks.map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/artwork/${artwork.slug}`}
                  className="card overflow-hidden hover:scale-105 transition-transform"
                >
                  <div className="relative overflow-hidden bg-gray-100 h-56">
                    <img
                      src={artwork.image_urls[0]}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{artwork.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 capitalize">{artwork.category}</p>
                    <p className="text-2xl font-bold text-blue-600">${artwork.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
