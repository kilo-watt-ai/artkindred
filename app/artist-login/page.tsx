import { redirect } from 'next/navigation'

// /artist-login is the old route; the unified flow lives at /signin.
export default function ArtistLoginPage() {
  redirect('/signin')
}
