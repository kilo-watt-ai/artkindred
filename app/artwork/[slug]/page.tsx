'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SEED_ARTWORKS, SEED_ARTISTS } from '@/lib/seed-data'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'

export default function ArtworkPage({ params }: { params: { slug: string } }) {
  const artwork = SEED_ARTWORKS.find(a => a.slug === params.slug)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showOffer, setShowOffer] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')

  if (!artwork) {
    return (
      <>
        <Navigation />
        <div className="container py-20">
          <p className="text-xl text-gray-600">Artwork not found</p>
          <Link href="/discover" className="btn-primary mt-4">
            Back to Discover
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const artist = SEED_ARTISTS.find(a => a.id === artwork.artist_id)
  const buyerFee = Math.round(artwork.price * 0.1)
  const total = artwork.price + buyerFee + artwork.shipping_price

  return (
    <>
      <Navigation />
      <main className="bg-white">
        <div className="container py-12">
          {/* Breadcrumb */}
          <div className="mb-8 text-sm text-gray-600">
            <Link href="/discover" className="hover:text-blue-600">
              Discover
            </Link>
            {' > '}
            <Link href={`/artist/${artist?.id}`} className="hover:text-blue-600">
              {artist?.name}
            </Link>
            {' > '}
            <span>{artwork.title}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <img
                  src={artwork.image_urls[0]}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Artist Info */}
              <div className="flex items-start justify-between border-b pb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">by</p>
                  <Link href={`/artist/${artist?.id}`} className="hover:text-blue-600">
                    <h2 className="text-2xl font-bold">{artist?.name}</h2>
                  </Link>
                </div>
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorited
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:text-red-600'
                  }`}
                >
                  <Heart size={24} fill={isFavorited ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Title & Description */}
              <div>
                <h1 className="text-4xl font-bold mb-4">{artwork.title}</h1>
                <p className="text-gray-600 text-lg mb-4">{artwork.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold capitalize">{artwork.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Medium</p>
                  <p className="font-semibold">{artwork.medium}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dimensions</p>
                  <p className="font-semibold">{artwork.dimensions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="font-semibold">{artwork.year_created}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-b py-6 space-y-3">
                <div className="flex justify-between">
                  <span>Artwork Price</span>
                  <span className="font-semibold">${artwork.price}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Buyer Fee (10%)</span>
                  <span>${buyerFee}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>${artwork.shipping_price}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-blue-600">${total}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2">
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                {artwork.allows_offers && (
                  <button
                    onClick={() => setShowOffer(!showOffer)}
                    className="w-full btn-outline py-3 text-lg"
                  >
                    Make an Offer
                  </button>
                )}
              </div>

              {/* Availability */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">✓ {artwork.quantity_available} available</p>
              </div>
            </div>
          </div>

          {/* Artist Card */}
          {artist && (
            <div className="border-t py-12">
              <h2 className="text-3xl font-bold mb-6">About the Artist</h2>
              <div className="card p-8 flex flex-col md:flex-row gap-8">
                <img
                  src={artist.profile_photo_url}
                  alt={artist.name}
                  className="w-48 h-48 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-2xl font-bold mb-2">{artist.name}</h3>
                  <p className="text-gray-600 mb-4">{artist.bio}</p>
                  <p className="text-gray-700 mb-6 italic">"{artist.artist_statement}"</p>
                  <div className="flex flex-col gap-2 mb-6">
                    <p className="text-gray-600">
                      <strong>Location:</strong> {artist.location}
                    </p>
                  </div>
                  <Link href={`/artist/${artist.id}`} className="btn-primary">
                    View All Works
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
