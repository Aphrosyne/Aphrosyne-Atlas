'use client'

import { useRef, useState, type ComponentProps } from 'react'
import ArticleScrollRegion from './ArticleScrollRegion'

export default function CopyableCodeBlock(props: ComponentProps<'pre'>) {
  const codeRef = useRef<HTMLPreElement>(null)
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')

  async function copyCode() {
    const text = codeRef.current?.innerText
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="my-8 min-w-0">
      <div className="not-prose mb-2 flex items-center justify-end gap-3">
        <span className="text-xs text-reading-muted" role="status" aria-live="polite">
          {state === 'error' ? '复制失败，请手动选择代码' : state === 'copied' ? '代码已复制' : ''}
        </span>
        <button
          type="button"
          onClick={copyCode}
          className="min-h-11 min-w-20 cursor-pointer rounded-lg border border-border/60 bg-content-surface px-3 text-sm font-medium text-fg transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          aria-label="复制代码"
        >
          复制
        </button>
      </div>
      <ArticleScrollRegion label="可横向滚动的代码块">
        <pre {...props} ref={codeRef} />
      </ArticleScrollRegion>
    </div>
  )
}
