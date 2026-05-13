'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Palette, ChevronRight, Shield } from 'lucide-react'
import { useSessionStore } from '@/lib/session'
import { SEED_ARTISTS } from '@/lib/seed-data'

type Mode = 'choose' | 'buyer' | 'artist'

export function SignInClient() {
  const router = useRouter()
  const session = useSessionStore((s) => s.session)
  const signInAsBuyer = useSessionStore((s) => s.signInAsBuyer)
  const signInAsArtist = useSessionStore((s) => s.signInAsArtist)
  const signInAsAdmin = useSessionStore((s) => s.signInAsAdmin)

  const [mode, setMode] = useState<Mode>('choose')
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleBuyerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!buyerName.trim()) {
      setError('Please enter your name')
      return
    }
    if (!buyerEmail.trim() || !buyerEmail.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    signInAsBuyer(buyerName.trim(), buyerEmail.trim())
    router.push('/account')
  }

  const handleArtistSignIn = (artistId: string) => {
    signInAsArtist(artistId)
    router.push('/portfolio')
  }

  const handleAdminSignIn = () => {
    signInAsAdmin()
    router.push('/admin')
  }

  // If already signed in, show a redirect option
  if (session.type !== 'guest') {
    const target =
      session.type === 'artist'
        ? '/portfolio'
        : session.type === 'admin'
          ? '/admin'
          : '/account'
    const label =
      session.type === 'artist'
        ? 'your portfolio'
        : session.type === 'admin'
          ? 'the admin dashboard'
          : 'your account'
    return (
      <div className="container py-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-3">You&apos;re already signed in</h1>
          <p className="text-gray-600 mb-6">Head to {label} to continue.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={target} className="btn-primary">
              Go to {label}
            </Link>
            <button
              onClick={() => useSessionStore.getState().signOut()}
              className="btn-outline"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-16 min-h-[60vh]">
      <div className="max-w-2xl mx-auto">
        {mode === 'choose' && (
          <>
            <header className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Sign in</h1>
              <p className="text-gray-600">
                Choose how you want to use Artkindred today.
              </p>
            </header>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setMode('buyer')}
                className="card p-6 text-left hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex p-2.5 rounded-lg bg-blue-50 text-blue-600">
                    <ShoppingBag size={22} aria-hidden="true" />
                  </span>
                  <ChevronRight
                    className="text-gray-400 group-hover:text-blue-600 transition-colors"
                    size={20}
                    aria-hidden="true"
                  />
                </div>
                <h2 className="font-bold text-lg mb-1">Continue as collector</h2>
                <p className="text-sm text-gray-600">
                  Save favorites, track orders, and get personalized recommendations.
                </p>
              </button>

              <button
                onClick={() => setMode('artist')}
                className="card p-6 text-left hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex p-2.5 rounded-lg bg-purple-50 text-purple-600">
                    <Palette size={22} aria-hidden="true" />
                  </span>
                  <ChevronRight
                    className="text-gray-400 group-hover:text-purple-600 transition-colors"
                    size={20}
                    aria-hidden="true"
                  />
                </div>
                <h2 className="font-bold text-lg mb-1">Sign in as artist</h2>
                <p className="text-sm text-gray-600">
                  Access your portfolio, listings, orders, and inbox.
                </p>
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-8">
              Note: This is a demo. Real authentication is coming once Supabase
              is wired up.
            </p>

            <div className="mt-10 pt-6 border-t border-dashed border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-2">Marketplace operator</p>
              <button
                onClick={handleAdminSignIn}
                className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors underline"
              >
                <Shield size={14} aria-hidden="true" />
                Sign in to admin dashboard (demo)
              </button>
            </div>
          </>
        )}

        {mode === 'buyer' && (
          <>
            <button
              onClick={() => setMode('choose')}
              className="text-sm text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-1"
            >
              ← Back
            </button>
            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Continue as a collector
              </h1>
              <p className="text-gray-600">
                We&apos;ll save your preferences, favorites, and order history to
                this device.
              </p>
            </header>

            <form
              onSubmit={handleBuyerSubmit}
              className="card p-6 md:p-8 space-y-5"
            >
              <div>
                <label htmlFor="buyer-name" className="block text-sm font-medium mb-1.5">
                  Your name
                </label>
                <input
                  id="buyer-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label htmlFor="buyer-email" className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  id="buyer-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="input"
                  required
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  We&apos;ll send order updates here. No password needed for the
                  demo.
                </p>
              </div>
              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}
              <button type="submit" className="w-full btn-primary py-2.5">
                Continue
              </button>
            </form>
          </>
        )}

        {mode === 'artist' && (
          <>
            <button
              onClick={() => setMode('choose')}
              className="text-sm text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-1"
            >
              ← Back
            </button>
            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Sign in as artist
              </h1>
              <p className="text-gray-600">
                Pick a demo artist account to explore the portfolio dashboard.
                Real auth (with email and invite codes) is coming with Supabase.
              </p>
            </header>

            <ul className="space-y-3" role="list">
              {SEED_ARTISTS.map((artist) => (
                <li key={artist.id}>
                  <button
                    onClick={() => handleArtistSignIn(artist.id)}
                    className="card p-4 w-full flex items-center gap-4 text-left hover:shadow-lg transition-shadow group"
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
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{artist.name}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {artist.location} · {artist.mediums.slice(0, 2).join(', ')}
                      </p>
                    </div>
                    <ChevronRight
                      className="text-gray-400 group-hover:text-blue-600 transition-colors"
                      size={20}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700">
              <p className="font-semibold mb-1">Want to join as a real artist?</p>
              <p>
                Artkindred is invite-only.{' '}
                <a
                  href="mailto:artists@artkindred.com?subject=Invite request"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Request an invite →
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
