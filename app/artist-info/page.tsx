import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'For Artists',
  description:
    'Join Artkindred as an invited artist. Sell your paintings, prints, photography, or sculpture directly to collectors. Keep 90% of your sale price.',
  alternates: { canonical: '/artist-info' }
}

const benefits = [
  'Reach first-time collectors looking for authentic work',
  'Keep 100% of your listed price — the platform fee is charged to the buyer, not deducted from your payout',
  'Polished profile and portfolio pages we host for you',
  'Direct on-platform messaging with buyers',
  'Order tracking with shipping status updates',
  'Editorial curation and discovery features for invited artists'
]

const steps = [
  {
    title: 'Request an invite',
    body: 'Email us with a link to your portfolio and a short note about your work.'
  },
  {
    title: 'Create your profile',
    body: 'Add your bio, artist statement, and location. Upload high-quality photos of your work.'
  },
  {
    title: 'List your work',
    body: 'Add title, medium, dimensions, edition info, price, and shipping details for each piece.'
  },
  {
    title: 'Connect and sell',
    body: 'Respond to messages, accept offers, and ship directly to buyers when work sells.'
  }
]

export default function ArtistInfoPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-white">
        <section className="container py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
              For Artists
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
              Sell your work directly to collectors
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Artkindred is an invite-only marketplace built for emerging artists in North Carolina.
              We focus on first-time collectors and curated discovery, so your work reaches people
              who genuinely want to live with it.
            </p>
            <a
              href="mailto:artists@artkindred.com?subject=Invite request"
              className="btn-primary text-base px-6 py-3 inline-flex"
            >
              Request an invite
            </a>
          </div>
        </section>

        <section
          aria-labelledby="why-join"
          className="bg-gray-50 py-12 md:py-16 border-y border-gray-100"
        >
          <div className="container max-w-3xl">
            <h2 id="why-join" className="text-2xl md:text-3xl font-bold mb-6">
              Why join Artkindred
            </h2>
            <ul className="space-y-3" role="list">
              {benefits.map((b) => (
                <li key={b} className="flex gap-3 items-start text-gray-800">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mt-0.5"
                    aria-hidden="true"
                  >
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="how-it-works" className="container py-12 md:py-16">
          <h2 id="how-it-works" className="text-2xl md:text-3xl font-bold mb-8">
            How it works
          </h2>
          <ol className="grid md:grid-cols-2 gap-6 max-w-4xl" role="list">
            {steps.map((s, i) => (
              <li key={s.title} className="card p-5 flex gap-4">
                <span
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                  <p className="text-gray-700 text-sm">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="container pb-12 md:pb-20">
          <div className="card bg-blue-50 border-blue-200 p-6 md:p-10 max-w-3xl">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              Ready to apply?
            </h2>
            <p className="text-gray-700 mb-5">
              We&apos;re a small, curated platform — we read every application personally. Tell us
              about your work and we&apos;ll be in touch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:artists@artkindred.com?subject=Invite request"
                className="btn-primary"
              >
                Request an invite
              </a>
              <Link href="/artists" className="btn-outline">
                See current artists
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
