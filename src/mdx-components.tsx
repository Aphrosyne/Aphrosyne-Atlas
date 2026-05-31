import type { MDXComponents } from 'mdx/types'
import Image, { type ImageProps } from 'next/image'

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="scroll-mt-20">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="scroll-mt-20">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="scroll-mt-20">{children}</h3>
  ),
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
