import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-accent">404</h1>
      <p className="mt-4 text-lg text-fg/60">这个页面不存在，可能已移动或链接有误。</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-medium text-on-accent hover:opacity-90 transition-opacity"
      >
        返回首页
      </Link>
    </div>
  )
}
