import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.'
}

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="container py-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-xl">
          <p className="text-7xl font-bold text-blue-600 mb-4" aria-hidden="true">404</p>
          <h1 className="text-3xl font-bold mb-4">This page wandered off the gallery wall</h1>
          <p className="text-lg text-gray-600 mb-8">
            We couldn't find what you were looking for. The link may be broken or the page may have been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              Go home
            </Link>
            <Link href="/discover" className="btn-outline">
              Browse art
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
