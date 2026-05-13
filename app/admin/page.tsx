import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AdminDashboard } from './_components/admin-dashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Administrative tools for managing the Artkindred marketplace.',
  robots: { index: false, follow: false }
}

export default function AdminPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-gray-50 min-h-screen">
        <AdminDashboard />
      </main>
      <Footer />
    </>
  )
}
