export interface PostMetadata {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  readingTime?: string
}

export interface Post extends PostMetadata {
  content: React.ReactNode
}
