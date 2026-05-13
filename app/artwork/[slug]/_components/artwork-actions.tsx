'use client'

import { useState } from 'react'
import { ShoppingCart, Heart, Share2, X, MessageCircle } from 'lucide-react'
import { usePreferenceStore } from '@/lib/store'
import { MessageCompose } from '@/components/message-compose'
import type { Artist, Artwork } from '@/lib/types'

interface Props {
  artwork: Artwork
  artist: Artist | null
}

export function ArtworkActions({ artwork, artist }: Props) {
  const { favorite_artworks, toggleFavoriteArtwork } = usePreferenceStore()
  const [showOffer, setShowOffer] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')
  const [offerMessage, setOfferMessage] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const isFavorited = favorite_artworks.includes(artwork.id)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2500)
  }

  const handleAddToCart = () => {
    showToast('Added to cart (mock checkout — coming soon)')
  }

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: artwork.title,
          text: `Check out "${artwork.title}" on Artkindred`,
          url
        })
        return
      } catch {
        // User cancelled — fall through to copy
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      showToast('Link copied to clipboard')
    }
  }

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault()
    showToast(`Offer of $${offerAmount} submitted (mock — coming soon)`)
    setOfferAmount('')
    setOfferMessage('')
    setShowOffer(false)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => toggleFavoriteArtwork(artwork.id)}
          className={`p-3 rounded-lg transition-colors ${
            isFavorited
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-600'
          }`}
          aria-label={isFavorited ? `Remove ${artwork.title} from favorites` : `Add ${artwork.title} to favorites`}
          aria-pressed={isFavorited}
        >
          <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
        <button
          onClick={handleShare}
          className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label="Share this artwork"
        >
          <Share2 size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          className="w-full btn-primary py-3 text-base flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} aria-hidden="true" />
          Add to Cart
        </button>
        {artwork.allows_offers && (
          <button
            onClick={() => setShowOffer((v) => !v)}
            className="w-full btn-outline py-3 text-base"
            aria-expanded={showOffer}
            aria-controls="offer-form"
          >
            {showOffer ? 'Cancel offer' : 'Make an Offer'}
          </button>
        )}
        {artist && (
          <button
            onClick={() => setShowMessage(true)}
            className="w-full text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle size={16} aria-hidden="true" />
            Have a question? Message {artist.name.split(' ')[0]}
          </button>
        )}
      </div>

      {artist && (
        <MessageCompose
          artist={artist}
          artworkId={artwork.id}
          open={showMessage}
          onClose={() => setShowMessage(false)}
        />
      )}

      {showOffer && (
        <form
          id="offer-form"
          onSubmit={handleSubmitOffer}
          className="border-2 border-blue-200 p-4 rounded-lg bg-blue-50 space-y-3"
        >
          <h3 className="font-bold">Make an offer</h3>
          <div>
            <label htmlFor="offer-amount" className="block text-sm font-medium mb-1">
              Your offer (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                id="offer-amount"
                type="number"
                placeholder={`e.g. ${Math.round(artwork.price * 0.85)}`}
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="input pl-7"
                required
                min={1}
                max={artwork.price}
              />
            </div>
          </div>
          <div>
            <label htmlFor="offer-message" className="block text-sm font-medium mb-1">
              Message to artist (optional)
            </label>
            <textarea
              id="offer-message"
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              className="input"
              rows={3}
              placeholder="Share why this piece resonates with you"
            />
          </div>
          <button type="submit" className="w-full btn-primary py-2">
            Submit offer
          </button>
        </form>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3"
        >
          <span>{toast}</span>
          <button
            onClick={() => setToast(null)}
            className="hover:text-gray-300"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  )
}
