'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Heart,
  Package,
  MessageSquare,
  Sparkles,
  MapPin,
  User,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Mail
} from 'lucide-react'
import { useSessionStore } from '@/lib/session'
import { usePreferenceStore } from '@/lib/store'
import {
  SEED_ARTISTS,
  SEED_ARTWORKS,
  MOCK_ORDERS,
  MOCK_MESSAGES,
  DEMO_BUYER_ID
} from '@/lib/seed-data'
import type { Address, Order } from '@/lib/types'

type Tab =
  | 'overview'
  | 'favorites'
  | 'preferences'
  | 'addresses'
  | 'orders'
  | 'messages'
  | 'profile'

const ORDER_STATUS_META: Record<
  Order['status'],
  { label: string; color: string }
> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800' },
  packed: { label: 'Packed', color: 'bg-indigo-100 text-indigo-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  problem: { label: 'Problem', color: 'bg-red-100 text-red-800' }
}

export function AccountClient() {
  const router = useRouter()
  const session = useSessionStore((s) => s.session)
  const signOut = useSessionStore((s) => s.signOut)
  const updateBuyer = useSessionStore((s) => s.updateBuyer)
  const addresses = useSessionStore((s) => s.buyer_addresses)
  const addAddress = useSessionStore((s) => s.addAddress)
  const removeAddress = useSessionStore((s) => s.removeAddress)
  const setDefaultAddress = useSessionStore((s) => s.setDefaultAddress)

  const preferences = usePreferenceStore((s) => s.preferences)
  const favoriteArtworks = usePreferenceStore((s) => s.favorite_artworks)
  const favoriteArtists = usePreferenceStore((s) => s.favorite_artists)
  const resetPreferences = usePreferenceStore((s) => s.reset)

  const [tab, setTab] = useState<Tab>('overview')
  const [hydrated, setHydrated] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && session.type !== 'buyer') {
      router.replace('/signin')
    }
  }, [hydrated, session, router])

  useEffect(() => {
    if (session.type === 'buyer') {
      setProfileName(session.name)
      setProfileEmail(session.email)
    }
  }, [session])

  const myOrders = useMemo(
    () => MOCK_ORDERS.filter((o) => o.buyer_id === DEMO_BUYER_ID),
    []
  )
  const myMessages = useMemo(
    () =>
      MOCK_MESSAGES.filter(
        (m) =>
          m.sender_id === DEMO_BUYER_ID || m.recipient_id === DEMO_BUYER_ID
      ).sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
    []
  )
  const unreadMessages = myMessages.filter(
    (m) => m.recipient_id === DEMO_BUYER_ID && !m.read
  ).length

  if (!hydrated || session.type !== 'buyer') {
    return (
      <div className="container py-20 text-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    )
  }

  const favoriteArtworkObjs = SEED_ARTWORKS.filter((a) =>
    favoriteArtworks.includes(a.id)
  )
  const favoriteArtistObjs = SEED_ARTISTS.filter((a) =>
    favoriteArtists.includes(a.id)
  )

  const tabs: { value: Tab; label: string; count?: number }[] = [
    { value: 'overview', label: 'Overview' },
    {
      value: 'favorites',
      label: 'Favorites',
      count: favoriteArtworks.length + favoriteArtists.length
    },
    { value: 'preferences', label: 'Taste' },
    { value: 'addresses', label: 'Addresses', count: addresses.length },
    { value: 'orders', label: 'Orders', count: myOrders.length },
    {
      value: 'messages',
      label: 'Inbox',
      count: unreadMessages > 0 ? unreadMessages : undefined
    },
    { value: 'profile', label: 'Profile' }
  ]

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateBuyer({ name: profileName.trim(), email: profileEmail.trim() })
    setEditingProfile(false)
  }

  return (
    <div className="container py-10 md:py-12">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-gray-600">Your account</p>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome, {session.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{session.email}</p>
        </div>
        <button
          onClick={signOut}
          className="btn-outline inline-flex items-center gap-2 text-sm self-start"
          aria-label="Sign out"
        >
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </button>
      </header>

      <div
        role="tablist"
        aria-label="Account sections"
        className="flex gap-1 mb-8 border-b overflow-x-auto"
      >
        {tabs.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={tab === t.value}
            aria-controls={`panel-${t.value}`}
            id={`tab-${t.value}`}
            onClick={() => setTab(t.value)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap text-sm ${
              tab === t.value
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span
                className={`ml-1.5 inline-flex items-center justify-center px-1.5 rounded-full text-xs ${
                  tab === t.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div
          id="panel-overview"
          role="tabpanel"
          aria-labelledby="tab-overview"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <button
            onClick={() => setTab('favorites')}
            className="card p-5 text-left hover:shadow-lg transition-shadow"
          >
            <Heart
              className="text-red-500 mb-3"
              size={24}
              aria-hidden="true"
            />
            <p className="text-2xl font-bold mb-1">{favoriteArtworks.length}</p>
            <p className="text-sm text-gray-600">Favorite artworks</p>
          </button>
          <button
            onClick={() => setTab('favorites')}
            className="card p-5 text-left hover:shadow-lg transition-shadow"
          >
            <Sparkles
              className="text-blue-500 mb-3"
              size={24}
              aria-hidden="true"
            />
            <p className="text-2xl font-bold mb-1">{favoriteArtistObjs.length}</p>
            <p className="text-sm text-gray-600">Favorite artists</p>
          </button>
          <button
            onClick={() => setTab('orders')}
            className="card p-5 text-left hover:shadow-lg transition-shadow"
          >
            <Package
              className="text-purple-500 mb-3"
              size={24}
              aria-hidden="true"
            />
            <p className="text-2xl font-bold mb-1">{myOrders.length}</p>
            <p className="text-sm text-gray-600">Orders</p>
          </button>
          <button
            onClick={() => setTab('messages')}
            className="card p-5 text-left hover:shadow-lg transition-shadow"
          >
            <MessageSquare
              className="text-green-500 mb-3"
              size={24}
              aria-hidden="true"
            />
            <p className="text-2xl font-bold mb-1">
              {myMessages.length}
              {unreadMessages > 0 && (
                <span className="text-sm text-blue-600 font-medium ml-2">
                  ({unreadMessages} unread)
                </span>
              )}
            </p>
            <p className="text-sm text-gray-600">Messages</p>
          </button>
        </div>
      )}

      {tab === 'favorites' && (
        <div
          id="panel-favorites"
          role="tabpanel"
          aria-labelledby="tab-favorites"
          className="space-y-8"
        >
          <section aria-labelledby="fav-artworks">
            <h2 id="fav-artworks" className="text-xl font-bold mb-4">
              Favorite artworks ({favoriteArtworks.length})
            </h2>
            {favoriteArtworkObjs.length === 0 ? (
              <div className="card p-10 text-center">
                <Heart
                  size={36}
                  className="text-gray-400 mx-auto mb-3"
                  aria-hidden="true"
                />
                <p className="font-semibold text-gray-700 mb-1">No favorites yet</p>
                <p className="text-sm text-gray-500 mb-4">
                  Tap the heart on any artwork to save it here.
                </p>
                <Link href="/discover" className="btn-primary text-sm">
                  Browse artworks
                </Link>
              </div>
            ) : (
              <ul
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                role="list"
              >
                {favoriteArtworkObjs.map((artwork) => {
                  const artist = SEED_ARTISTS.find(
                    (a) => a.id === artwork.artist_id
                  )
                  return (
                    <li key={artwork.id}>
                      <Link
                        href={`/artwork/${artwork.slug}`}
                        className="card overflow-hidden hover:shadow-lg transition-shadow block"
                      >
                        <div className="relative bg-gray-100 aspect-square">
                          <Image
                            src={artwork.image_urls[0]}
                            alt={artwork.title}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-500 mb-0.5 truncate">
                            {artist?.name}
                          </p>
                          <p className="font-semibold text-sm truncate">
                            {artwork.title}
                          </p>
                          <p className="text-sm font-bold text-blue-600 mt-1">
                            ${artwork.price.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="fav-artists">
            <h2 id="fav-artists" className="text-xl font-bold mb-4">
              Favorite artists ({favoriteArtists.length})
            </h2>
            {favoriteArtistObjs.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="font-semibold text-gray-700 mb-1">No favorite artists yet</p>
                <p className="text-sm text-gray-500 mb-4">
                  Visit an artist&apos;s page and tap the heart to save them.
                </p>
                <Link href="/artists" className="btn-primary text-sm">
                  Browse artists
                </Link>
              </div>
            ) : (
              <ul
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                role="list"
              >
                {favoriteArtistObjs.map((artist) => (
                  <li key={artist.id}>
                    <Link
                      href={`/artist/${artist.id}`}
                      className="card p-4 flex items-center gap-3 hover:shadow-lg transition-shadow"
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={artist.profile_photo_url}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{artist.name}</p>
                        <p className="text-xs text-gray-600 truncate">
                          {artist.location}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {tab === 'preferences' && (
        <div
          id="panel-preferences"
          role="tabpanel"
          aria-labelledby="tab-preferences"
          className="space-y-5 max-w-2xl"
        >
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="text-lg font-bold mb-1">Taste profile</h2>
                <p className="text-sm text-gray-600">
                  {preferences.onboarding_complete
                    ? `Built from ${preferences.liked_artworks.length} liked artworks during onboarding.`
                    : "You haven't completed taste onboarding yet."}
                </p>
              </div>
              <Link href="/onboarding" className="btn-outline text-sm whitespace-nowrap">
                {preferences.onboarding_complete ? 'Retake' : 'Start'}
              </Link>
            </div>
            <dl className="grid sm:grid-cols-2 gap-3 text-sm pt-3 border-t">
              <div>
                <dt className="text-gray-600">Liked during onboarding</dt>
                <dd className="font-semibold">
                  {preferences.liked_artworks.length} pieces
                </dd>
              </div>
              <div>
                <dt className="text-gray-600">Skipped/disliked</dt>
                <dd className="font-semibold">
                  {preferences.disliked_artworks.length} pieces
                </dd>
              </div>
              <div>
                <dt className="text-gray-600">Preferred categories</dt>
                <dd className="font-semibold">
                  {preferences.preferred_categories.length > 0
                    ? preferences.preferred_categories.join(', ')
                    : 'None set'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600">Preferred colors</dt>
                <dd className="font-semibold">
                  {preferences.preferred_colors.length > 0
                    ? preferences.preferred_colors.slice(0, 4).join(', ')
                    : 'None set'}
                </dd>
              </div>
            </dl>
          </div>
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Reset all preferences, likes, and favorites? This cannot be undone.'
                )
              ) {
                resetPreferences()
              }
            }}
            className="text-sm text-gray-600 hover:text-red-600 underline"
          >
            Reset all preferences and favorites
          </button>
        </div>
      )}

      {tab === 'addresses' && (
        <AddressTab
          addresses={addresses}
          showAddressForm={showAddressForm}
          setShowAddressForm={setShowAddressForm}
          addAddress={addAddress}
          removeAddress={removeAddress}
          setDefaultAddress={setDefaultAddress}
        />
      )}

      {tab === 'orders' && (
        <div
          id="panel-orders"
          role="tabpanel"
          aria-labelledby="tab-orders"
        >
          {myOrders.length === 0 ? (
            <div className="card p-10 text-center">
              <Package
                size={40}
                className="text-gray-400 mx-auto mb-3"
                aria-hidden="true"
              />
              <p className="font-semibold text-gray-700 mb-1">No orders yet</p>
              <p className="text-sm text-gray-500 mb-4">
                Your purchases will appear here.
              </p>
              <Link href="/discover" className="btn-primary text-sm">
                Browse artworks
              </Link>
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {myOrders.map((order) => {
                const work = SEED_ARTWORKS.find((a) => a.id === order.artwork_id)
                const artist = work
                  ? SEED_ARTISTS.find((a) => a.id === work.artist_id)
                  : null
                const status = ORDER_STATUS_META[order.status]
                const orderDate = new Date(order.created_at)
                const total = order.amount + order.buyer_fee + order.shipping_cost
                return (
                  <li
                    key={order.id}
                    className="card p-4 flex flex-col sm:flex-row gap-4"
                  >
                    {work && (
                      <Link
                        href={`/artwork/${work.slug}`}
                        className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
                      >
                        <Image
                          src={work.image_urls[0]}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 96px"
                          className="object-cover"
                        />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <h3 className="font-semibold">
                            {work?.title ?? 'Artwork'}
                          </h3>
                          {artist && (
                            <p className="text-xs text-gray-600">
                              by {artist.name}
                            </p>
                          )}
                        </div>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Order #{order.id} · {orderDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        Total{' '}
                        <span className="font-semibold">
                          ${total.toLocaleString()}
                        </span>
                      </p>
                      {order.tracking_number && (
                        <p className="text-xs text-gray-500 mt-1.5 font-mono">
                          Tracking: {order.tracking_number}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {tab === 'messages' && (
        <div
          id="panel-messages"
          role="tabpanel"
          aria-labelledby="tab-messages"
        >
          {myMessages.length === 0 ? (
            <div className="card p-10 text-center">
              <Mail
                size={40}
                className="text-gray-400 mx-auto mb-3"
                aria-hidden="true"
              />
              <p className="font-semibold text-gray-700 mb-1">No messages</p>
              <p className="text-sm text-gray-500">
                Conversations with artists will show up here.
              </p>
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {myMessages.map((msg) => {
                const isIncoming = msg.recipient_id === DEMO_BUYER_ID
                const otherParty = isIncoming
                  ? SEED_ARTISTS.find((a) => a.id === msg.sender_id)
                  : SEED_ARTISTS.find((a) => a.id === msg.recipient_id)
                const work = msg.artwork_id
                  ? SEED_ARTWORKS.find((a) => a.id === msg.artwork_id)
                  : null
                const date = new Date(msg.created_at)
                return (
                  <li
                    key={msg.id}
                    className={`card p-4 ${
                      isIncoming && !msg.read ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
                      <span className="font-medium text-gray-700">
                        {isIncoming ? `From ${otherParty?.name}` : `You wrote to ${otherParty?.name}`}
                        {isIncoming && !msg.read && (
                          <span className="ml-2 inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                            New
                          </span>
                        )}
                      </span>
                      <span>{date.toLocaleDateString()}</span>
                    </div>
                    {work && (
                      <p className="text-xs text-gray-600 mb-2">
                        Re:{' '}
                        <Link
                          href={`/artwork/${work.slug}`}
                          className="text-blue-600 hover:underline"
                        >
                          {work.title}
                        </Link>
                      </p>
                    )}
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {msg.content}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {tab === 'profile' && (
        <div
          id="panel-profile"
          role="tabpanel"
          aria-labelledby="tab-profile"
          className="max-w-xl"
        >
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-full">
                  <User size={24} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-bold">{session.name}</h2>
                  <p className="text-sm text-gray-600">{session.email}</p>
                </div>
              </div>
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="btn-outline text-sm"
                >
                  Edit
                </button>
              )}
            </div>
            {editingProfile && (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-3 border-t">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile-email"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="btn-primary text-sm">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileName(session.name)
                      setProfileEmail(session.email)
                      setEditingProfile(false)
                    }}
                    className="btn-outline text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function AddressTab({
  addresses,
  showAddressForm,
  setShowAddressForm,
  addAddress,
  removeAddress,
  setDefaultAddress
}: {
  addresses: Address[]
  showAddressForm: boolean
  setShowAddressForm: (v: boolean) => void
  addAddress: (a: Omit<Address, 'id'>) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
}) {
  const [form, setForm] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addAddress({
      line1: form.line1.trim(),
      line2: form.line2.trim() || undefined,
      city: form.city.trim(),
      state: form.state.trim().toUpperCase(),
      zip: form.zip.trim(),
      country: form.country,
      is_default: addresses.length === 0
    })
    setForm({ line1: '', line2: '', city: '', state: '', zip: '', country: 'US' })
    setShowAddressForm(false)
  }

  return (
    <div
      id="panel-addresses"
      role="tabpanel"
      aria-labelledby="tab-addresses"
      className="max-w-2xl"
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-gray-600">
          {addresses.length === 0
            ? 'No saved addresses yet'
            : `${addresses.length} saved ${addresses.length === 1 ? 'address' : 'addresses'}`}
        </p>
        {!showAddressForm && (
          <button
            onClick={() => setShowAddressForm(true)}
            className="btn-primary text-sm inline-flex items-center gap-1.5"
          >
            <Plus size={16} aria-hidden="true" />
            Add address
          </button>
        )}
      </div>

      {showAddressForm && (
        <form onSubmit={handleSubmit} className="card p-5 mb-5 space-y-3">
          <div>
            <label htmlFor="addr-line1" className="block text-sm font-medium mb-1.5">
              Street address
            </label>
            <input
              id="addr-line1"
              type="text"
              autoComplete="address-line1"
              required
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              className="input"
              placeholder="123 Main St"
            />
          </div>
          <div>
            <label htmlFor="addr-line2" className="block text-sm font-medium mb-1.5">
              Apt, suite, etc. (optional)
            </label>
            <input
              id="addr-line2"
              type="text"
              autoComplete="address-line2"
              value={form.line2}
              onChange={(e) => setForm({ ...form, line2: e.target.value })}
              className="input"
              placeholder="Apt 4B"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="addr-city" className="block text-sm font-medium mb-1.5">
                City
              </label>
              <input
                id="addr-city"
                type="text"
                autoComplete="address-level2"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="addr-state" className="block text-sm font-medium mb-1.5">
                State
              </label>
              <input
                id="addr-state"
                type="text"
                autoComplete="address-level1"
                required
                maxLength={2}
                value={form.state}
                onChange={(e) =>
                  setForm({ ...form, state: e.target.value.toUpperCase().slice(0, 2) })
                }
                className="input uppercase"
                placeholder="NC"
              />
            </div>
          </div>
          <div>
            <label htmlFor="addr-zip" className="block text-sm font-medium mb-1.5">
              ZIP code
            </label>
            <input
              id="addr-zip"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{5}"
              autoComplete="postal-code"
              required
              value={form.zip}
              onChange={(e) =>
                setForm({ ...form, zip: e.target.value.replace(/[^0-9]/g, '').slice(0, 5) })
              }
              className="input max-w-[8rem]"
              placeholder="27601"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary text-sm">
              Save address
            </button>
            <button
              type="button"
              onClick={() => setShowAddressForm(false)}
              className="btn-outline text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length > 0 && (
        <ul className="space-y-3" role="list">
          {addresses.map((addr) => (
            <li key={addr.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin
                      size={14}
                      className="text-gray-500 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold">
                      {addr.line1}
                      {addr.line2 ? `, ${addr.line2}` : ''}
                    </span>
                    {addr.is_default && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        <CheckCircle2 size={10} aria-hidden="true" />
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!addr.is_default && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Set default
                    </button>
                  )}
                  <button
                    onClick={() => removeAddress(addr.id)}
                    className="text-xs text-gray-500 hover:text-red-600"
                    aria-label="Remove address"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {addresses.length === 0 && !showAddressForm && (
        <div className="card p-10 text-center">
          <MapPin
            size={40}
            className="text-gray-400 mx-auto mb-3"
            aria-hidden="true"
          />
          <p className="font-semibold text-gray-700 mb-1">No saved addresses</p>
          <p className="text-sm text-gray-500 mb-4">
            Add an address to speed up checkout.
          </p>
          <button
            onClick={() => setShowAddressForm(true)}
            className="btn-primary text-sm inline-flex items-center gap-1.5"
          >
            <Plus size={16} aria-hidden="true" />
            Add your first address
          </button>
        </div>
      )}
    </div>
  )
}
