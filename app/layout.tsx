import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Artkindred - Discover Art That Speaks to You',
  description: 'An approachable, discovery-focused marketplace for discovering and collecting art. Made for first-time collectors.',
  openGraph: {
    title: 'Artkindred - Discover Art That Speaks to You',
    description: 'An approachable, discovery-focused marketplace for discovering and collecting art.',
    type: 'website',
    url: 'https://artkindred.com',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Artkindred'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artkindred - Discover Art That Speaks to You',
    description: 'Discover and collect art from emerging artists in North Carolina'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎨</text></svg>" />
      </head>
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  )
}
