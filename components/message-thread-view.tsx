'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Send, Mail, MessageSquare, User } from 'lucide-react'
import { useMessageStore, getThreadsForUser } from '@/lib/messages'
import { useSessionStore } from '@/lib/session'
import { SEED_ARTISTS, SEED_ARTWORKS } from '@/lib/seed-data'
import type { MessageThread } from '@/lib/messages'

interface DisplayInfo {
  name: string
  photoUrl: string | null
  link: string | null
  subtitle: string | null
}

interface Props {
  /** The current user's ID (buyer ID for buyers, artist ID for artists). */
  currentUserId: string
  /** Label used in fallback display. e.g. "the artist" or "the buyer". */
  otherRoleLabel: string
}

export function MessageThreadView({ currentUserId, otherRoleLabel }: Props) {
  const user_messages = useMessageStore((s) => s.user_messages)
  const read_overrides = useMessageStore((s) => s.read_overrides)
  const display_names = useMessageStore((s) => s.display_names)
  const sendMessage = useMessageStore((s) => s.sendMessage)
  const markThreadAsRead = useMessageStore((s) => s.markThreadAsRead)
  const session = useSessionStore((s) => s.session)

  // Resolve display info for any user ID — artists from SEED_ARTISTS,
  // buyers/others from the display_names lookup the store maintains.
  const getDisplayInfo = (userId: string): DisplayInfo => {
    const artist = SEED_ARTISTS.find((a) => a.id === userId)
    if (artist) {
      return {
        name: artist.name,
        photoUrl: artist.profile_photo_url,
        link: `/artist/${artist.id}`,
        subtitle: artist.location
      }
    }
    const stored = display_names[userId]
    return {
      name: stored ?? 'Collector',
      photoUrl: null,
      link: null,
      subtitle: 'Buyer'
    }
  }

  // Name to attach to messages we send (for the recipient's display).
  const ownDisplayName =
    SEED_ARTISTS.find((a) => a.id === currentUserId)?.name ??
    (session.type === 'buyer' ? session.name : undefined)

  const [hydrated, setHydrated] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [reply, setReply] = useState('')

  useEffect(() => {
    setHydrated(true)
  }, [])

  // Avoid SSR/client mismatch from persisted state
  const threads: MessageThread[] = hydrated
    ? getThreadsForUser(currentUserId, user_messages, read_overrides)
    : []

  // Auto-expand the first thread on mount if any
  useEffect(() => {
    if (hydrated && threads.length > 0 && expanded === null) {
      setExpanded(threads[0].threadKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, threads.length])

  // Mark a thread as read when expanded
  useEffect(() => {
    if (!hydrated || !expanded) return
    const thread = threads.find((t) => t.threadKey === expanded)
    if (thread && thread.unread > 0) {
      markThreadAsRead({
        userId: currentUserId,
        otherId: thread.otherUserId,
        artworkId: thread.artworkId
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, hydrated])

  if (!hydrated) {
    return <div className="card p-10 text-center text-gray-500">Loading…</div>
  }

  if (threads.length === 0) {
    return (
      <div className="card p-10 text-center">
        <Mail size={40} className="text-gray-400 mx-auto mb-3" aria-hidden="true" />
        <p className="font-semibold text-gray-700 mb-1">No conversations yet</p>
        <p className="text-sm text-gray-500">
          Conversations with {otherRoleLabel === 'the artist' ? 'artists' : 'buyers'} will show up here.
        </p>
      </div>
    )
  }

  const handleSend = (thread: MessageThread, e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return
    sendMessage({
      senderId: currentUserId,
      senderName: ownDisplayName,
      recipientId: thread.otherUserId,
      content: reply.trim(),
      artworkId: thread.artworkId
    })
    setReply('')
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* Thread list */}
      <ul role="list" className="space-y-2 md:col-span-1">
        {threads.map((thread) => {
          const other = getDisplayInfo(thread.otherUserId)
          const work = thread.artworkId
            ? SEED_ARTWORKS.find((a) => a.id === thread.artworkId)
            : null
          const isActive = expanded === thread.threadKey
          const lastDate = new Date(thread.last.created_at)
          return (
            <li key={thread.threadKey}>
              <button
                onClick={() => setExpanded(thread.threadKey)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-gray-200 bg-white'
                }`}
                aria-pressed={isActive}
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    {other.photoUrl ? (
                      <Image
                        src={other.photoUrl}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <User size={18} className="text-gray-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm truncate">
                        {other.name}
                      </span>
                      {thread.unread > 0 && (
                        <span
                          className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 bg-blue-600 text-white text-xs font-bold rounded-full"
                          aria-label={`${thread.unread} unread`}
                        >
                          {thread.unread}
                        </span>
                      )}
                    </div>
                    {work && (
                      <p className="text-xs text-gray-500 truncate">
                        Re: {work.title}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {thread.last.content}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {lastDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      {/* Active thread */}
      <div className="md:col-span-2">
        {expanded && (() => {
          const thread = threads.find((t) => t.threadKey === expanded)
          if (!thread) return null
          const other = getDisplayInfo(thread.otherUserId)
          const work = thread.artworkId
            ? SEED_ARTWORKS.find((a) => a.id === thread.artworkId)
            : null
          return (
            <div className="card flex flex-col">
              {/* Thread header */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    {other.photoUrl ? (
                      <Image
                        src={other.photoUrl}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <User size={18} className="text-gray-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    {other.link ? (
                      <Link
                        href={other.link}
                        className="font-semibold hover:text-blue-600 transition-colors"
                      >
                        {other.name}
                      </Link>
                    ) : (
                      <p className="font-semibold">{other.name}</p>
                    )}
                    {other.subtitle && (
                      <p className="text-xs text-gray-500">{other.subtitle}</p>
                    )}
                  </div>
                </div>
                {work && (
                  <Link
                    href={`/artwork/${work.slug}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 -m-2 mt-1"
                  >
                    <div className="relative w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                      <Image
                        src={work.image_urls[0]}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Re:</p>
                      <p className="text-sm font-medium truncate">{work.title}</p>
                    </div>
                  </Link>
                )}
              </div>

              {/* Messages */}
              <ul
                role="list"
                className="flex-1 p-4 space-y-3 max-h-[28rem] overflow-y-auto"
              >
                {thread.messages.map((msg) => {
                  const isOutgoing = msg.sender_id === currentUserId
                  const date = new Date(msg.created_at)
                  return (
                    <li
                      key={msg.id}
                      className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          isOutgoing
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        <p
                          className={`text-[10px] mt-1 ${
                            isOutgoing ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {date.toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>

              {/* Reply */}
              <form
                onSubmit={(e) => handleSend(thread, e)}
                className="p-3 border-t flex gap-2 items-end"
              >
                <label htmlFor="thread-reply" className="sr-only">
                  Reply
                </label>
                <textarea
                  id="thread-reply"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      handleSend(thread, e as unknown as React.FormEvent)
                    }
                  }}
                  placeholder="Write a reply…"
                  rows={2}
                  className="input flex-1 resize-none text-sm"
                  maxLength={2000}
                />
                <button
                  type="submit"
                  disabled={!reply.trim()}
                  className="btn-primary text-sm inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send reply"
                >
                  <Send size={14} aria-hidden="true" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          )
        })()}
        {!expanded && (
          <div className="card p-10 text-center">
            <MessageSquare
              size={40}
              className="text-gray-400 mx-auto mb-3"
              aria-hidden="true"
            />
            <p className="text-sm text-gray-500">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  )
}
