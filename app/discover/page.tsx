'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SEED_ARTWORKS, SEED_ARTISTS, CATEGORIES, COLORS } from '@/lib/seed-data'
import { Search, Filter } from 'lucide-react'

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [showFilters, setShowFilters] = useState(true)

  const filteredArtworks = useMemo(() => {
    return SEED_ARTWORKS.filter((artwork) => {
      const artist = SEED_ARTISTS.find(a => a.id === artwork.artist_id)
      const matchesSearch =
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist?.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || artwork.category === selectedCategory
      const matchesColors =
        selectedColors.length === 0 ||
        selectedColors.some((color) => artwork.color_tags.includes(color))
      const matchesPrice = artwork.price >= priceRange.min && artwork.price <= priceRange.max

      return matchesSearch && matchesCategory && matchesColors && matchesPrice
    })
  }, [searchTerm, selectedCategory, selectedColors, priceRange])

  return (
    <>
      <Navigation />
      <main className="bg-white min-h-screen">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Discover Art</h1>
            <p className="text-xl text-gray-600">
              Browse {filteredArtworks.length} artworks from {SEED_ARTISTS.length} artists
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search artworks, artists, or styles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 py-3 text-lg"
            />
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-bold mb-3">Category</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory
                          ? 'bg-blue-100 text-blue-600 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors capitalize ${
                          selectedCategory === cat
                            ? 'bg-blue-100 text-blue-600 font-medium'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: parseInt(e.target.value) })
                      }
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600">
                      ${ priceRange.min} - ${priceRange.max}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-3">Colors</h3>
                  <div className="space-y-2">
                    {COLORS.slice(0, 8).map((color) => (
                      <label key={color} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedColors([...selectedColors, color])
                            } else {
                              setSelectedColors(
                                selectedColors.filter((c) => c !== color)
                              )
                            }
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedColors([])
                    setPriceRange({ min: 0, max: 10000 })
                    setSearchTerm('')
                  }}
                  className="w-full btn-secondary py-2"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">{filteredArtworks.length} works found</p>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center space-x-2 btn-outline text-sm"
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </button>
              </div>

              {filteredArtworks.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-600 mb-4">No artworks match your filters</p>
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setSelectedColors([])
                      setPriceRange({ min: 0, max: 10000 })
                      setSearchTerm('')
                    }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid_auto">
                  {filteredArtworks.map((artwork) => {
                    const artist = SEED_ARTISTS.find(a => a.id === artwork.artist_id)
                    return (
                      <Link
                        key={artwork.id}
                        href={`/artwork/${artwork.slug}`}
                        className="card overflow-hidden hover:scale-105 transition-transform"
                      >
                        <div className="relative overflow-hidden bg-gray-100 h-56">
                          <img
                            src={artwork.image_urls[0]}
                            alt={artwork.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-500 mb-1">{artist?.name}</p>
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {artwork.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 capitalize">{artwork.category}</p>
                          <p className="text-2xl font-bold text-blue-600">${artwork.price}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
