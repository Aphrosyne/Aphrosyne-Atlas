/**
 * Shared visual baseline for the three content-card families.
 * Keep this as class tokens rather than a wrapper so each card retains its semantic element.
 */
export const CONTENT_CARD_SURFACE =
  'group relative overflow-hidden rounded-2xl border border-border/40 bg-surface/50 backdrop-blur-md transition-[background-color,box-shadow] duration-300 hover:bg-surface/65 hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)]'

export const CONTENT_CARD_PADDING = 'p-5 sm:p-6'

export const CONTENT_CARD_FOCUS =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset'
