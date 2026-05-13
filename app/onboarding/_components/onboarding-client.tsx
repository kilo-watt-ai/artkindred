'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, CheckCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { usePreferenceStore } from '@/lib/store'
import { SEED_ARTWORKS, SEED_ARTISTS } from '@/lib/seed-data'

const TOTAL_STEPS = 4
const ARTWORKS_PER_STEP = 6

// Stable, seeded shuffle so the same user sees the same set across renders.
function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items]
  let s = seed
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function OnboardingClient() {
  const {
    preferences,
    addLikedArtwork,
    removeLikedArtwork,
    addDislikedArtwork,
    completeOnboarding,
    reset
  } = usePreferenceStore()

  const [step, setStep] = useState(1)
  // A simple per-session seed makes the shuffle stable within a session.
  const [seed] = useState(() => Math.floor(Date.now() / 1000))

  const artworksForStep = useMemo(() => {
    const shuffled = seededShuffle(SEED_ARTWORKS, seed + step)
    return shuffled.slice(0, ARTWORKS_PER_STEP)
  }, [seed, step])

  if (preferences.onboarding_complete) {
    return (
      <div className="container py-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <CheckCircle
            className="w-20 h-20 text-green-600 mx-auto mb-6"
            aria-hidden="true"
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your taste profile is ready</h1>
          <p className="text-lg text-gray-600 mb-8">
            Based on your selections, we&apos;ve built personalized recommendations just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/recommended" className="btn-primary text-base px-6 py-3">
              See recommendations
            </Link>
            <Link href="/discover" className="btn-outline text-base px-6 py-3">
              Browse all art
            </Link>
          </div>
          <button
            onClick={() => reset()}
            className="mt-8 text-sm text-gray-500 hover:text-gray-900 underline"
          >
            Restart taste profile
          </button>
        </div>
      </div>
    )
  }

  const toggleArtwork = (id: string) => {
    if (preferences.liked_artworks.includes(id)) {
      removeLikedArtwork(id)
    } else {
      addLikedArtwork(id)
    }
  }

  const handleNextOrFinish = () => {
    // Just advance — unselected items stay neutral. Only explicit
    // "None of these" should count as a dislike signal.
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleNoneFit = () => {
    // Explicit "I don't like any of these" — mark all shown as disliked.
    artworksForStep.forEach((art) => {
      if (
        !preferences.disliked_artworks.includes(art.id) &&
        !preferences.liked_artworks.includes(art.id)
      ) {
        addDislikedArtwork(art.id)
      }
    })
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    } else {
      completeOnboarding()
    }
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const likedThisStepCount = artworksForStep.filter((a) =>
    preferences.liked_artworks.includes(a.id)
  ).length

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-blue-600" aria-hidden="true" />
              Find your taste
            </h1>
            <p className="text-sm text-gray-600 whitespace-nowrap">
              Step {step} of {TOTAL_STEPS}
            </p>
          </div>
          <div
            className="w-full bg-gray-200 rounded-full h-2"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-label={`Onboarding progress: step ${step} of ${TOTAL_STEPS}`}
          >
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </header>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
          <p className="text-base md:text-lg text-gray-700 mb-6">
            Tap any pieces that speak to you. Pick as many as you like — the more, the better we&apos;ll learn your taste.
          </p>

          <ul
            className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8"
            role="list"
          >
            {artworksForStep.map((artwork) => {
              const artist = SEED_ARTISTS.find((a) => a.id === artwork.artist_id)
              const isLiked = preferences.liked_artworks.includes(artwork.id)
              return (
                <li key={artwork.id}>
                  <button
                    type="button"
                    onClick={() => toggleArtwork(artwork.id)}
                    className={`w-full text-left rounded-xl overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isLiked
                        ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg'
                        : 'hover:shadow-md ring-1 ring-gray-200'
                    }`}
                    aria-pressed={isLiked}
                    aria-label={`${isLiked ? 'Unlike' : 'Like'} ${artwork.title} by ${artist?.name ?? 'Artist'}`}
                  >
                    <div className="relative bg-gray-100 aspect-square">
                      <Image
                        src={artwork.image_urls[0]}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover"
                      />
                      {isLiked && (
                        <span
                          className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1.5 shadow-lg"
                          aria-hidden="true"
                        >
                          <Check size={16} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div className="p-3 bg-white">
                      <p className="font-semibold text-sm md:text-base truncate">
                        {artwork.title}
                      </p>
                      <p className="text-xs text-gray-600 truncate">{artist?.name}</p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={step === 1}
                className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1"
              >
                <ChevronLeft size={18} aria-hidden="true" />
                Back
              </button>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleNoneFit} className="btn-secondary">
                  None of these
                </button>
                <button
                  onClick={handleNextOrFinish}
                  className="btn-primary inline-flex items-center justify-center gap-1"
                >
                  {step === TOTAL_STEPS ? 'Finish' : 'Continue'}
                  {step !== TOTAL_STEPS && (
                    <ChevronRight size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <p
              className="text-xs text-gray-500 text-center sm:text-right mt-3"
              aria-live="polite"
            >
              {likedThisStepCount > 0
                ? `${likedThisStepCount} liked this step · ${preferences.liked_artworks.length} liked overall`
                : 'Click any piece you find interesting, or skip if nothing fits.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
