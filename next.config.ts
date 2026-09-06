import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/').at(-1)
const basePath = process.env.GITHUB_ACTIONS === 'true' && repositoryName
  ? `/${repositoryName}`
  : ''

const nextConfig: NextConfig = {
  // Permit the local-network preview address to load Next.js dev-only assets
  // and HMR while `next dev` still initializes on localhost by default.
  allowedDevOrigins: ['192.168.10.105'],
  reactCompiler: true,
  output: 'export',
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-gfm', 'remark-frontmatter'],
    rehypePlugins: [
      'rehype-slug',
      'rehype-autolink-headings',
      ['rehype-pretty-code', { theme: 'github-dark' }],
    ],
  },
})

export default withMDX(nextConfig)
