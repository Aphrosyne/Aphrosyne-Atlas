import type { MDXComponents } from 'mdx/types'
import type { ComponentProps } from 'react'
import ArticleScrollRegion from '@/components/content/ArticleScrollRegion'
import { publicPath } from '@/lib/public-path'

function ArticleTable(props: ComponentProps<'table'>) {
  return (
    <ArticleScrollRegion label="可横向滚动的表格">
      <table {...props} />
    </ArticleScrollRegion>
  )
}

function ArticleCodeBlock(props: ComponentProps<'pre'>) {
  return (
    <ArticleScrollRegion label="可横向滚动的代码块">
      <pre {...props} />
    </ArticleScrollRegion>
  )
}

function ArticleLink({ href, ...props }: ComponentProps<'a'>) {
  return <a {...props} href={href?.startsWith('/') ? publicPath(href) : href} />
}

function ArticleImage({ src, alt = '', ...props }: ComponentProps<'img'>) {
  const resolvedSrc = typeof src === 'string' && src.startsWith('/') ? publicPath(src) : src
  // Static MDX assets use native images so the authored source and aspect ratio remain intact.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} src={resolvedSrc} alt={alt} />
}

const components = {
  a: ArticleLink,
  img: ArticleImage,
  table: ArticleTable,
  pre: ArticleCodeBlock,
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
