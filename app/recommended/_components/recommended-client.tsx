'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import {
  usePreferenceStore,
  getRecommendedArtworks,
  getRecommendationExplanation
} from '@/lib/store'
import { SEED_ARTWORKS, SEED_ARTISTS } from '@/lib/seed-data'

export function RecommendedClient() {
  const { preferences } = usePreferenceStore()

  const hasOnboarded =
    preferences.onboarding_complete || preferences.liked_artworks.length > 0

  if (!hasOnboarded) {
    return (
      <div className="container py-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <AlertCircle
            className="w-16 h-16 text-blue-600 mx-auto mb-6"
            aria-hidden="true"
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Complete your taste profile
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Tell us what you love and we&apos;ll recommend artworks tailored to your preferences.
          </p>
          <Link href="/onboarding" className="btn-primary text-base px-6 py-3">
            Get started
          </Link>
        </div>
      </div>
    )
  }

  const recommendedArtworks = getRecommendedArtworks(SEED_ARTWORKS, preferences, 12)

  return (
    <div className="container py-10 md:py-12">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Recommended for you</h1>
        <p className="text-lg text-gray-600">
          Based on your taste profile, here are artworks we think you&apos;ll love.
        </p>
      </header>

      {recommendedArtworks.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <p className="text-xl text-gray-700 mb-2 font-semibold">
            We&apos;re still learning your taste
          </p>
          <p className="text-gray-600 mb-6">
            Pick a few more pieces you love so we can find work that resonates.
          </p>
          <Link href="/onboarding" className="btn-primary">
            Continue onboarding
          </Link>
        </div>
      ) : (
        <ul className="grid_auto" role="list">
          {recommendedArtworks.map((artwork) => {
            const artist = SEED_ARTISTS.find((a) => a.id === artwork.artist_id)
            const explanation = getRecommendationExplanation(artwork, preferences)
            return (
              <li key={artwork.id}>
                <Link
                  href={`/artwork/${artwork.slug}`}
                  className="card overflow-hidden hover:shadow-lg transition-shadow block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                >
                  <div className="relative bg-gray-100 aspect-[4/3]">
                    <Image
                      src={artwork.image_urls[0]}
                      alt={`${artwork.title} by ${artist?.name ?? 'Artist'}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-medium shadow">
                      Recommended
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{artist?.name}</p>
                    <h2 className="font-semibold text-lg mb-2">{artwork.title}</h2>
                    <p className="text-xs text-blue-700 font-medium mb-3 leading-snug">
                      {explanation}
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      ${artwork.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-12 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-3">Want to refine your taste?</h2>
        <p className="text-gray-600 mb-5">
          Retake the visual flow to update your preferences anytime.
        </p>
        <Link href="/onboarding" className="btn-outline">
          Retake taste profile
        </Link>
      </div>
    </div>
  )
}
