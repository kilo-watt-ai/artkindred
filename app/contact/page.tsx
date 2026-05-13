import type { Metadata } from 'next'
import { Mail, MapPin, HelpCircle, Users } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Artkindred. Questions about buying, selling, or anything else — we typically reply within 24 hours.',
  alternates: { canonical: '/contact' }
}

const contacts = [
  {
    label: 'General inquiries',
    email: 'hello@artkindred.com',
    icon: HelpCircle,
    note: 'Buyers, press, partnerships'
  },
  {
    label: 'For artists',
    email: 'artists@artkindred.com',
    icon: Users,
    note: 'Invite requests, listings, portfolio help'
  },
  {
    label: 'Support',
    email: 'support@artkindred.com',
    icon: Mail,
    note: 'Order issues, account help, shipping'
  }
]

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="container py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact us</h1>
          <p className="text-lg text-gray-700 mb-10">
            Have a question? We typically reply within 24 hours.
          </p>

          <section aria-labelledby="contact-emails" className="mb-12">
            <h2 id="contact-emails" className="sr-only">
              Email addresses
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4" role="list">
              {contacts.map((c) => {
                const Icon = c.icon
                return (
                  <li key={c.email} className="card p-5">
                    <div className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 p-2 bg-blue-50 text-blue-600 rounded-lg"
                        aria-hidden="true"
                      >
                        <Icon size={20} />
                      </span>
                      <div>
                        <h3 className="font-bold mb-1">{c.label}</h3>
                        <p className="text-xs text-gray-600 mb-2">{c.note}</p>
                        <a
                          href={`mailto:${c.email}`}
                          className="text-blue-600 hover:underline text-sm font-medium break-all"
                        >
                          {c.email}
                        </a>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          <section aria-labelledby="our-location" className="card p-6 md:p-8">
            <h2 id="our-location" className="text-xl font-bold mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" aria-hidden="true" />
              Our location
            </h2>
            <address className="text-gray-700 not-italic">Raleigh, North Carolina</address>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
