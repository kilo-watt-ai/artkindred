'use client'

import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { usePreferenceStore, getRecommendedArtworks, getRecommendationExplanation } from '@/lib/store'
import { SEED_ARTWORKS, SEED_ARTISTS } from '@/lib/seed-data'
import { AlertCircle } from 'lucide-react'

export default function RecommendedPage() {
  const { preferences } = usePreferenceStore()

  if (!preferences.onboarding_complete && preferences.liked_artworks.length === 0) {
    return (
      <>
        <Navigation />
        <main className="container py-20 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <AlertCircle className="w-20 h-20 text-blue-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Complete Your Taste Profile</h1>
            <p className="text-xl text-gray-600 mb-8">
              Tell us what you love, and we'll recommend artworks tailored to your preferences.
            </p>
            <Link href="/onboarding" className="btn-primary text-lg">
              Get Started with Onboarding
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const recommendedArtworks = getRecommendedArtworks(SEED_ARTWORKS, preferences, 12)

  return (
    <>
      <Navigation />
      <main className="bg-white min-h-screen">
        <div className="container py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Recommended For You</h1>
            <p className="text-xl text-gray-600">
              Based on your preferences, here are artworks we think you'll love
            </p>
          </div>

          {recommendedArtworks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-4">
                No recommendations yet. Complete your taste profile to get started!
              </p>
              <Link href="/onboarding" className="btn-primary">
                Complete Your Profile
              </Link>
            </div>
          ) : (
            <div className="grid_auto">
              {recommendedArtworks.map((artwork) => {
                const artist = SEED_ARTISTS.find(a => a.id === artwork.artist_id)
                const explanation = getRecommendationExplanation(artwork, preferences)

                return (
                  <Link
                    key={artwork.id}
                    href={`/artwork/${artwork.slug}`}
                    className="card overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative overflow-hidden bg-gray-100 h-56">
                      <img
                        src={artwork.image_urls[0]}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-full text-xs font-medium">
                        Recommended
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-1">{artist?.name}</p>
                      <h3 className="font-semibold text-lg mb-2">{artwork.title}</h3>
                      <p className="text-sm text-blue-600 font-medium mb-2">{explanation}</p>
                      <p className="text-sm text-gray-600 mb-3 capitalize">{artwork.category}</p>
                      <p className="text-2xl font-bold text-blue-600">${artwork.price}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Want to Refine Your Taste?</h2>
            <Link href="/onboarding" className="btn-primary">
              Retake Taste Profile
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
