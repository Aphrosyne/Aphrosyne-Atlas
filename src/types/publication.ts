export const PUBLICATION_STATES = ['published', 'archived', 'unlisted', 'draft'] as const

export type PublicationState = (typeof PUBLICATION_STATES)[number]

export function asPublicationState(value: unknown): PublicationState {
  return typeof value === 'string' && (PUBLICATION_STATES as readonly string[]).includes(value)
    ? value as PublicationState
    : 'published'
}

export function isRoutablePublication(publication: PublicationState): boolean {
  return publication !== 'draft'
}

export function isSearchablePublication(publication: PublicationState): boolean {
  return publication === 'published' || publication === 'archived'
}
