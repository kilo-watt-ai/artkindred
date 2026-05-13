'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SEED_ARTWORKS, SEED_ARTISTS, CATEGORIES, MEDIUMS, COLORS } from '@/lib/seed-data'
import { Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'

type SortOption = 'newest' | 'price-low' | 'price-high'

const COLOR_SWATCHES: Record<string, string> = {
  'warm orange': '#F97316',
  'soft yellow': '#FDE68A',
  'cool blue': '#60A5FA',
  'white': '#FFFFFF',
  'deep purple': '#6B21A8',
  'gold': '#D4AF37',
  'navy': '#1E3A8A',
  'black': '#000000',
  'grey': '#9CA3AF',
  'bronze': '#A97142',
  'warm brown': '#92400E',
  'cream': '#FEF3C7',
  'soft grey': '#D1D5DB',
  'earth tone': '#A78A6F',
  'deep green': '#166534',
  'warm yellow': '#FBBF24',
  'soft pink': '#FBCFE8',
  'sage green': '#84A98C'
}

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedMediums, setSelectedMediums] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState<string>('')
  const [priceMax, setPriceMax] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    medium: true,
    color: true
  })

  const priceMinNum = priceMin === '' ? 0 : parseInt(priceMin) || 0
  const priceMaxNum = priceMax === '' ? Infinity : parseInt(priceMax) || Infinity

  // Calculate counts per filter option (so users see "Painting (2)")
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    SEED_ARTWORKS.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1
    })
    return counts
  }, [])

  const mediumCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    SEED_ARTWORKS.forEach(a => {
      counts[a.medium] = (counts[a.medium] || 0) + 1
    })
    return counts
  }, [])

  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    SEED_ARTWORKS.forEach(a => {
      a.color_tags.forEach(c => {
        counts[c] = (counts[c] || 0) + 1
      })
    })
    return counts
  }, [])

  // Only show mediums and colors that have artworks
  const availableMediums = MEDIUMS.filter(m => mediumCounts[m] > 0)
  const availableColors = COLORS.filter(c => colorCounts[c] > 0)

  const filteredArtworks = useMemo(() => {
    const filtered = SEED_ARTWORKS.filter((artwork) => {
      const artist = SEED_ARTISTS.find(a => a.id === artwork.artist_id)
      const matchesSearch =
        searchTerm === '' ||
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist?.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || artwork.category === selectedCategory
      const matchesMediums =
        selectedMediums.length === 0 || selectedMediums.includes(artwork.medium)
      const matchesColors =
        selectedColors.length === 0 ||
        selectedColors.some((color) => artwork.color_tags.includes(color))
      const matchesPrice =
        artwork.price >= priceMinNum && artwork.price <= priceMaxNum

      return matchesSearch && matchesCategory && matchesMediums && matchesColors && matchesPrice
    })

    // Sort
    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price)
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price)
      case 'newest':
      default:
        return [...filtered].sort((a, b) => b.year_created - a.year_created)
    }
  }, [searchTerm, selectedCategory, selectedMediums, selectedColors, priceMinNum, priceMaxNum, sortBy])

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    selectedMediums.length +
    selectedColors.length +
    (priceMin !== '' ? 1 : 0) +
    (priceMax !== '' ? 1 : 0)

  const clearAllFilters = () => {
    setSelectedCategory(null)
    setSelectedMediums([])
    setSelectedColors([])
    setPriceMin('')
    setPriceMax('')
    setSearchTerm('')
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleMedium = (medium: string) => {
    setSelectedMediums(prev =>
      prev.includes(medium) ? prev.filter(m => m !== medium) : [...prev, medium]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Category */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-bold text-base">Category</h3>
          {expandedSections.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.category && (
          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0
              const isSelected = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isSelected ? null : cat)}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors capitalize text-sm ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-bold text-base">Price</h3>
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Min</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="input pl-7 py-2 text-sm"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Max</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="Any"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="input pl-7 py-2 text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'Under $200', min: '', max: '200' },
                { label: '$200-$500', min: '200', max: '500' },
                { label: '$500-$1,500', min: '500', max: '1500' },
                { label: 'Over $1,500', min: '1500', max: '' }
              ].map(preset => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setPriceMin(preset.min)
                    setPriceMax(preset.max)
                  }}
                  className="text-xs px-2 py-1 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Medium */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('medium')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-bold text-base">Medium</h3>
          {expandedSections.medium ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.medium && (
          <div className="space-y-1">
            {availableMediums.map(medium => {
              const isSelected = selectedMediums.includes(medium)
              return (
                <label
                  key={medium}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                    isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMedium(medium)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{medium}</span>
                  </div>
                  <span className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                    {mediumCounts[medium]}
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </div>

      {/* Color Swatches */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-bold text-base">Color</h3>
          {expandedSections.color ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.color && (
          <div className="grid grid-cols-4 gap-3">
            {availableColors.map(color => {
              const isSelected = selectedColors.includes(color)
              const swatch = COLOR_SWATCHES[color] || '#CCCCCC'
              return (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  title={`${color} (${colorCounts[color]})`}
                  className={`group relative flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${
                    isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                  }`}
                >
                  <span
                    className={`block w-8 h-8 rounded-full border ${
                      color === 'white' ? 'border-gray-300' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: swatch }}
                  />
                  <span className="text-[10px] text-gray-600 leading-tight text-center capitalize">
                    {color}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <Navigation />
      <main className="bg-white min-h-screen">
        <div className="container py-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">Discover Art</h1>
            <p className="text-lg text-gray-600">
              Find pieces from {SEED_ARTISTS.length} artists across North Carolina
            </p>
          </div>

          {/* Search + Sort + Mobile Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search artworks, artists, or styles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 py-3"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center justify-center gap-2 btn-outline relative"
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="input py-3 sm:w-48"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors capitalize"
                >
                  {selectedCategory}
                  <X size={14} />
                </button>
              )}
              {selectedMediums.map(m => (
                <button
                  key={m}
                  onClick={() => toggleMedium(m)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                >
                  {m}
                  <X size={14} />
                </button>
              ))}
              {selectedColors.map(c => (
                <button
                  key={c}
                  onClick={() => toggleColor(c)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: COLOR_SWATCHES[c] || '#CCC' }}
                  />
                  {c}
                  <X size={14} />
                </button>
              ))}
              {(priceMin !== '' || priceMax !== '') && (
                <button
                  onClick={() => { setPriceMin(''); setPriceMax('') }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                >
                  ${priceMin || '0'} - ${priceMax || 'any'}
                  <X size={14} />
                </button>
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-900 underline ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredArtworks.length}</span>{' '}
              of {SEED_ARTWORKS.length} works
            </p>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {filteredArtworks.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                  <p className="text-xl text-gray-700 mb-2 font-semibold">No artworks match these filters</p>
                  <p className="text-gray-600 mb-6">Try adjusting or clearing some filters to see more works.</p>
                  <button onClick={clearAllFilters} className="btn-primary">
                    Clear All Filters
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
                          <h3 className="font-semibold text-lg mb-2">
                            {artwork.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 capitalize">{artwork.category}</p>
                          <p className="text-2xl font-bold text-blue-600">${artwork.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFiltersOpen && (
            <div className="md:hidden fixed inset-0 z-50">
              <div
                className="fixed inset-0 bg-black/40"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="px-6 py-4">
                  <FilterSidebar />
                </div>
                <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
                  <button
                    onClick={clearAllFilters}
                    className="btn-outline flex-1"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="btn-primary flex-1"
                  >
                    View {filteredArtworks.length} works
                  </button>
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
