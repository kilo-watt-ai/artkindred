import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Address } from './types'

export type Session =
  | { type: 'guest' }
  | { type: 'artist'; userId: string }
  | { type: 'buyer'; userId: string; name: string; email: string }

interface SessionStore {
  session: Session
  buyer_addresses: Address[]
  signInAsArtist: (artistId: string) => void
  signInAsBuyer: (name: string, email: string) => void
  signOut: () => void
  // Buyer profile management
  updateBuyer: (updates: Partial<{ name: string; email: string }>) => void
  addAddress: (address: Omit<Address, 'id'>) => void
  removeAddress: (id: string) => void
  updateAddress: (id: string, updates: Partial<Omit<Address, 'id'>>) => void
  setDefaultAddress: (id: string) => void
}

const guestSession: Session = { type: 'guest' }

function genId(): string {
  return `id-${Math.random().toString(36).slice(2, 10)}`
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      session: guestSession,
      buyer_addresses: [],

      signInAsArtist: (artistId) =>
        set({ session: { type: 'artist', userId: artistId } }),

      signInAsBuyer: (name, email) =>
        set((state) => ({
          session: {
            type: 'buyer',
            userId:
              state.session.type === 'buyer' ? state.session.userId : genId(),
            name,
            email
          }
        })),

      signOut: () => set({ session: guestSession }),

      updateBuyer: (updates) =>
        set((state) =>
          state.session.type === 'buyer'
            ? { session: { ...state.session, ...updates } }
            : state
        ),

      addAddress: (address) =>
        set((state) => {
          const newAddress: Address = { ...address, id: genId() }
          // If this is the first address, mark it as default
          const list = [...state.buyer_addresses, newAddress]
          if (list.length === 1) {
            list[0] = { ...list[0], is_default: true }
          } else if (address.is_default) {
            // If new one is marked default, unset others
            return {
              buyer_addresses: list.map((a) =>
                a.id === newAddress.id
                  ? a
                  : { ...a, is_default: false }
              )
            }
          }
          return { buyer_addresses: list }
        }),

      removeAddress: (id) =>
        set((state) => {
          const remaining = state.buyer_addresses.filter((a) => a.id !== id)
          // If we removed the default and there's still one left, promote the first
          if (
            remaining.length > 0 &&
            !remaining.some((a) => a.is_default)
          ) {
            remaining[0] = { ...remaining[0], is_default: true }
          }
          return { buyer_addresses: remaining }
        }),

      updateAddress: (id, updates) =>
        set((state) => ({
          buyer_addresses: state.buyer_addresses.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          )
        })),

      setDefaultAddress: (id) =>
        set((state) => ({
          buyer_addresses: state.buyer_addresses.map((a) => ({
            ...a,
            is_default: a.id === id
          }))
        }))
    }),
    {
      name: 'artkindred-session'
    }
  )
)
