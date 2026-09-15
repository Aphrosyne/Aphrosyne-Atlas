/**
 * Shared MDX typography contract. Blog and Knowledge may wrap it with their
 * own metadata and navigation, but their authored Markdown renders alike.
 */
export const ARTICLE_PROSE_CLASS =
  'article-prose prose max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-accent prose-a:no-underline [&_a:hover]:text-avatar-ring [&_a]:transition-colors prose-pre:border-0 prose-pre:bg-transparent prose-code:rounded prose-code:bg-code-bg/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm [&_pre_code]:bg-transparent'
