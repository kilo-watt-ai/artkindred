import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h2 className="text-white font-bold mb-4 text-lg">Artkindred</h2>
            <p className="text-sm leading-relaxed">
              Discovering and collecting art made approachable for everyone.
            </p>
          </div>
          <nav aria-label="Explore">
            <h2 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Explore</h2>
            <ul className="space-y-2 text-sm" role="list">
              <li>
                <Link href="/discover" className="hover:text-white transition-colors">
                  Discover Art
                </Link>
              </li>
              <li>
                <Link href="/recommended" className="hover:text-white transition-colors">
                  Recommendations
                </Link>
              </li>
              <li>
                <Link href="/artists" className="hover:text-white transition-colors">
                  Artists
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">
                  Find Your Taste
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="For Artists">
            <h2 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">For Artists</h2>
            <ul className="space-y-2 text-sm" role="list">
              <li>
                <Link href="/signin" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/artist-info" className="hover:text-white transition-colors">
                  Join Artkindred
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Contact</h2>
            <address className="not-italic">
              <ul className="space-y-2 text-sm" role="list">
                <li className="flex items-center gap-2">
                  <Mail size={16} aria-hidden="true" />
                  <a
                    href="mailto:hello@artkindred.com"
                    className="hover:text-white transition-colors"
                  >
                    hello@artkindred.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} aria-hidden="true" />
                  <span>Raleigh, North Carolina</span>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {year} Artkindred. All rights reserved.</p>
            <nav aria-label="Legal">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 justify-center" role="list">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
