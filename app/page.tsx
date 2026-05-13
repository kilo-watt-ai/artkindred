import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Users } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SEED_ARTWORKS, SEED_ARTISTS } from '@/lib/seed-data'

const SITE_URL = 'https://artkindred.vercel.app'

export default function Home() {
  const featuredArtworks = SEED_ARTWORKS.slice(0, 4)
  const featuredArtists = SEED_ARTISTS.slice(0, 3)

  // JSON-LD: Organization + WebSite + SearchAction
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': SITE_URL,
    name: 'Artkindred',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      'An approachable, discovery-focused marketplace for finding and collecting art directly from artists.',
    sameAs: [],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Raleigh',
      addressRegion: 'NC',
      addressCountry: 'US'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@artkindred.com',
      contactType: 'Customer Service'
    }
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Artkindred',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/discover?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <>
      <Navigation />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <main id="main-content" className="bg-gradient-to-b from-slate-50 to-white">
        <section className="container py-16 md:py-24 lg:py-32" aria-labelledby="hero-heading">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
                Invite-only artist marketplace
              </p>
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
              >
                Discover art that{' '}
                <span className="text-blue-600">speaks to you</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                An approachable way to find and collect art directly from artists.
                We help first-time collectors discover pieces they love — no jargon required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/onboarding"
                  className="btn-primary text-base px-6 py-3 inline-flex items-center justify-center gap-2"
                >
                  Find your taste
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/discover"
                  className="btn-outline text-base px-6 py-3 inline-flex items-center justify-center"
                >
                  Browse all art
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=1200&h=1200&fit=crop"
                alt="A gallery wall showcasing curated artworks"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section
          className="container py-16 md:py-20"
          aria-labelledby="featured-works"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 id="featured-works" className="text-3xl md:text-4xl font-bold mb-2">
                Featured works
              </h2>
              <p className="text-lg text-gray-600">
                Curated pieces from emerging artists in North Carolina
              </p>
            </div>
            <Link
              href="/discover"
              className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid_auto" role="list">
            {featuredArtworks.map((artwork) => {
              const artist = SEED_ARTISTS.find((a) => a.id === artwork.artist_id)
              return (
                <li key={artwork.id}>
                  <Link
                    href={`/artwork/${artwork.slug}`}
                    className="card overflow-hidden hover:shadow-lg transition-shadow block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                  >
                    <div className="relative bg-gray-100 aspect-[4/3]">
                      <Image
                        src={artwork.image_urls[0]}
                        alt={`${artwork.title} by ${artist?.name ?? 'Artist'}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-1">{artist?.name}</p>
                      <h3 className="font-semibold text-lg mb-2">{artwork.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 capitalize">
                        {artwork.category}
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        ${artwork.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        <section
          className="bg-white py-16 md:py-20 border-y border-gray-100"
          aria-labelledby="featured-artists"
        >
          <div className="container">
            <div className="mb-10">
              <h2 id="featured-artists" className="text-3xl md:text-4xl font-bold mb-2">
                Meet the artists
              </h2>
              <p className="text-lg text-gray-600">The creators behind the work</p>
            </div>
            <ul className="grid md:grid-cols-3 gap-6" role="list">
              {featuredArtists.map((artist) => (
                <li key={artist.id}>
                  <Link
                    href={`/artist/${artist.id}`}
                    className="card p-6 hover:shadow-lg transition-shadow block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                  >
                    <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-100">
                      <Image
                        src={artist.profile_photo_url}
                        alt={`Portrait of ${artist.name}`}
                        fill
                        sizes="5rem"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{artist.name}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-3">{artist.bio}</p>
                    <p className="text-sm text-gray-500">{artist.location}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="how-it-works"
          className="container py-16 md:py-20"
          aria-labelledby="how-it-works-heading"
        >
          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
          >
            How it works
          </h2>
          <ol className="grid md:grid-cols-3 gap-8" role="list">
            <li className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-blue-600" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Tell us your taste</h3>
              <p className="text-gray-600">
                A quick visual flow helps us understand what you love — no art knowledge needed.
              </p>
            </li>
            <li className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <Users className="w-8 h-8 text-blue-600" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Discover and connect</h3>
              <p className="text-gray-600">
                Get personalized recommendations and message artists directly through the platform.
              </p>
            </li>
            <li className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <Shield className="w-8 h-8 text-blue-600" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Buy with confidence</h3>
              <p className="text-gray-600">
                Transparent pricing, secure checkout, and artist profiles you can trust.
              </p>
            </li>
          </ol>
        </section>

        <section className="container py-16 md:py-20" aria-labelledby="cta-heading">
          <div className="bg-blue-600 text-white rounded-2xl p-8 md:p-14 text-center">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-4">
              Ready to find your next favorite piece?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-xl mx-auto">
              Start your art collection today with artists you can trust.
            </p>
            <Link
              href="/onboarding"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Start discovering
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
