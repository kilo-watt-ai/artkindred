import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Artkindred collects, uses, and protects your information. Placeholder content — full policy will be in place before public launch.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true }
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="container py-12 md:py-16">
        <div className="max-w-2xl prose-headings:font-bold">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Placeholder — full policy coming before launch.</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold mb-2 text-gray-900">Our commitment</h2>
              <p>
                Artkindred is committed to protecting your privacy. This page is a placeholder
                while we finalize our full privacy policy with legal review before public launch.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-2 text-gray-900">What we&apos;ll cover</h2>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>What personal information we collect and why</li>
                <li>How buyer preference data is used for recommendations</li>
                <li>How we handle payment information through our payment processor</li>
                <li>Your rights to access, correct, or delete your data</li>
                <li>How we share information with artists for fulfilling orders</li>
                <li>Cookies and analytics</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-2 text-gray-900">Questions</h2>
              <p>
                Email{' '}
                <a
                  href="mailto:privacy@artkindred.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@artkindred.com
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
