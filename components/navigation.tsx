'use client'

import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center space-x-2 font-bold text-2xl">
          <span className="text-blue-600">🎨</span>
          <span>Artkindred</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/discover" className="text-gray-700 hover:text-blue-600 transition-colors">
            Discover
          </Link>
          <Link href="/onboarding" className="text-gray-700 hover:text-blue-600 transition-colors">
            Your Taste
          </Link>
          <Link href="/recommended" className="text-gray-700 hover:text-blue-600 transition-colors">
            Recommended
          </Link>
          <Link href="/artist-login" className="text-gray-700 hover:text-blue-600 transition-colors">
            For Artists
          </Link>
          <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
            Admin
          </Link>
          <Link href="/cart" className="btn-primary">
            Cart
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container py-4 space-y-4">
            <Link href="/discover" className="block text-gray-700 hover:text-blue-600">
              Discover
            </Link>
            <Link href="/onboarding" className="block text-gray-700 hover:text-blue-600">
              Your Taste
            </Link>
            <Link href="/recommended" className="block text-gray-700 hover:text-blue-600">
              Recommended
            </Link>
            <Link href="/artist-login" className="block text-gray-700 hover:text-blue-600">
              For Artists
            </Link>
            <Link href="/admin" className="block text-gray-700 hover:text-blue-600">
              Admin
            </Link>
            <Link href="/cart" className="block btn-primary">
              Cart
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
