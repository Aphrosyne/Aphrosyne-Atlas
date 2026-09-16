'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  void error
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-fg">页面暂时无法加载</h1>
      <p className="mt-4 text-fg/60">请重试；若问题持续出现，可返回首页后再访问。</p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-medium text-on-accent hover:opacity-90 transition-opacity"
      >
        重试
      </button>
    </div>
  )
}
