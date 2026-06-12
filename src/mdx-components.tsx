import type { MDXComponents } from 'mdx/types'
import Image, { type ImageProps } from 'next/image'

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
  img: (props) => (
    <Image
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
      {...(props as ImageProps)}
    />
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
