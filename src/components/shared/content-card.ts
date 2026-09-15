/**
 * Shared visual baseline for the three content-card families.
 * Keep this as class tokens rather than a wrapper so each card retains its semantic element.
 */
export const CONTENT_CARD_SURFACE =
  'group relative overflow-hidden rounded-2xl border border-border/40 bg-content-surface backdrop-blur-md transition-[background-color,box-shadow] duration-300 hover:bg-surface/65 hover:shadow-[var(--shadow-elevation-card)]'

export const CONTENT_CARD_PADDING = 'p-5 sm:p-6'

export const CONTENT_CARD_FOCUS =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset'
