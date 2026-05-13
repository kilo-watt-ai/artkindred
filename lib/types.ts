export interface Artist {
  id: string
  user_id: string
  name: string
  bio: string
  artist_statement: string
  profile_photo_url: string
  location: string
  mediums: string[]
  price_range_min: number
  price_range_max: number
  social_links: Record<string, string>
  website: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Artwork {
  id: string
  artist_id: string
  title: string
  slug: string
  description: string
  category: 'painting' | 'print' | 'photography' | 'sculpture'
  medium: string
  price: number
  image_urls: string[]
  dimensions: string
  orientation: 'portrait' | 'landscape' | 'square'
  color_tags: string[]
  year_created: number
  edition_type: 'original' | 'limited' | 'open'
  edition_size: number | null
  edition_number: number | null
  quantity_available: number
  condition: string
  is_framed: boolean
  has_coa: boolean
  shipping_price: number
  allows_offers: boolean
  status: 'draft' | 'published' | 'sold'
  created_at: string
  updated_at: string
}

export interface BuyerProfile {
  id: string
  user_id: string
  name: string
  preferences: BuyerPreferences
  favorite_artworks: string[]
  favorite_artists: string[]
  saved_addresses: Address[]
  saved_payments: SavedPayment[]
  created_at: string
  updated_at: string
}

export interface BuyerPreferences {
  liked_artworks: string[]
  disliked_artworks: string[]
  preferred_categories: string[]
  preferred_mediums: string[]
  preferred_colors: string[]
  price_range_min: number
  price_range_max: number
  preferred_sizes: string[]
  onboarding_complete: boolean
}

export interface Address {
  id: string
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  country: string
  is_default: boolean
}

export interface SavedPayment {
  id: string
  last_four: string
  card_brand: string
  is_default: boolean
}

export interface Order {
  id: string
  buyer_id: string
  artwork_id: string
  artist_id: string
  amount: number
  buyer_fee: number
  shipping_cost: number
  status: 'pending' | 'accepted' | 'packed' | 'shipped' | 'delivered' | 'problem'
  tracking_number?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  artwork_id?: string
  content: string
  read: boolean
  created_at: string
}

export interface ArtistInvite {
  id: string
  code: string
  created_by: string
  used_by?: string
  used_at?: string
  expires_at: string
  created_at: string
}
