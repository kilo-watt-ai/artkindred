'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { MessageCompose } from '@/components/message-compose'
import type { Artist } from '@/lib/types'

interface Props {
  artist: Artist
}

export function ContactArtistButton({ artist }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-primary inline-flex items-center gap-2"
        type="button"
      >
        <Mail size={18} aria-hidden="true" />
        Contact artist
      </button>
      <MessageCompose
        artist={artist}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
