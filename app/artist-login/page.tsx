'use client'

import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Lock } from 'lucide-react'

export default function ArtistLoginPage() {
  return (
    <>
      <Navigation />
      <main className="container py-20 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Artist Login</h1>
            <p className="text-gray-600">Access your portfolio and manage your listings</p>
          </div>

          <div className="card p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" placeholder="you@example.com" className="input" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input type="password" placeholder="••••••••" className="input" />
            </div>

            <button className="w-full btn-primary py-2">Sign In</button>

            <div className="text-center text-sm text-gray-600">
              <p>Don't have an account?</p>
              <a href="mailto:artists@artkindred.com" className="text-blue-600 hover:underline font-medium">
                Request an invite
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
