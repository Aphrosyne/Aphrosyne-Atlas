import type { MDXComponents } from 'mdx/types'
import type { ComponentProps } from 'react'
import ArticleScrollRegion from '@/components/content/ArticleScrollRegion'
import { IMAGE_DIMENSIONS } from '@/lib/image-dimensions'
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

function ArticleHeading({ id, children, ...props }: ComponentProps<'h2'>) {
  return (
    <h2 id={id} {...props}>
      {id && (
        <a href={`#${id}`} className="article-heading-anchor" aria-label="跳转到此标题">
          <span aria-hidden="true">#</span>
        </a>
      )}
      {children}
    </h2>
  )
}

function ArticleSubheading({ id, children, ...props }: ComponentProps<'h3'>) {
  return (
    <h3 id={id} {...props}>
      {id && (
        <a href={`#${id}`} className="article-heading-anchor" aria-label="跳转到此标题">
          <span aria-hidden="true">#</span>
        </a>
      )}
      {children}
    </h3>
  )
}

function ArticleLink({ href, ...props }: ComponentProps<'a'>) {
  return <a {...props} href={href?.startsWith('/') ? publicPath(href) : href} />
}

function ArticleImage({ src, alt = '', ...props }: ComponentProps<'img'>) {
  const sourcePath = typeof src === 'string' ? src : undefined
  const dimensions = sourcePath ? IMAGE_DIMENSIONS[sourcePath] : undefined
  const resolvedSrc = sourcePath?.startsWith('/') ? publicPath(sourcePath) : src
  // Static MDX assets use native images so the authored source and aspect ratio remain intact.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={resolvedSrc}
      alt={alt}
      width={dimensions?.width}
      height={dimensions?.height}
      loading={props.loading ?? "lazy"}
      decoding="async"
    />
  )
}

const components = {
  a: ArticleLink,
  h2: ArticleHeading,
  h3: ArticleSubheading,
  img: ArticleImage,
  table: ArticleTable,
  pre: ArticleCodeBlock,
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
