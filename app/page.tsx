'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Users } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SEED_ARTWORKS, SEED_ARTISTS } from '@/lib/seed-data'

export default function Home() {
  const featuredArtworks = SEED_ARTWORKS.slice(0, 4)
  const featuredArtists = SEED_ARTISTS.slice(0, 3)

  return (
    <>
      <Navigation />
      <main className="bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="container py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Discover Art That <span className="text-blue-600">Speaks to You</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                An approachable marketplace for discovering and collecting art. We help first-time collectors find pieces they love directly from artists.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/discover" className="btn-primary text-lg">
                  Start Discovering <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="#how-it-works" className="btn-outline text-lg">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=800&h=600&fit=crop"
                alt="Art marketplace preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Featured Artworks */}
        <section className="container py-20">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Works</h2>
            <p className="text-xl text-gray-600">Curated pieces from emerging artists in North Carolina</p>
          </div>
          <div className="grid_auto">
            {featuredArtworks.map((artwork) => {
              const artist = SEED_ARTISTS.find(a => a.id === artwork.artist_id)
              return (
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
                    <p className="text-sm text-gray-500 mb-1">{artist?.name}</p>
                    <h3 className="font-semibold text-lg mb-2">{artwork.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 capitalize">{artwork.category}</p>
                    <p className="text-2xl font-bold text-blue-600">${artwork.price}</p>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/discover" className="btn-primary text-lg">
              Browse All Works
            </Link>
          </div>
        </section>

        {/* Featured Artists */}
        <section className="container py-20 bg-white">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Artists</h2>
            <p className="text-xl text-gray-600">Meet the creators behind the work</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredArtists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artist/${artist.id}`}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <img
                  src={artist.profile_photo_url}
                  alt={artist.name}
                  className="w-20 h-20 rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl font-bold mb-2">{artist.name}</h3>
                <p className="text-gray-600 mb-3">{artist.bio}</p>
                <p className="text-sm text-gray-500">{artist.location}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="container py-20">
          <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Sparkles className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tell Us Your Taste</h3>
              <p className="text-gray-600">
                Complete our visual preference flow to help us understand what you love.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Users className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Discover & Connect</h3>
              <p className="text-gray-600">
                Browse personalized recommendations and connect with artists directly.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Shield className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Buy with Confidence</h3>
              <p className="text-gray-600">
                Transparent pricing, secure checkout, and artist profiles you can trust.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-20">
          <div className="bg-blue-600 text-white rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Find Your Next Favorite Piece?</h2>
            <p className="text-xl mb-8 opacity-90">Start your art collection today with artists you can trust.</p>
            <Link href="/discover" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Start Discovering Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
