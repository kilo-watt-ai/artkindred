import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { RecommendedClient } from './_components/recommended-client'

export const metadata: Metadata = {
  title: 'Recommended for You',
  description:
    'Personalized art recommendations based on your taste profile. Discover artworks that match what you love.',
  alternates: { canonical: '/recommended' },
  robots: { index: false, follow: true }
}

export default function RecommendedPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-white min-h-screen">
        <RecommendedClient />
      </main>
      <Footer />
    </>
  )
}
