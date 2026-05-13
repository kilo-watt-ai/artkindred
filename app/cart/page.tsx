import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'View artworks you have added to your cart.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: false }
}

export default function CartPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="container py-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-xl">
          <ShoppingCart
            className="w-16 h-16 text-gray-400 mx-auto mb-6"
            aria-hidden="true"
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Your cart is empty</h1>
          <p className="text-lg text-gray-600 mb-8">
            Browse artworks and add favorites here to check out.
          </p>
          <Link href="/discover" className="btn-primary text-base px-6 py-3">
            Continue exploring
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
