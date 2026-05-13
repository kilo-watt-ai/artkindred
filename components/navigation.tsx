'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingBag, User, Palette, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSessionStore } from '@/lib/session'

const GUEST_LINKS = [
  { href: '/discover', label: 'Discover' },
  { href: '/onboarding', label: 'Your Taste' },
  { href: '/recommended', label: 'Recommended' },
  { href: '/artists', label: 'Artists' },
  { href: '/artist-info', label: 'For Artists' }
]

const BUYER_LINKS = [
  { href: '/discover', label: 'Discover' },
  { href: '/recommended', label: 'Recommended' },
  { href: '/artists', label: 'Artists' }
]

const ARTIST_LINKS = [
  { href: '/portfolio', label: 'My Portfolio' },
  { href: '/discover', label: 'Discover' },
  { href: '/artists', label: 'Artists' }
]

const ADMIN_LINKS = [
  { href: '/admin', label: 'Admin' },
  { href: '/discover', label: 'Discover' },
  { href: '/artists', label: 'Artists' }
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const pathname = usePathname()
  const session = useSessionStore((s) => s.session)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Use guest links until hydrated to avoid hydration mismatch
  const navLinks = !hydrated
    ? GUEST_LINKS
    : session.type === 'admin'
      ? ADMIN_LINKS
      : session.type === 'artist'
        ? ARTIST_LINKS
        : session.type === 'buyer'
          ? BUYER_LINKS
          : GUEST_LINKS

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="container flex items-center justify-between h-16" aria-label="Primary">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-2xl"
          aria-label="Artkindred home"
        >
          <span aria-hidden="true" className="text-2xl leading-none">🎨</span>
          <span>Artkindred</span>
        </Link>

        <ul className="hidden md:flex items-center space-x-6" role="list">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname?.startsWith(link.href + '/')
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors text-sm font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
          {hydrated && session.type === 'buyer' && (
            <li>
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                aria-label={`Your account, ${session.name}`}
              >
                <User size={16} aria-hidden="true" />
                <span>Account</span>
              </Link>
            </li>
          )}
          {hydrated && session.type === 'guest' && (
            <li>
              <Link
                href="/signin"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User size={16} aria-hidden="true" />
                <span>Sign in</span>
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/cart"
              className="btn-primary inline-flex items-center gap-2 text-sm"
              aria-label="View cart"
            >
              <ShoppingBag size={16} aria-hidden="true" />
              <span>Cart</span>
            </Link>
          </li>
        </ul>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </nav>

      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-200 bg-white"
        >
          <ul className="container py-4 space-y-1" role="list">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname?.startsWith(link.href + '/')
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-3 py-3 rounded-lg text-base font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
            {hydrated && session.type === 'buyer' && (
              <li>
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <User size={18} aria-hidden="true" />
                  Account ({session.name})
                </Link>
              </li>
            )}
            {hydrated && session.type === 'artist' && (
              <li>
                <Link
                  href="/portfolio"
                  className="flex items-center gap-2 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Palette size={18} aria-hidden="true" />
                  My Portfolio
                </Link>
              </li>
            )}
            {hydrated && session.type === 'admin' && (
              <li>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Shield size={18} aria-hidden="true" />
                  Admin dashboard
                </Link>
              </li>
            )}
            {hydrated && session.type === 'guest' && (
              <li>
                <Link
                  href="/signin"
                  className="flex items-center gap-2 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <User size={18} aria-hidden="true" />
                  Sign in
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/cart"
                className="flex items-center gap-2 mx-3 mt-3 btn-primary justify-center py-3"
                aria-label="View cart"
              >
                <ShoppingBag size={18} aria-hidden="true" />
                <span>Cart</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
