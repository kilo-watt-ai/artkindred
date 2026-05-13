'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Send, Lock } from 'lucide-react'
import { useSessionStore } from '@/lib/session'
import { useMessageStore } from '@/lib/messages'
import { SEED_ARTWORKS, DEMO_BUYER_ID } from '@/lib/seed-data'
import type { Artist } from '@/lib/types'

interface Props {
  artist: Artist
  artworkId?: string
  open: boolean
  onClose: () => void
  // Optional override for the "from" identity. Defaults to the current session
  // (buyer userId, or DEMO_BUYER_ID for guests on send).
  fromUserId?: string
}

export function MessageCompose({
  artist,
  artworkId,
  open,
  onClose,
  fromUserId
}: Props) {
  const session = useSessionStore((s) => s.session)
  const sendMessage = useMessageStore((s) => s.sendMessage)

  const [content, setContent] = useState('')
  const [sent, setSent] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const artwork = artworkId
    ? SEED_ARTWORKS.find((a) => a.id === artworkId)
    : null

  const isGuest = session.type === 'guest'
  const isArtist = session.type === 'artist'

  // Focus the textarea when opened
  useEffect(() => {
    if (open && !sent && !isGuest && !isArtist) {
      textareaRef.current?.focus()
    }
  }, [open, sent, isGuest, isArtist])

  // Close on Escape, lock body scroll
  useEffect(() => {
    if (!open) return
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      const t = window.setTimeout(() => {
        setContent('')
        setSent(false)
      }, 200)
      return () => window.clearTimeout(t)
    }
  }, [open])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    const senderId =
      fromUserId ??
      (session.type === 'buyer' ? session.userId : DEMO_BUYER_ID)
    const senderName =
      session.type === 'buyer' ? session.name : undefined
    sendMessage({
      senderId,
      senderName,
      recipientId: artist.id,
      content: content.trim(),
      artworkId
    })
    setSent(true)
  }

  const headerLabel = artwork
    ? `Message ${artist.name} about "${artwork.title}"`
    : `Message ${artist.name}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-compose-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={artist.profile_photo_url}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">
                {sent ? 'Sent' : 'Message'}
              </p>
              <h2
                id="message-compose-title"
                className="font-semibold truncate"
              >
                {artist.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -m-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Guest state — prompt to sign in */}
          {isGuest && !sent && (
            <div className="text-center py-8">
              <Lock
                size={36}
                className="text-gray-400 mx-auto mb-3"
                aria-hidden="true"
              />
              <h3 className="font-bold mb-2">Sign in to message {artist.name.split(' ')[0]}</h3>
              <p className="text-sm text-gray-600 mb-5">
                Messaging keeps you and the artist connected on Artkindred —
                no email account needed. We&apos;ll save your conversations in
                your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href="/signin"
                  className="btn-primary text-sm"
                  onClick={onClose}
                >
                  Sign in or sign up
                </Link>
                <button onClick={onClose} className="btn-outline text-sm">
                  Maybe later
                </button>
              </div>
            </div>
          )}

          {/* Artist state — can't message themselves; offer inbox link */}
          {isArtist && !sent && (
            <div className="text-center py-8">
              <h3 className="font-bold mb-2">You&apos;re signed in as an artist</h3>
              <p className="text-sm text-gray-600 mb-5">
                To message {artist.name}, sign in as a collector. Or head to
                your portfolio inbox to reply to messages from buyers.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href="/portfolio"
                  className="btn-primary text-sm"
                  onClick={onClose}
                >
                  Go to my inbox
                </Link>
                <button onClick={onClose} className="btn-outline text-sm">
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Sent confirmation */}
          {sent && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-3">
                <Send size={20} aria-hidden="true" />
              </div>
              <h3 className="font-bold mb-2">Message sent</h3>
              <p className="text-sm text-gray-600 mb-5">
                {artist.name.split(' ')[0]} will get a notification and reply
                when they can. You&apos;ll see their response in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href="/account?tab=messages"
                  className="btn-primary text-sm"
                  onClick={onClose}
                >
                  Go to my inbox
                </Link>
                <button onClick={onClose} className="btn-outline text-sm">
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Compose form — for signed-in buyers */}
          {!isGuest && !isArtist && !sent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {artwork && (
                <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="relative w-14 h-14 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                    <Image
                      src={artwork.image_urls[0]}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">About this work</p>
                    <p className="font-semibold text-sm truncate">
                      {artwork.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      ${artwork.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              <div>
                <label
                  htmlFor="message-content"
                  className="block text-sm font-medium mb-1.5"
                >
                  Your message
                </label>
                <textarea
                  ref={textareaRef}
                  id="message-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="input"
                  placeholder={
                    artwork
                      ? `Hi ${artist.name.split(' ')[0]}, I love this piece...`
                      : `Hi ${artist.name.split(' ')[0]}, ...`
                  }
                  required
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {content.length}/2000
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="btn-primary text-sm inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} aria-hidden="true" />
                  Send message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
