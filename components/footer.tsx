import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">Artkindred</h3>
            <p className="text-sm">Discovering and collecting art made approachable for everyone.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
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
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">For Artists</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/artist-login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/artist-info" className="hover:text-white transition-colors">
                  Join Artkindred
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <a href="mailto:hello@artkindred.com" className="hover:text-white transition-colors">
                  hello@artkindred.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Raleigh, NC</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2026 Artkindred. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
