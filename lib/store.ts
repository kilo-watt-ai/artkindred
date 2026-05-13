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
  preferences: BuyerPreferences,
  allArtworks?: Artwork[]
): number {
  // Only exclude explicit dislikes. Liked artworks should rank highly —
  // they're a strong positive signal, not a filter.
  if (preferences.disliked_artworks.includes(artwork.id)) {
    return -1
  }

  let score = 0

  // Direct preference matches (set explicitly, e.g. via filter selections)
  if (preferences.preferred_categories.includes(artwork.category)) {
    score += 20
  }
  if (preferences.preferred_mediums.includes(artwork.medium)) {
    score += 15
  }

  const directColorMatches = artwork.color_tags.filter((c) =>
    preferences.preferred_colors.includes(c)
  ).length
  score += directColorMatches * 10

  // Inferred preferences: look at what the user has liked and match by
  // shared attributes (category, medium, color). This is the key signal
  // from onboarding.
  if (allArtworks && preferences.liked_artworks.length > 0) {
    const likedArtworks = allArtworks.filter((a) =>
      preferences.liked_artworks.includes(a.id)
    )

    const likedCategories = new Set(likedArtworks.map((a) => a.category))
    const likedMediums = new Set(likedArtworks.map((a) => a.medium))
    const likedColors = new Set(likedArtworks.flatMap((a) => a.color_tags))

    if (likedCategories.has(artwork.category)) score += 15
    if (likedMediums.has(artwork.medium)) score += 10
    const inferredColorMatches = artwork.color_tags.filter((c) =>
      likedColors.has(c)
    ).length
    score += inferredColorMatches * 4

    // Boost works by artists the user has already liked
    const likedArtistIds = new Set(likedArtworks.map((a) => a.artist_id))
    if (likedArtistIds.has(artwork.artist_id)) score += 8
  }

  // Price range fit (when set)
  if (
    preferences.price_range_min > 0 ||
    preferences.price_range_max < 10000
  ) {
    if (
      artwork.price >= preferences.price_range_min &&
      artwork.price <= preferences.price_range_max
    ) {
      score += 10
    }
  }

  // Give liked artworks a small boost so they remain visible if the user
  // wants to revisit them, but ranked below newly-discovered work in
  // their taste.
  if (preferences.liked_artworks.includes(artwork.id)) {
    score += 5
  }

  // If nothing matched explicitly, give a neutral baseline so we still
  // surface something rather than nothing.
  if (score === 0) {
    score = 1
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
  const scored = artworks
    .map((artwork) => ({
      artwork,
      score: scoreArtwork(artwork, preferences, artworks)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  // Hard fallback: if the user has disliked everything (e.g. in a small
  // demo dataset), show all artworks so the page is never empty.
  if (scored.length === 0) {
    return artworks.slice(0, limit)
  }

  return scored.slice(0, limit).map((item) => item.artwork)
}

export function getRecommendationExplanation(
  artwork: Artwork,
  preferences: BuyerPreferences,
  allArtworks?: Artwork[]
): string {
  const reasons: string[] = []

  // Explicit filter preferences (if user set them via discover filters)
  if (preferences.preferred_categories.includes(artwork.category)) {
    reasons.push(`${artwork.category} works`)
  }
  if (preferences.preferred_mediums.includes(artwork.medium)) {
    reasons.push(artwork.medium)
  }
  const explicitColorMatches = artwork.color_tags.filter((c) =>
    preferences.preferred_colors.includes(c)
  )
  if (explicitColorMatches.length > 0) {
    reasons.push(`${explicitColorMatches[0]} tones`)
  }

  // Inferred from likes
  if (allArtworks && preferences.liked_artworks.length > 0) {
    const liked = allArtworks.filter((a) =>
      preferences.liked_artworks.includes(a.id)
    )
    const likedCategories = new Set(liked.map((a) => a.category))
    const likedMediums = new Set(liked.map((a) => a.medium))
    const likedColors = new Set(liked.flatMap((a) => a.color_tags))
    const likedArtists = new Set(liked.map((a) => a.artist_id))

    if (likedArtists.has(artwork.artist_id)) {
      reasons.push('an artist you like')
    } else if (likedCategories.has(artwork.category) && !preferences.preferred_categories.includes(artwork.category)) {
      reasons.push(`other ${artwork.category}s you enjoyed`)
    } else if (likedMediums.has(artwork.medium) && !preferences.preferred_mediums.includes(artwork.medium)) {
      reasons.push(`similar medium`)
    } else if (artwork.color_tags.some((c) => likedColors.has(c))) {
      reasons.push('similar color palette')
    }
  }

  if (reasons.length === 0) {
    return 'Picked for you'
  }

  // Deduplicate while preserving order, take up to 2 reasons
  const unique = Array.from(new Set(reasons)).slice(0, 2)
  return `Because you liked ${unique.join(' and ')}`
}
