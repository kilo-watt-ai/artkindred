import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE_URL = 'https://artkindred.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Artkindred — Discover Art That Speaks to You',
    template: '%s | Artkindred'
  },
  description:
    'An approachable, discovery-focused marketplace for finding and collecting art directly from artists. Made for first-time collectors.',
  keywords: [
    'art marketplace',
    'buy art online',
    'first-time art collector',
    'North Carolina artists',
    'paintings',
    'photography',
    'sculpture',
    'prints',
    'emerging artists'
  ],
  authors: [{ name: 'Artkindred' }],
  creator: 'Artkindred',
  publisher: 'Artkindred',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Artkindred — Discover Art That Speaks to You',
    description:
      'An approachable, discovery-focused marketplace for finding and collecting art directly from artists.',
    type: 'website',
    url: SITE_URL,
    siteName: 'Artkindred',
    locale: 'en_US',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Curated artworks on display in a gallery'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artkindred — Discover Art That Speaks to You',
    description: 'Discover and collect art from emerging artists in North Carolina.',
    images: [
      'https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=1200&h=630&fit=crop'
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  }
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
