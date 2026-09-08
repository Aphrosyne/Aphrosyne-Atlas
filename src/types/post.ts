import type { PublicationState } from '@/types/publication'

export interface PostMetadata {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  publication: PublicationState
  readingTime?: string
}

export interface Post extends PostMetadata {
  content: React.ReactNode
}
