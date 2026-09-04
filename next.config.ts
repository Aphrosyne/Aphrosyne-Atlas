import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Permit the local-network preview address to load Next.js dev-only assets
  // and HMR while `next dev` still initializes on localhost by default.
  allowedDevOrigins: ['192.168.10.105'],
  reactCompiler: true,
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  serverExternalPackages: ['NeteaseCloudMusicApi'],
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [
      'rehype-slug',
      'rehype-autolink-headings',
      ['rehype-pretty-code', { theme: 'github-dark' }],
    ],
  },
})

export default withMDX(nextConfig)
