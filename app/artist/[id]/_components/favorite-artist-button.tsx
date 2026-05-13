'use client'

import { Heart } from 'lucide-react'
import { usePreferenceStore } from '@/lib/store'

interface Props {
  artistId: string
  artistName: string
}

export function FavoriteArtistButton({ artistId, artistName }: Props) {
  const { favorite_artists, toggleFavoriteArtist } = usePreferenceStore()
  const isFavorited = favorite_artists.includes(artistId)

  return (
    <button
      onClick={() => toggleFavoriteArtist(artistId)}
      className={`p-3 rounded-lg transition-colors ${
        isFavorited
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-red-600 border border-gray-200'
      }`}
      aria-label={isFavorited ? `Remove ${artistName} from favorites` : `Add ${artistName} to favorites`}
      aria-pressed={isFavorited}
    >
      <Heart size={24} fill={isFavorited ? 'currentColor' : 'none'} aria-hidden="true" />
    </button>
  )
}
