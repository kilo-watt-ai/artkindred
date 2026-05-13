'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SEED_ARTISTS, SEED_ARTWORKS } from '@/lib/seed-data'
import { Copy, Plus, Search } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'artists' | 'invites' | 'orders'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [inviteCodes, setInviteCodes] = useState<{ code: string; used: boolean }[]>([
    { code: 'ARTIST-EARLY-001', used: true },
    { code: 'ARTIST-EARLY-002', used: false },
    { code: 'ARTIST-EARLY-003', used: false }
  ])

  const generateInviteCode = () => {
    const newCode = `ARTIST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    setInviteCodes([...inviteCodes, { code: newCode, used: false }])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredArtists = SEED_ARTISTS.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Navigation />
      <main className="bg-gray-50 min-h-screen">
        <div className="container py-12">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage artists, invites, and orders</p>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b">
            {(['overview', 'artists', 'invites', 'orders'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="card p-6">
                <p className="text-gray-600 text-sm mb-2">Total Artists</p>
                <p className="text-4xl font-bold">{SEED_ARTISTS.length}</p>
              </div>
              <div className="card p-6">
                <p className="text-gray-600 text-sm mb-2">Total Artworks</p>
                <p className="text-4xl font-bold">{SEED_ARTWORKS.length}</p>
              </div>
              <div className="card p-6">
                <p className="text-gray-600 text-sm mb-2">Active Invites</p>
                <p className="text-4xl font-bold">{inviteCodes.filter(c => !c.used).length}</p>
              </div>
              <div className="card p-6">
                <p className="text-gray-600 text-sm mb-2">Total Fees</p>
                <p className="text-4xl font-bold">$0</p>
              </div>
            </div>
          )}

          {/* Artists Tab */}
          {activeTab === 'artists' && (
            <div>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search artists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Works</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredArtists.map(artist => {
                      const works = SEED_ARTWORKS.filter(a => a.artist_id === artist.id).length
                      return (
                        <tr key={artist.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{artist.name}</td>
                          <td className="px-6 py-4 text-gray-600">{artist.location}</td>
                          <td className="px-6 py-4 font-medium">{works}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Invites Tab */}
          {activeTab === 'invites' && (
            <div>
              <button onClick={generateInviteCode} className="btn-primary mb-6 flex items-center gap-2">
                <Plus size={18} />
                Generate New Invite
              </button>

              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {inviteCodes.map((invite, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm">{invite.code}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              invite.used
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {invite.used ? 'Used' : 'Available'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => copyToClipboard(invite.code)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                          >
                            <Copy size={14} />
                            Copy
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="card p-8 text-center">
              <p className="text-gray-600 text-lg mb-4">No orders yet</p>
              <p className="text-gray-500">Orders will appear here once buyers start purchasing</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
