'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import { SEED_ARTWORKS, SEED_ARTISTS, CATEGORIES, COLORS } from '@/lib/seed-data'

type SortOption = 'newest' | 'price-low' | 'price-high'

const COLOR_SWATCHES: Record<string, string> = {
  'warm orange': '#F97316',
  'soft yellow': '#FDE68A',
  'cool blue': '#60A5FA',
  white: '#FFFFFF',
  'deep purple': '#6B21A8',
  gold: '#D4AF37',
  navy: '#1E3A8A',
  black: '#000000',
  grey: '#9CA3AF',
  bronze: '#A97142',
  'warm brown': '#92400E',
  cream: '#FEF3C7',
  'soft grey': '#D1D5DB',
  'earth tone': '#A78A6F',
  'deep green': '#166534',
  'warm yellow': '#FBBF24',
  'soft pink': '#FBCFE8',
  'sage green': '#84A98C'
}

export function DiscoverClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedMediums, setSelectedMediums] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expanded, setExpanded] = useState({
    category: true,
    price: true,
    medium: true,
    color: true
  })

  const priceMinNum = priceMin === '' ? 0 : parseInt(priceMin) || 0
  const priceMaxNum = priceMax === '' ? Infinity : parseInt(priceMax) || Infinity

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    SEED_ARTWORKS.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1
    })
    return counts
  }, [])

  const mediumCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    SEED_ARTWORKS.forEach((a) => {
      counts[a.medium] = (counts[a.medium] || 0) + 1
    })
    return counts
  }, [])

  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    SEED_ARTWORKS.forEach((a) => {
      a.color_tags.forEach((c) => {
        counts[c] = (counts[c] || 0) + 1
      })
    })
    return counts
  }, [])

  // Derive mediums from actual artwork data so filter stays accurate
  // even when artist medium strings don't match a static list.
  const availableMediums = Object.keys(mediumCounts).sort()
  const availableColors = COLORS.filter((c) => colorCounts[c] > 0)

  const filteredArtworks = useMemo(() => {
    const filtered = SEED_ARTWORKS.filter((artwork) => {
      const artist = SEED_ARTISTS.find((a) => a.id === artwork.artist_id)
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
        selectedColors.some((c) => artwork.color_tags.includes(c))
      const matchesPrice = artwork.price >= priceMinNum && artwork.price <= priceMaxNum
      return (
        matchesSearch &&
        matchesCategory &&
        matchesMediums &&
        matchesColors &&
        matchesPrice
      )
    })

    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price)
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price)
      case 'newest':
      default:
        return [...filtered].sort((a, b) => b.year_created - a.year_created)
    }
  }, [
    searchTerm,
    selectedCategory,
    selectedMediums,
    selectedColors,
    priceMinNum,
    priceMaxNum,
    sortBy
  ])

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    selectedMediums.length +
    selectedColors.length +
    (priceMin !== '' ? 1 : 0) +
    (priceMax !== '' ? 1 : 0)

  const clearAll = () => {
    setSelectedCategory(null)
    setSelectedMediums([])
    setSelectedColors([])
    setPriceMin('')
    setPriceMax('')
    setSearchTerm('')
  }

  const toggleSection = (k: keyof typeof expanded) =>
    setExpanded((p) => ({ ...p, [k]: !p[k] }))

  const toggleMedium = (m: string) =>
    setSelectedMediums((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]))

  const toggleColor = (c: string) =>
    setSelectedColors((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]))

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-3"
          aria-expanded={expanded.category}
          aria-controls="filter-category"
        >
          <span className="font-bold text-base">Category</span>
          {expanded.category ? (
            <ChevronUp size={18} aria-hidden="true" />
          ) : (
            <ChevronDown size={18} aria-hidden="true" />
          )}
        </button>
        {expanded.category && (
          <div id="filter-category" className="space-y-1">
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
                  aria-pressed={isSelected}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3"
          aria-expanded={expanded.price}
          aria-controls="filter-price"
        >
          <span className="font-bold text-base">Price</span>
          {expanded.price ? (
            <ChevronUp size={18} aria-hidden="true" />
          ) : (
            <ChevronDown size={18} aria-hidden="true" />
          )}
        </button>
        {expanded.price && (
          <div id="filter-price" className="space-y-3">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label htmlFor="price-min" className="block text-xs text-gray-600 mb-1">
                  Min
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                  <input
                    id="price-min"
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="input pl-7 py-2 text-sm"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="price-max" className="block text-xs text-gray-600 mb-1">
                  Max
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                  <input
                    id="price-max"
                    type="number"
                    inputMode="numeric"
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
                { label: '$200–$500', min: '200', max: '500' },
                { label: '$500–$1,500', min: '500', max: '1500' },
                { label: 'Over $1,500', min: '1500', max: '' }
              ].map((preset) => (
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

      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('medium')}
          className="flex items-center justify-between w-full mb-3"
          aria-expanded={expanded.medium}
          aria-controls="filter-medium"
        >
          <span className="font-bold text-base">Medium</span>
          {expanded.medium ? (
            <ChevronUp size={18} aria-hidden="true" />
          ) : (
            <ChevronDown size={18} aria-hidden="true" />
          )}
        </button>
        {expanded.medium && (
          <div id="filter-medium" className="space-y-1">
            {availableMediums.map((medium) => {
              const isSelected = selectedMediums.includes(medium)
              return (
                <label
                  key={medium}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                    isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMedium(medium)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{medium}</span>
                  </span>
                  <span
                    className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    {mediumCounts[medium]}
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </div>

      <div className="pb-4">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full mb-3"
          aria-expanded={expanded.color}
          aria-controls="filter-color"
        >
          <span className="font-bold text-base">Color</span>
          {expanded.color ? (
            <ChevronUp size={18} aria-hidden="true" />
          ) : (
            <ChevronDown size={18} aria-hidden="true" />
          )}
        </button>
        {expanded.color && (
          <div id="filter-color" className="grid grid-cols-4 gap-3">
            {availableColors.map((color) => {
              const isSelected = selectedColors.includes(color)
              const swatch = COLOR_SWATCHES[color] || '#CCCCCC'
              return (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`group relative flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${
                    isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                  }`}
                  aria-label={`${color} (${colorCounts[color]} ${
                    colorCounts[color] === 1 ? 'work' : 'works'
                  })`}
                  aria-pressed={isSelected}
                >
                  <span
                    className={`block w-8 h-8 rounded-full border ${
                      color === 'white' ? 'border-gray-300' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: swatch }}
                    aria-hidden="true"
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
    <div className="container py-8">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover Art</h1>
        <p className="text-lg text-gray-600">
          Find pieces from {SEED_ARTISTS.length} artists across North Carolina
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <label htmlFor="discover-search" className="sr-only">
            Search artworks
          </label>
          <Search
            className="absolute left-3 top-3 text-gray-400 w-5 h-5"
            aria-hidden="true"
          />
          <input
            id="discover-search"
            type="search"
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
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="md:hidden flex items-center justify-center gap-2 btn-outline relative"
          aria-label={`Open filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
        >
          <SlidersHorizontal size={18} aria-hidden="true" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span
              className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              aria-hidden="true"
            >
              {activeFilterCount}
            </span>
          )}
        </button>
        <div>
          <label htmlFor="sort-by" className="sr-only">
            Sort by
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="input py-3 sm:w-48"
          >
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div
          className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b"
          aria-label="Active filters"
        >
          <span className="text-sm text-gray-600 font-medium">Active filters:</span>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors capitalize"
              aria-label={`Remove category filter ${selectedCategory}`}
            >
              {selectedCategory}
              <X size={14} aria-hidden="true" />
            </button>
          )}
          {selectedMediums.map((m) => (
            <button
              key={m}
              onClick={() => toggleMedium(m)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
              aria-label={`Remove medium filter ${m}`}
            >
              {m}
              <X size={14} aria-hidden="true" />
            </button>
          ))}
          {selectedColors.map((c) => (
            <button
              key={c}
              onClick={() => toggleColor(c)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
              aria-label={`Remove color filter ${c}`}
            >
              <span
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: COLOR_SWATCHES[c] || '#CCC' }}
                aria-hidden="true"
              />
              {c}
              <X size={14} aria-hidden="true" />
            </button>
          ))}
          {(priceMin !== '' || priceMax !== '') && (
            <button
              onClick={() => {
                setPriceMin('')
                setPriceMax('')
              }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
              aria-label="Remove price filter"
            >
              ${priceMin || '0'} – ${priceMax || 'any'}
              <X size={14} aria-hidden="true" />
            </button>
          )}
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-900 underline ml-auto"
          >
            Clear all
          </button>
        </div>
      )}

      <p className="mb-6 text-gray-600" aria-live="polite">
        Showing{' '}
        <span className="font-semibold text-gray-900">{filteredArtworks.length}</span> of{' '}
        {SEED_ARTWORKS.length} works
      </p>

      <div className="flex gap-8">
        <aside className="hidden md:block w-64 flex-shrink-0" aria-label="Filters">
          <div className="sticky top-24">
            <FilterSidebar />
          </div>
        </aside>

        <div className="flex-1">
          {filteredArtworks.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <p className="text-xl text-gray-700 mb-2 font-semibold">
                No artworks match these filters
              </p>
              <p className="text-gray-600 mb-6">
                Try adjusting or clearing some filters to see more works.
              </p>
              <button onClick={clearAll} className="btn-primary">
                Clear all filters
              </button>
            </div>
          ) : (
            <ul className="grid_auto" role="list">
              {filteredArtworks.map((artwork) => {
                const artist = SEED_ARTISTS.find((a) => a.id === artwork.artist_id)
                return (
                  <li key={artwork.id}>
                    <Link
                      href={`/artwork/${artwork.slug}`}
                      className="card overflow-hidden hover:shadow-lg transition-shadow block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                    >
                      <div className="relative bg-gray-100 aspect-[4/3]">
                        <Image
                          src={artwork.image_urls[0]}
                          alt={`${artwork.title} by ${artist?.name ?? 'Artist'}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-500 mb-1">{artist?.name}</p>
                        <h2 className="font-semibold text-lg mb-2">{artwork.title}</h2>
                        <p className="text-sm text-gray-600 mb-3 capitalize">
                          {artwork.category}
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          ${artwork.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filters">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close filters"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="px-6 py-4 flex-1">
              <FilterSidebar />
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
              <button onClick={clearAll} className="btn-outline flex-1">
                Clear all
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
  )
}
