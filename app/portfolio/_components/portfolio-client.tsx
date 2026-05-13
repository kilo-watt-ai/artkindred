'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Edit2,
  Eye,
  Plus,
  Mail,
  Package,
  CheckCircle,
  Truck,
  AlertCircle,
  ExternalLink,
  LogOut
} from 'lucide-react'
import { useSessionStore } from '@/lib/session'
import { useMessageStore, getThreadsForUser } from '@/lib/messages'
import {
  SEED_ARTISTS,
  SEED_ARTWORKS,
  MOCK_ORDERS
} from '@/lib/seed-data'
import type { Order } from '@/lib/types'
import { MessageThreadView } from '@/components/message-thread-view'

type Tab = 'overview' | 'listings' | 'orders' | 'inbox' | 'profile'

const ORDER_STATUS_META: Record<
  Order['status'],
  { label: string; color: string }
> = {
  pending: { label: 'New', color: 'bg-yellow-100 text-yellow-800' },
  accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800' },
  packed: { label: 'Packed', color: 'bg-indigo-100 text-indigo-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  problem: { label: 'Problem', color: 'bg-red-100 text-red-800' }
}

export function PortfolioClient() {
  const router = useRouter()
  const session = useSessionStore((s) => s.session)
  const signOut = useSessionStore((s) => s.signOut)
  const user_messages = useMessageStore((s) => s.user_messages)
  const read_overrides = useMessageStore((s) => s.read_overrides)

  const [tab, setTab] = useState<Tab>('overview')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  // Wait for client hydration before redirecting (zustand/persist rehydrates client-side)
  useEffect(() => {
    if (hydrated && session.type !== 'artist') {
      router.replace('/signin')
    }
  }, [hydrated, session, router])

  if (!hydrated || session.type !== 'artist') {
    return (
      <div className="container py-20 text-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    )
  }

  const artist = SEED_ARTISTS.find((a) => a.id === session.userId)
  if (!artist) {
    return (
      <div className="container py-20 text-center">
        <p className="text-gray-600 mb-4">Artist profile not found.</p>
        <button onClick={signOut} className="btn-primary">
          Sign out
        </button>
      </div>
    )
  }

  const myWorks = SEED_ARTWORKS.filter((a) => a.artist_id === artist.id)
  const myOrders = MOCK_ORDERS.filter((o) => o.artist_id === artist.id)

  const myThreads = getThreadsForUser(artist.id, user_messages, read_overrides)
  const unreadCount = myThreads.reduce((sum, t) => sum + t.unread, 0)

  const totalRevenue = myOrders.reduce((sum, o) => sum + o.amount, 0)

  const tabs: { value: Tab; label: string; count?: number }[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'listings', label: 'Listings', count: myWorks.length },
    { value: 'orders', label: 'Orders', count: myOrders.length },
    { value: 'inbox', label: 'Inbox', count: unreadCount > 0 ? unreadCount : undefined },
    { value: 'profile', label: 'Profile' }
  ]

  return (
    <div className="container py-10 md:py-12">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={artist.profile_photo_url}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600">Artist dashboard</p>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {artist.name.split(' ')[0]}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/artist/${artist.id}`}
            className="btn-outline inline-flex items-center gap-2 text-sm"
          >
            <Eye size={16} aria-hidden="true" />
            View public profile
          </Link>
          <button
            onClick={signOut}
            className="btn-outline inline-flex items-center gap-2 text-sm"
            aria-label="Sign out"
          >
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <div
        role="tablist"
        aria-label="Portfolio sections"
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
            {t.count !== undefined && (
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
          className="space-y-8"
        >
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-5">
              <p className="text-xs uppercase tracking-wide text-gray-600 mb-2">
                Published works
              </p>
              <p className="text-3xl font-bold">{myWorks.length}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs uppercase tracking-wide text-gray-600 mb-2">
                Orders
              </p>
              <p className="text-3xl font-bold">{myOrders.length}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs uppercase tracking-wide text-gray-600 mb-2">
                Total revenue
              </p>
              <p className="text-3xl font-bold">
                ${totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Mock data</p>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold mb-3">Quick actions</h2>
            <div className="flex flex-wrap gap-2">
              <button
                disabled
                className="btn-outline inline-flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="Coming with Supabase + Storage"
              >
                <Plus size={16} aria-hidden="true" />
                Add new artwork
              </button>
              <button
                disabled
                className="btn-outline inline-flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="Coming with Supabase auth"
              >
                <Edit2 size={16} aria-hidden="true" />
                Edit profile
              </button>
              <button
                onClick={() => setTab('inbox')}
                className="btn-outline inline-flex items-center gap-2 text-sm"
              >
                <Mail size={16} aria-hidden="true" />
                View inbox{unreadCount > 0 && ` (${unreadCount} unread)`}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Add/edit functionality requires Supabase auth + storage. Coming soon.
            </p>
          </div>
        </div>
      )}

      {tab === 'listings' && (
        <div
          id="panel-listings"
          role="tabpanel"
          aria-labelledby="tab-listings"
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {myWorks.length} {myWorks.length === 1 ? 'work' : 'works'} published
            </p>
            <button
              disabled
              className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Coming with Supabase"
            >
              <Plus size={16} aria-hidden="true" />
              Add artwork
            </button>
          </div>

          {myWorks.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-gray-600">No published works yet.</p>
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
              {myWorks.map((artwork) => (
                <li key={artwork.id} className="card overflow-hidden">
                  <div className="relative bg-gray-100 aspect-[4/3]">
                    <Image
                      src={artwork.image_urls[0]}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{artwork.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 capitalize">
                      {artwork.category} · {artwork.medium}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-blue-600">
                        ${artwork.price.toLocaleString()}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          artwork.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {artwork.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/artwork/${artwork.slug}`}
                        className="flex-1 btn-outline text-xs inline-flex items-center justify-center gap-1"
                      >
                        <ExternalLink size={12} aria-hidden="true" />
                        View
                      </Link>
                      <button
                        disabled
                        className="flex-1 btn-outline text-xs inline-flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Coming with Supabase"
                      >
                        <Edit2 size={12} aria-hidden="true" />
                        Edit
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
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
              <p className="text-sm text-gray-500">
                Orders for your work will show up here.
              </p>
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {myOrders.map((order) => {
                const work = SEED_ARTWORKS.find((a) => a.id === order.artwork_id)
                const status = ORDER_STATUS_META[order.status]
                const orderDate = new Date(order.created_at)
                return (
                  <li
                    key={order.id}
                    className="card p-4 flex flex-col sm:flex-row gap-4"
                  >
                    {work && (
                      <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={work.image_urls[0]}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 96px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-semibold">{work?.title ?? 'Artwork'}</h3>
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
                        <span className="font-semibold">
                          ${order.amount.toLocaleString()}
                        </span>{' '}
                        <span className="text-gray-500">
                          + ${order.shipping_cost} shipping
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

      {tab === 'inbox' && (
        <div
          id="panel-inbox"
          role="tabpanel"
          aria-labelledby="tab-inbox"
        >
          <MessageThreadView
            currentUserId={artist.id}
            otherRoleLabel="the buyer"
          />
        </div>
      )}

      {tab === 'profile' && (
        <div
          id="panel-profile"
          role="tabpanel"
          aria-labelledby="tab-profile"
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-1">
            <div className="card p-5">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={artist.profile_photo_url}
                  alt={`Portrait of ${artist.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mb-1">{artist.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{artist.location}</p>
              <button
                disabled
                className="w-full btn-outline text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Coming with Supabase"
              >
                <Edit2 size={14} aria-hidden="true" />
                Edit profile
              </button>
            </div>
          </div>
          <div className="md:col-span-2 space-y-5">
            <section className="card p-5">
              <h3 className="font-bold mb-2">Bio</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {artist.bio}
              </p>
            </section>
            <section className="card p-5">
              <h3 className="font-bold mb-2">Artist statement</h3>
              <p className="text-sm text-gray-700 leading-relaxed italic">
                {artist.artist_statement}
              </p>
            </section>
            <section className="card p-5">
              <h3 className="font-bold mb-2">Details</h3>
              <dl className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-gray-600">Location</dt>
                  <dd className="font-semibold">{artist.location}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Mediums</dt>
                  <dd className="font-semibold">{artist.mediums.join(', ')}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Price range</dt>
                  <dd className="font-semibold">
                    ${artist.price_range_min.toLocaleString()} – $
                    {artist.price_range_max.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600">Website</dt>
                  <dd className="font-semibold">
                    {artist.website ? (
                      <a
                        href={artist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {new URL(artist.website).hostname}
                      </a>
                    ) : (
                      <span className="text-gray-500">Not set</span>
                    )}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
