import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { OnboardingClient } from './_components/onboarding-client'

export const metadata: Metadata = {
  title: 'Find Your Taste',
  description:
    "Tell us what you love through a simple visual flow. We'll use your preferences to build personalized art recommendations.",
  alternates: { canonical: '/onboarding' },
  robots: { index: true, follow: true }
}

export default function OnboardingPage() {
  return (
    <>
      <Navigation />
      <main
        id="main-content"
        className="bg-gradient-to-b from-slate-50 to-white min-h-screen"
      >
        <Suspense
          fallback={
            <div className="container py-20 text-center text-gray-500">
              Loading…
            </div>
          }
        >
          <OnboardingClient />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
