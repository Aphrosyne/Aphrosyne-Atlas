'use client'

import { useEffect, useRef } from 'react'
import { SITE } from '@/config/site'

interface CopyAttributionProps {
  children: React.ReactNode
}

export default function CopyAttribution({ children }: CopyAttributionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onCopy = (e: ClipboardEvent) => {
      const selection = document.getSelection()
      if (!selection || selection.isCollapsed) return

      const selectedText = selection.toString().trim()
      if (!selectedText) return

      const url = window.location.href
      const today = new Date()
      const dateStr = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
      const attribution = `\n\nref(APA): ${SITE.author}.${url}. Retrieved ${dateStr}.`

      e.clipboardData?.setData('text/plain', selectedText + attribution)
      e.preventDefault()
    }

    el.addEventListener('copy', onCopy)
    return () => el.removeEventListener('copy', onCopy)
  }, [])

  return <div ref={ref}>{children}</div>
}
