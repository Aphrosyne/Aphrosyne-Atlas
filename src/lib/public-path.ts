const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Prefix public assets and exported JSON endpoints with the configured host path. */
export function publicPath(path: string): string {
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`
}
