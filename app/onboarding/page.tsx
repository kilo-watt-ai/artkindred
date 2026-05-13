'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { usePreferenceStore } from '@/lib/store'
import { SEED_ARTWORKS, SEED_ARTISTS } from '@/lib/seed-data'
import { ChevronRight, CheckCircle } from 'lucide-react'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const { preferences, addLikedArtwork, addDislikedArtwork, completeOnboarding } =
    usePreferenceStore()

  const artworksForStep = useMemo(() => {
    const shuffled = [...SEED_ARTWORKS].sort(() => Math.random() - 0.5)
    const start = (step - 1) * 5
    return shuffled.slice(start, start + 5)
  }, [step])

  const totalSteps = 4

  const handleLike = (id: string) => {
    addLikedArtwork(id)
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleDislike = (id: string) => {
    addDislikedArtwork(id)
  }

  const handleSkip = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleComplete = () => {
    completeOnboarding()
  }

  if (preferences.onboarding_complete) {
    return (
      <>
        <Navigation />
        <main className="container py-20 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Your Profile Is Ready!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Based on your preferences, we've created personalized recommendations just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/recommended" className="btn-primary text-lg">
                See Recommendations
              </Link>
              <Link href="/discover" className="btn-outline text-lg">
                Browse All Art
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">
                  Let's Discover Your Taste {step === 1 && '👀'}
                </h1>
                <p className="text-gray-600">
                  Step {step} of {totalSteps}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 mb-8">
              <p className="text-lg text-gray-600 mb-8">
                Which of these pieces speaks to you? Select as many as you like, or skip to see
                different works.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {artworksForStep.map((artwork) => {
                  const artist = SEED_ARTISTS.find(a => a.id === artwork.artist_id)
                  const isLiked = preferences.liked_artworks.includes(artwork.id)

                  return (
                    <div
                      key={artwork.id}
                      className={`cursor-pointer transition-all ${
                        isLiked ? 'ring-4 ring-blue-400 rounded-lg' : ''
                      }`}
                      onClick={() =>
                        isLiked ? handleDislike(artwork.id) : handleLike(artwork.id)
                      }
                    >
                      <div className="relative overflow-hidden rounded-lg bg-gray-100 h-48 mb-3 hover:shadow-lg transition-shadow">
                        <img
                          src={artwork.image_urls[0]}
                          alt={artwork.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-lg">{artwork.title}</h3>
                      <p className="text-sm text-gray-600">{artist?.name}</p>
                      <p className="text-sm text-gray-500 mb-2">{artwork.category}</p>
                      <p className="text-xl font-bold text-blue-600">${artwork.price}</p>
                      {isLiked && (
                        <p className="text-sm text-green-600 font-medium mt-2">✓ Added to your likes</p>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-6 space-y-4">
                <button onClick={handleSkip} className="w-full btn-secondary py-3 text-lg">
                  Skip This Step
                </button>
                {preferences.liked_artworks.length > 0 && step === totalSteps && (
                  <button onClick={handleComplete} className="w-full btn-primary py-3 text-lg">
                    Complete Onboarding
                  </button>
                )}
              </div>
            </div>

            <div className="text-center text-gray-600 text-sm">
              <p>You've liked {preferences.liked_artworks.length} artworks so far</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
