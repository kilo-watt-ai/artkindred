'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Copy, Plus, Search, Check, LogOut, Lock } from 'lucide-react'
import { useSessionStore } from '@/lib/session'
import { SEED_ARTISTS, SEED_ARTWORKS } from '@/lib/seed-data'

type Tab = 'overview' | 'artists' | 'invites' | 'orders'

export function AdminDashboard() {
  const router = useRouter()
  const session = useSessionStore((s) => s.session)
  const signOut = useSessionStore((s) => s.signOut)

  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [inviteCodes, setInviteCodes] = useState<
    { code: string; used: boolean; created: string }[]
  >([
    { code: 'ARTIST-EARLY-001', used: true, created: '2026-04-02' },
    { code: 'ARTIST-EARLY-002', used: false, created: '2026-04-15' },
    { code: 'ARTIST-EARLY-003', used: false, created: '2026-05-01' }
  ])

  useEffect(() => {
    setHydrated(true)
  }, [])

  // Gate the admin dashboard to admin sessions only.
  // Show a sign-in CTA rather than auto-redirecting so it's obvious that
  // admin access is intentionally gated.
  if (hydrated && session.type !== 'admin') {
    return (
      <div className="container py-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <Lock
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            aria-hidden="true"
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin only</h1>
          <p className="text-gray-600 mb-6">
            The admin dashboard is restricted to marketplace operators.
            Sign in as admin to continue.
          </p>
          <Link href="/signin" className="btn-primary">
            Go to sign in
          </Link>
        </div>
      </div>
    )
  }

  if (!hydrated) {
    return (
      <div className="container py-20 text-center text-gray-500">
        Loading…
      </div>
    )
  }

  const generateInviteCode = () => {
    const segment = () =>
      Math.random().toString(36).slice(2, 6).toUpperCase()
    const newCode = `ARTIST-${segment()}-${segment()}`
    setInviteCodes((prev) => [
      ...prev,
      { code: newCode, used: false, created: new Date().toISOString().slice(0, 10) }
    ])
  }

  const copyToClipboard = async (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      setCopiedCode(text)
      window.setTimeout(() => setCopiedCode(null), 1500)
    }
  }

  const filteredArtists = SEED_ARTISTS.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs: { value: Tab; label: string }[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'artists', label: 'Artists' },
    { value: 'invites', label: 'Invites' },
    { value: 'orders', label: 'Orders' }
  ]

  return (
    <div className="container py-10 md:py-12">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1">Admin dashboard</h1>
          <p className="text-gray-600">Manage artists, invite codes, and orders</p>
        </div>
        <button
          onClick={() => {
            signOut()
            router.push('/')
          }}
          className="btn-outline inline-flex items-center gap-2 text-sm self-start"
          aria-label="Sign out of admin"
        >
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </button>
      </header>

      <div role="tablist" aria-label="Admin sections" className="flex gap-1 mb-8 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={activeTab === tab.value}
            aria-controls={`panel-${tab.value}`}
            id={`tab-${tab.value}`}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap text-sm ${
              activeTab === tab.value
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div
          id="panel-overview"
          role="tabpanel"
          aria-labelledby="tab-overview"
          className="grid sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total artists', value: SEED_ARTISTS.length },
            { label: 'Total artworks', value: SEED_ARTWORKS.length },
            {
              label: 'Active invites',
              value: inviteCodes.filter((c) => !c.used).length
            },
            { label: 'Total fees', value: '$0', subtle: 'No sales yet' }
          ].map((stat) => (
            <div key={stat.label} className="card p-5">
              <p className="text-gray-600 text-xs uppercase tracking-wide mb-2">
                {stat.label}
              </p>
              <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
              {stat.subtle && (
                <p className="text-xs text-gray-500 mt-1">{stat.subtle}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'artists' && (
        <div id="panel-artists" role="tabpanel" aria-labelledby="tab-artists">
          <div className="mb-5">
            <label htmlFor="artist-search" className="sr-only">
              Search artists
            </label>
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-3 text-gray-400 w-5 h-5"
                aria-hidden="true"
              />
              <input
                id="artist-search"
                type="search"
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left font-semibold">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left font-semibold">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left font-semibold">
                    Mediums
                  </th>
                  <th scope="col" className="px-6 py-3 text-right font-semibold">
                    Works
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredArtists.map((artist) => {
                  const works = SEED_ARTWORKS.filter((a) => a.artist_id === artist.id).length
                  return (
                    <tr key={artist.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{artist.name}</td>
                      <td className="px-6 py-4 text-gray-600">{artist.location}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {artist.mediums.slice(0, 2).join(', ')}
                      </td>
                      <td className="px-6 py-4 font-medium text-right">{works}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'invites' && (
        <div id="panel-invites" role="tabpanel" aria-labelledby="tab-invites">
          <button
            onClick={generateInviteCode}
            className="btn-primary mb-5 inline-flex items-center gap-2"
          >
            <Plus size={18} aria-hidden="true" />
            Generate new invite
          </button>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left font-semibold">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left font-semibold">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inviteCodes.map((invite) => (
                  <tr key={invite.code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono">{invite.code}</td>
                    <td className="px-6 py-4 text-gray-600">{invite.created}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          invite.used
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {invite.used ? 'Used' : 'Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => copyToClipboard(invite.code)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                        aria-label={`Copy invite code ${invite.code}`}
                      >
                        {copiedCode === invite.code ? (
                          <>
                            <Check size={14} aria-hidden="true" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} aria-hidden="true" />
                            Copy
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div
          id="panel-orders"
          role="tabpanel"
          aria-labelledby="tab-orders"
          className="card p-10 text-center"
        >
          <p className="text-lg font-semibold text-gray-700 mb-2">No orders yet</p>
          <p className="text-gray-500">
            Orders will appear here once buyers start purchasing artwork.
          </p>
        </div>
      )}
    </div>
  )
}
