/**
 * On-platform messaging store.
 *
 * Persists messages locally so the demo feels real — buyers and artists
 * can compose and reply without leaving the platform. Real persistence
 * (cross-device sync, email notifications, moderation) lands when Supabase
 * is wired up; the public API of this store is shaped to match a typical
 * messages table (sender_id, recipient_id, artwork_id) so the migration
 * is small.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message } from './types'
import { MOCK_MESSAGES } from './seed-data'

interface MessageStore {
  // User-authored messages, persisted to localStorage. Combine with
  // MOCK_MESSAGES at read time for the inbox views.
  user_messages: Message[]
  // We track read state per-message because mocked messages live in seed
  // data — we don't mutate the source array; we override reads here.
  read_overrides: Record<string, boolean>
  // userId → display name. Captured when a user sends a message so we
  // can show readable names in the other party's inbox even when they
  // aren't in SEED_ARTISTS (e.g. buyers). Real implementation would
  // resolve this from a users table.
  display_names: Record<string, string>

  sendMessage: (params: {
    senderId: string
    senderName?: string
    recipientId: string
    content: string
    artworkId?: string
  }) => Message

  markAsRead: (id: string) => void
  markThreadAsRead: (params: { userId: string; otherId: string; artworkId?: string }) => void

  reset: () => void
}

function genId(): string {
  return `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      user_messages: [],
      read_overrides: {},
      display_names: {},

      sendMessage: ({ senderId, senderName, recipientId, content, artworkId }) => {
        const message: Message = {
          id: genId(),
          sender_id: senderId,
          recipient_id: recipientId,
          artwork_id: artworkId,
          content: content.trim(),
          read: false,
          created_at: new Date().toISOString()
        }
        set((state) => ({
          user_messages: [...state.user_messages, message],
          display_names: senderName
            ? { ...state.display_names, [senderId]: senderName }
            : state.display_names
        }))
        return message
      },

      markAsRead: (id) =>
        set((state) => ({
          read_overrides: { ...state.read_overrides, [id]: true }
        })),

      markThreadAsRead: ({ userId, otherId, artworkId }) =>
        set((state) => {
          const all = [...MOCK_MESSAGES, ...state.user_messages]
          const overrides = { ...state.read_overrides }
          all.forEach((m) => {
            if (
              m.recipient_id === userId &&
              m.sender_id === otherId &&
              (artworkId ? m.artwork_id === artworkId : true)
            ) {
              overrides[m.id] = true
            }
          })
          return { read_overrides: overrides }
        }),

      reset: () => set({ user_messages: [], read_overrides: {}, display_names: {} })
    }),
    {
      name: 'artkindred-messages'
    }
  )
)

/**
 * All messages visible to a given user — combined from seed + user-authored,
 * with read overrides applied. Sorted newest first.
 */
export function getMessagesForUser(
  userId: string,
  userMessages: Message[],
  readOverrides: Record<string, boolean>
): Message[] {
  const all = [...MOCK_MESSAGES, ...userMessages]
    .filter((m) => m.sender_id === userId || m.recipient_id === userId)
    .map((m) =>
      readOverrides[m.id] !== undefined ? { ...m, read: readOverrides[m.id] } : m
    )
  return all.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
}

/**
 * Group messages into threads by (other-participant, artwork).
 * Each thread's `last` is the most recent message; `unread` is the count
 * of unread inbound messages.
 */
export interface MessageThread {
  threadKey: string
  otherUserId: string
  artworkId?: string
  messages: Message[]
  last: Message
  unread: number
}

export function getThreadsForUser(
  userId: string,
  userMessages: Message[],
  readOverrides: Record<string, boolean>
): MessageThread[] {
  const visible = getMessagesForUser(userId, userMessages, readOverrides)
  const byKey = new Map<string, MessageThread>()

  for (const m of visible) {
    const otherUserId = m.sender_id === userId ? m.recipient_id : m.sender_id
    const key = `${otherUserId}::${m.artwork_id ?? ''}`
    if (!byKey.has(key)) {
      byKey.set(key, {
        threadKey: key,
        otherUserId,
        artworkId: m.artwork_id,
        messages: [],
        last: m,
        unread: 0
      })
    }
    const thread = byKey.get(key)!
    thread.messages.push(m)
    if (m.created_at > thread.last.created_at) thread.last = m
    if (m.recipient_id === userId && !m.read) thread.unread += 1
  }

  // Inside each thread, sort messages oldest→newest for display
  byKey.forEach((t) => {
    t.messages.sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
  })

  // Sort threads by most recent message
  return [...byKey.values()].sort((a, b) =>
    a.last.created_at < b.last.created_at ? 1 : -1
  )
}
