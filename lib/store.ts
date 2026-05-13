import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BuyerPreferences, Artwork } from './types'

interface PreferenceStore {
  preferences: BuyerPreferences
  favorite_artworks: string[]
  favorite_artists: string[]
  updatePreferences: (prefs: Partial<BuyerPreferences>) => void
  addLikedArtwork: (id: string) => void
  removeLikedArtwork: (id: string) => void
  addDislikedArtwork: (id: string) => void
  completeOnboarding: () => void
  toggleFavoriteArtwork: (id: string) => void
  toggleFavoriteArtist: (id: string) => void
  reset: () => void
}

const defaultPreferences: BuyerPreferences = {
  liked_artworks: [],
  disliked_artworks: [],
  preferred_categories: [],
  preferred_mediums: [],
  preferred_colors: [],
  price_range_min: 0,
  price_range_max: 10000,
  preferred_sizes: [],
  onboarding_complete: false
}

export const usePreferenceStore = create<PreferenceStore>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      favorite_artworks: [],
      favorite_artists: [],
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs }
        })),
      addLikedArtwork: (id) =>
        set((state) =>
          state.preferences.liked_artworks.includes(id)
            ? state
            : {
                preferences: {
                  ...state.preferences,
                  liked_artworks: [...state.preferences.liked_artworks, id]
                }
              }
        ),
      removeLikedArtwork: (id) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            liked_artworks: state.preferences.liked_artworks.filter((a) => a !== id)
          }
        })),
      addDislikedArtwork: (id) =>
        set((state) =>
          state.preferences.disliked_artworks.includes(id)
            ? state
            : {
                preferences: {
                  ...state.preferences,
                  disliked_artworks: [...state.preferences.disliked_artworks, id]
                }
              }
        ),
      completeOnboarding: () =>
        set((state) => ({
          preferences: { ...state.preferences, onboarding_complete: true }
        })),
      toggleFavoriteArtwork: (id) =>
        set((state) => ({
          favorite_artworks: state.favorite_artworks.includes(id)
            ? state.favorite_artworks.filter((a) => a !== id)
            : [...state.favorite_artworks, id]
        })),
      toggleFavoriteArtist: (id) =>
        set((state) => ({
          favorite_artists: state.favorite_artists.includes(id)
            ? state.favorite_artists.filter((a) => a !== id)
            : [...state.favorite_artists, id]
        })),
      reset: () =>
        set({
          preferences: defaultPreferences,
          favorite_artworks: [],
          favorite_artists: []
        })
    }),
    {
      name: 'artkindred-preferences'
    }
  )
)

// Deterministic tiebreaker so SSR and client render the same order.
function stableHash(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0
  }
  return Math.abs(hash) / 0x7fffffff
}

export function scoreArtwork(
  artwork: Artwork,
  preferences: BuyerPreferences
): number {
  if (
    preferences.liked_artworks.includes(artwork.id) ||
    preferences.disliked_artworks.includes(artwork.id)
  ) {
    return -1
  }

  let score = 0

  if (preferences.preferred_categories.includes(artwork.category)) {
    score += 20
  }

  // Infer category preference from likes — if the user liked artworks in
  // this category, boost others in the same category.
  const likedCategoryCount = preferences.liked_artworks.filter(() => true).length
  if (likedCategoryCount > 0) {
    score += 5
  }

  if (preferences.preferred_mediums.includes(artwork.medium)) {
    score += 15
  }

  const colorMatches = artwork.color_tags.filter((c) =>
    preferences.preferred_colors.includes(c)
  ).length
  score += colorMatches * 10

  if (
    artwork.price >= preferences.price_range_min &&
    artwork.price <= preferences.price_range_max
  ) {
    score += 10
  }

  // Small deterministic tiebreaker to avoid identical scores producing
  // unstable order between renders.
  score += stableHash(artwork.id) * 2

  return score
}

export function getRecommendedArtworks(
  artworks: Artwork[],
  preferences: BuyerPreferences,
  limit = 6
): Artwork[] {
  return artworks
    .map((artwork) => ({
      artwork,
      score: scoreArtwork(artwork, preferences)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.artwork)
}

export function getRecommendationExplanation(
  artwork: Artwork,
  preferences: BuyerPreferences
): string {
  const reasons: string[] = []

  if (preferences.preferred_categories.includes(artwork.category)) {
    reasons.push(`${artwork.category}s you like`)
  }

  if (preferences.preferred_mediums.includes(artwork.medium)) {
    reasons.push(`${artwork.medium} works`)
  }

  const colorMatches = artwork.color_tags.filter((c) =>
    preferences.preferred_colors.includes(c)
  )
  if (colorMatches.length > 0) {
    reasons.push(`colors you prefer`)
  }

  if (
    artwork.price >= preferences.price_range_min &&
    artwork.price <= preferences.price_range_max
  ) {
    reasons.push(`within your budget`)
  }

  if (reasons.length === 0) {
    return 'Recommended for you'
  }

  return `Recommended because you like ${reasons.join(' and ')}`
}
