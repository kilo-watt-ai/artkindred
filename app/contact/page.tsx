import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="container py-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
          <div className="space-y-8">
            <div>
              <p className="text-gray-700 mb-4">hello@artkindred.com</p>
              <p className="text-gray-700">Raleigh, NC</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
