import createMDX from '@next/mdx'
import type { NextConfig } from 'next'
import { getDeploymentConfig } from './site.config.mjs'

const deployment = getDeploymentConfig()

const nextConfig: NextConfig = {
  // Permit the local-network preview address to load Next.js dev-only assets
  // and HMR while `next dev` still initializes on localhost by default.
  allowedDevOrigins: ['192.168.10.105'],
  reactCompiler: true,
  output: 'export',
  trailingSlash: true,
  basePath: deployment.basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: deployment.basePath,
    NEXT_PUBLIC_SITE_ORIGIN: deployment.siteOrigin,
  },
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-gfm', 'remark-frontmatter', 'remark-breaks'],
    rehypePlugins: [
      'rehype-slug',
      ['rehype-pretty-code', { theme: 'github-dark' }],
    ],
  },
})

export default withMDX(nextConfig)
