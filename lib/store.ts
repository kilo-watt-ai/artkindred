import { create } from 'zustand'
import { BuyerPreferences, Artwork } from './types'

interface PreferenceStore {
  preferences: BuyerPreferences
  updatePreferences: (prefs: Partial<BuyerPreferences>) => void
  addLikedArtwork: (id: string) => void
  addDislikedArtwork: (id: string) => void
  completeOnboarding: () => void
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

export const usePreferenceStore = create<PreferenceStore>((set) => ({
  preferences: defaultPreferences,
  updatePreferences: (prefs) =>
    set((state) => ({
      preferences: { ...state.preferences, ...prefs }
    })),
  addLikedArtwork: (id) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        liked_artworks: [...state.preferences.liked_artworks, id]
      }
    })),
  addDislikedArtwork: (id) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        disliked_artworks: [...state.preferences.disliked_artworks, id]
      }
    })),
  completeOnboarding: () =>
    set((state) => ({
      preferences: { ...state.preferences, onboarding_complete: true }
    })),
  reset: () => set({ preferences: defaultPreferences })
}))

export function scoreArtwork(
  artwork: Artwork,
  preferences: BuyerPreferences
): number {
  let score = 0

  if (
    preferences.liked_artworks.includes(artwork.id) ||
    preferences.disliked_artworks.includes(artwork.id)
  ) {
    return -1
  }

  if (preferences.preferred_categories.includes(artwork.category)) {
    score += 20
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

  const artworkSize = parseFloat(artwork.dimensions)
  if (!isNaN(artworkSize)) {
    if (artworkSize > 200 && artworkSize < 1000) {
      score += 5
    }
  }

  score += Math.random() * 5

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
