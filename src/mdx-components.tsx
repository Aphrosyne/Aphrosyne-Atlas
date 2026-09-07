import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import { publicPath } from '@/lib/public-path'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w一-鿿]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as { props: { children?: React.ReactNode } }).props.children)
  }
  return ''
}

function Head({ tag: Tag, children, ...props }: { tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; children?: React.ReactNode }) {
  const text = extractText(children)
  const id = slugify(text)
  return <Tag id={id} className="scroll-mt-20" {...props}>{children}</Tag>
}

const components: MDXComponents = {
  h1: (props) => <Head tag="h1" {...props} />,
  h2: (props) => <Head tag="h2" {...props} />,
  h3: (props) => <Head tag="h3" {...props} />,
  h4: (props) => <Head tag="h4" {...props} />,
  h5: (props) => <Head tag="h5" {...props} />,
  h6: (props) => <Head tag="h6" {...props} />,
  a: ({ href, ...props }) => {
    if (href?.startsWith('/')) {
      return <Link href={href} {...props} />
    }
    return <a href={href} {...props} />
  },
  img: ({ src, alt, ...props }) => {
    const normalizedSrc = typeof src === 'string' ? src.replaceAll('\\', '/') : src
    const imageSrc = typeof normalizedSrc === 'string' && normalizedSrc.startsWith('/')
      ? publicPath(normalizedSrc)
      : normalizedSrc
    // Content images have arbitrary dimensions, so the native element is the reliable static-export path.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageSrc} alt={alt ?? ''} loading="lazy" className="mx-auto h-auto max-w-full rounded-2xl" {...props} />
  },
}

export function useMDXComponents(): MDXComponents {
  return components
}
