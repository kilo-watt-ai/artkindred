'use client'

import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ShoppingCart } from 'lucide-react'

export default function CartPage() {
  return (
    <>
      <Navigation />
      <main className="container py-20 min-h-screen">
        <div className="text-center">
          <ShoppingCart className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Your Cart Is Empty</h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore artworks and add them to your cart to get started
          </p>
          <Link href="/discover" className="btn-primary text-lg">
            Continue Exploring
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
