# Artkindred 🎨

An invite-only artist marketplace focused on helping first-time collectors discover and buy art they love.

## Features

- **Buyer Discovery Flow** - Browse, search, and filter artworks
- **Taste Onboarding** - Visual preference flow for personalized recommendations
- **Smart Recommendations** - Rules-based recommendation engine
- **Artist Profiles** - Beautiful portfolio pages for each artist
- **Artwork Detail Pages** - Full artwork details with pricing and provenance
- **Admin Dashboard** - Manage artists, generate invite codes, view metrics
- **Responsive Design** - Mobile-first design that works everywhere

## Tech Stack

- **Next.js 16** with Turbopack
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Zustand** for state management
- **Supabase** for auth (configured, ready to wire up)
- **Lucide React** for icons

## Getting Started

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

3. Add your Supabase credentials to `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

This project is configured for deployment on Vercel. Connect your GitHub repo to Vercel for automatic deployments.

## Routes

- `/` - Home page with featured works
- `/discover` - Browse all artworks with filters
- `/onboarding` - Taste preference onboarding
- `/recommended` - Personalized recommendations
- `/artwork/[slug]` - Artwork detail pages
- `/artist/[id]` - Artist profile pages
- `/artists` - Artist directory
- `/admin` - Admin dashboard
- `/cart` - Shopping cart
- `/artist-login` - Artist authentication

## Project Structure

```
artkindred/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                 # Utilities and types
│   ├── types.ts        # TypeScript types
│   ├── seed-data.ts    # Sample artists and artworks
│   ├── store.ts        # Zustand state + recommendation engine
│   └── supabase.ts     # Supabase client
└── public/             # Static assets
```

## Next Steps

1. Set up Supabase project for auth and database
2. Implement database schema for persistent storage
3. Add Stripe payment integration
4. Build messaging system between buyers and artists
5. Implement order management
6. Add artist portfolio CMS
