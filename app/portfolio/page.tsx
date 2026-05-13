import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PortfolioClient } from './_components/portfolio-client'

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'Manage your artist profile, listings, orders, and inbox.',
  robots: { index: false, follow: false }
}

export default function PortfolioPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-gray-50 min-h-screen">
        <PortfolioClient />
      </main>
      <Footer />
    </>
  )
}
