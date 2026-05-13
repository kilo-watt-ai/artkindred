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
  /** Reset onboarding-derived signals (likes, dislikes, completion) but
   *  keep favorites. Used when the buyer retakes their taste profile. */
  restartOnboarding: () => void
  /** Reset everything — onboarding state and favorites. */
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
      restartOnboarding: () =>
        set({
          preferences: defaultPreferences
          // favorite_artworks and favorite_artists intentionally preserved
        }),
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
  // Recommendations should surface new discoveries, not work the user
  // has already liked or rejected.
  const candidates = artworks.filter(
    (a) => !preferences.liked_artworks.includes(a.id)
  )

  const scored = candidates
    .map((artwork) => ({
      artwork,
      score: scoreArtwork(artwork, preferences, artworks)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  // Hard fallback: if the user has disliked everything (e.g. in a small
  // demo dataset), show all non-liked artworks so the page is never empty.
  if (scored.length === 0) {
    return candidates.slice(0, limit)
  }

  return scored.slice(0, limit).map((item) => item.artwork)
}

export function getRecommendationExplanation(
  artwork: Artwork,
  preferences: BuyerPreferences,
  allArtworks?: Artwork[]
): string {
  // Inferred from likes — these phrases work in a "Because you liked ..." sentence
  const likeReasons: string[] = []
  // Explicit preferences (from filter selections) — work in a "Matches your ..." sentence
  const matchReasons: string[] = []

  if (preferences.preferred_categories.includes(artwork.category)) {
    matchReasons.push(`${artwork.category} preference`)
  }
  if (preferences.preferred_mediums.includes(artwork.medium)) {
    matchReasons.push(`favorite medium`)
  }
  const explicitColorMatches = artwork.color_tags.filter((c) =>
    preferences.preferred_colors.includes(c)
  )
  if (explicitColorMatches.length > 0) {
    matchReasons.push(`${explicitColorMatches[0]} tones`)
  }

  if (allArtworks && preferences.liked_artworks.length > 0) {
    const liked = allArtworks.filter((a) =>
      preferences.liked_artworks.includes(a.id)
    )
    const likedCategories = new Set(liked.map((a) => a.category))
    const likedMediums = new Set(liked.map((a) => a.medium))
    const likedColors = new Set(liked.flatMap((a) => a.color_tags))
    const likedArtists = new Set(liked.map((a) => a.artist_id))

    if (likedArtists.has(artwork.artist_id)) {
      return `By an artist you've liked before`
    }
    if (likedMediums.has(artwork.medium)) {
      likeReasons.push(`${artwork.medium.toLowerCase()}`)
    } else if (likedCategories.has(artwork.category)) {
      likeReasons.push(`other ${artwork.category}s`)
    }
    const sharedColors = artwork.color_tags.filter((c) => likedColors.has(c))
    if (sharedColors.length > 0) {
      likeReasons.push(`${sharedColors[0]} palettes`)
    }
  }

  if (likeReasons.length > 0) {
    const unique = Array.from(new Set(likeReasons)).slice(0, 2)
    return `Similar to work you liked — ${unique.join(', ')}`
  }
  if (matchReasons.length > 0) {
    const unique = Array.from(new Set(matchReasons)).slice(0, 2)
    return `Matches your ${unique.join(' and ')}`
  }

  return 'Picked for you'
}
