import type { Metadata } from 'next'
import { Lock } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Artist Sign In',
  description:
    'Sign in to your Artkindred artist account to manage your portfolio, listings, and orders.',
  alternates: { canonical: '/artist-login' },
  robots: { index: false, follow: true }
}

export default function ArtistLoginPage() {
  return (
    <>
      <Navigation />
      <main
        id="main-content"
        className="container py-12 md:py-20 min-h-[60vh] flex items-center justify-center"
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Lock
              className="w-12 h-12 text-blue-600 mx-auto mb-4"
              aria-hidden="true"
            />
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Artist sign in</h1>
            <p className="text-gray-600">Access your portfolio and manage your listings</p>
          </div>

          <form className="card p-6 md:p-8 space-y-5" autoComplete="on">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="input"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <a
                  href="mailto:support@artkindred.com?subject=Password reset"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="input"
                required
              />
            </div>

            <button type="submit" className="w-full btn-primary py-2.5">
              Sign in
            </button>

            <p className="text-center text-sm text-gray-600 pt-2 border-t">
              Don&apos;t have an account?{' '}
              <a
                href="mailto:artists@artkindred.com?subject=Invite request"
                className="text-blue-600 hover:underline font-medium"
              >
                Request an invite
              </a>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
