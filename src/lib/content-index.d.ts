import type { PostMetadata } from '@/types/post'
import type { KnowledgeMetadata } from '@/types/knowledge'

export interface BlogContentEntry { relativePath: string; source: string; metadata: PostMetadata }
export interface KnowledgeContentEntry { relativePath: string; source: string; metadata: KnowledgeMetadata }
export function getCanonicalContentIndex(): Promise<{ blog: BlogContentEntry[]; knowledge: KnowledgeContentEntry[] }>
