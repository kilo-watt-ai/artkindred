import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AccountClient } from './_components/account-client'

export const metadata: Metadata = {
  title: 'Your Account',
  description:
    'Manage your favorites, preferences, addresses, and order history.',
  robots: { index: false, follow: false }
}

export default function AccountPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-gray-50 min-h-screen">
        <AccountClient />
      </main>
      <Footer />
    </>
  )
}
