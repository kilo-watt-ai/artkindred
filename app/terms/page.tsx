import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Artkindred terms of service for buyers and artists. Placeholder content — full terms will be in place before public launch.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true }
}

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="container py-12 md:py-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Placeholder — full terms coming before launch.</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold mb-2 text-gray-900">About these terms</h2>
              <p>
                These terms will govern the relationship between Artkindred, buyers, and artists.
                Full legal terms are being finalized and will be published before public launch.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-2 text-gray-900">What we&apos;ll cover</h2>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Buyer terms — purchasing, fees, refunds, returns</li>
                <li>Artist terms — listing rules, commissions, payouts, fulfillment</li>
                <li>Marketplace operator role and dispute resolution</li>
                <li>Acceptable use and content policies</li>
                <li>Limitation of liability and warranty disclaimers</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-2 text-gray-900">Questions</h2>
              <p>
                Email{' '}
                <a
                  href="mailto:hello@artkindred.com"
                  className="text-blue-600 hover:underline"
                >
                  hello@artkindred.com
                </a>{' '}
                with any questions.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
