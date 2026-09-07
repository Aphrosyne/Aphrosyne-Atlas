import { SITE } from '@/config/site'
import ThemeToggle from './ThemeToggle'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto px-4 pb-4">
      <div className="mx-auto max-w-5xl rounded-2xl bg-surface/50 backdrop-blur-xl border border-border/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-md text-fg/80">
          &copy; {year} {SITE.author} · 内容采用{' '}
          <a href={SITE.licensing.contentHref} target="_blank" rel="noreferrer" className="underline decoration-fg/30 underline-offset-2 hover:text-accent">
            {SITE.licensing.contentName}
          </a>
        </span>
        <ThemeToggle />
      </div>
    </footer>
  )
}
