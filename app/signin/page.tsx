import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SignInClient } from './_components/signin-client'

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to Artkindred as a collector to save favorites and view orders, or as an artist to manage your portfolio.',
  alternates: { canonical: '/signin' },
  robots: { index: false, follow: true }
}

export default function SignInPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-white">
        <SignInClient />
      </main>
      <Footer />
    </>
  )
}
