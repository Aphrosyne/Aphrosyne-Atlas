const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Prefix public assets and exported JSON endpoints with the configured host path. */
export function publicPath(path: string): string {
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`
}

/** Normalize a browser pathname so route comparisons work with or without a static base path. */
export function sitePathname(pathname: string): string {
  const withoutBasePath = basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))
    ? pathname.slice(basePath.length) || '/'
    : pathname

  return withoutBasePath === '/' ? '/' : withoutBasePath.replace(/\/+$/, '')
}
