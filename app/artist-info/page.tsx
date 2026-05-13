import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function ArtistInfoPage() {
  return (
    <>
      <Navigation />
      <main className="container py-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-8">Become an Artkindred Artist</h1>
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">Why Join Artkindred?</h2>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Reach collectors looking for authentic work</li>
                <li>✓ Keep 90% of your sales</li>
                <li>✓ Beautiful portfolio management</li>
              </ul>
            </div>
          </div>
          <a href="mailto:artists@artkindred.com" className="btn-primary text-lg">
            Request an Invite
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}
