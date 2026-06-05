import { getRecentPosts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { SITE } from '@/lib/constants'
import Link from 'next/link'

/* ═══════════════════════════════════════════════
   Layout: minimal hero → Bento dashboard
   Ref: dashboard-hero.html
   ═══════════════════════════════════════════════ */

const skills = ['C / C++', 'Rust', 'Python', 'Go', 'Embedded Linux', 'Next.js']

const QUICK_LINKS = [
  { label: 'Blog', href: '/blog', desc: 'Thoughts & notes' },
  { label: 'Projects', href: '/projects', desc: 'Stuff I built' },
  { label: 'About', href: '/about', desc: 'Who I am' },
]

const hueStyles: Record<string, string> = {
  blue:   'hover:border-blue-500/30 hover:shadow-blue-500/8',
  amber:  'hover:border-amber-500/30 hover:shadow-amber-500/8',
  violet: 'hover:border-violet-500/30 hover:shadow-violet-500/8',
  emerald:'hover:border-emerald-500/30 hover:shadow-emerald-500/8',
  rose:   'hover:border-rose-500/30 hover:shadow-rose-500/8',
  cyan:   'hover:border-cyan-500/30 hover:shadow-cyan-500/8',
}

/* ─── Icons ─── */
function IconDoc()  { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg> }
function IconCode() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg> }
function IconUser() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> }
function IconGH()   { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg> }

/* ─── Card wrapper ─── */
function Card({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl border border-border/50 bg-surface/30 backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/3 ${className}`} style={style}>
      {children}
    </div>
  )
}

export default async function Home() {
  const recentPosts = await getRecentPosts(3)
  const latest = recentPosts[0]

  return (
    <div className="overflow-x-hidden">

      {/* ═══════════════════════════════════════
          SECTION 1 — Minimal Hero
         ═══════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Glow accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-3xl pointer-events-none" />

        <p className="text-sm text-muted/60 tracking-[0.2em] uppercase mb-3">Hello, I&apos;m</p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-fg mb-4">
          {SITE.name}
        </h1>
        <p className="max-w-md text-base text-muted/70 leading-relaxed mb-8">
          Embedded systems &amp; creative code.
          Building at the intersection of hardware and software.
        </p>

        {/* Quick links — replaces the old grid action cards */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface/30 backdrop-blur-sm px-5 py-2 text-sm text-fg/80 transition-all duration-200 hover:border-accent/40 hover:text-accent hover:-translate-y-0.5"
            >
              {l.label}
              <span className="hidden sm:inline text-[11px] text-muted/50">· {l.desc}</span>
            </Link>
          ))}
        </div>

        {/* Scroll hint */}
        <a href="#content" className="flex flex-col items-center gap-2 text-[11px] text-muted/30 tracking-widest uppercase hover:text-muted/50 transition-colors cursor-pointer group">
          <span className="w-6 h-10 border-2 border-muted/20 rounded-full relative group-hover:border-muted/40 transition-colors">
            <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-accent/60 rounded-full animate-bounce" />
          </span>
          Scroll
        </a>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — Bento Grid Dashboard
         ═══════════════════════════════════════ */}
      <section id="content" className="px-4 pb-20 max-w-5xl mx-auto">
        <p className="text-center text-[11px] text-muted/30 tracking-[0.15em] uppercase mb-3">Explore</p>
        <div className="w-8 h-px bg-accent/30 mx-auto mb-12" />

        {/* 3-column grid: left sidebar | main | right sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_240px] gap-4 lg:gap-5">

          {/* ─── Left Sidebar ─── */}

          {/* Bio + Social */}
          <Card className="flex flex-col items-center justify-center text-center gap-3 py-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center text-white font-bold text-lg">A</div>
            <div>
              <div className="text-sm font-semibold text-fg">{SITE.name}</div>
              <div className="text-[11px] text-muted/50">Embedded · Creative</div>
            </div>
            <div className="flex gap-2 mt-1">
              <a href="https://github.com/aphrosyne" className="w-8 h-8 rounded-lg bg-surface/50 border border-border/30 flex items-center justify-center text-muted/40 hover:text-fg hover:border-border/50 transition-all"><IconGH /></a>
            </div>
          </Card>

          {/* Latest posts */}
          <Card>
            <div className="text-[10px] text-muted/40 tracking-widest uppercase mb-3">Recent Posts</div>
            {recentPosts.slice(0, 3).map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}
                className="flex items-center gap-3 py-2 px-1.5 rounded-lg -mx-1.5 transition-colors hover:bg-surface/40 group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/[0.06] flex items-center justify-center shrink-0 text-sm group-hover:bg-accent/10 transition-colors">
                  📄
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-fg/80 truncate group-hover:text-accent transition-colors">{p.title}</div>
                  <div className="text-[11px] text-muted/40">{p.date}</div>
                </div>
              </Link>
            ))}
          </Card>

          {/* ─── Main Area ─── */}

          {/* Welcome + Stats row */}
          <div className="flex flex-col gap-4 lg:gap-5">

            {/* Welcome */}
            <Card className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center text-white font-bold text-lg shrink-0">A</div>
              <div>
                <div className="text-xs text-muted/50">Welcome back</div>
                <div className="text-base font-semibold text-fg">{SITE.name} <span className="text-muted/40 font-normal text-sm">· Embedded Developer</span></div>
              </div>
            </Card>

            {/* Stats */}
            <Card className="flex items-center justify-around py-4">
              {[
                { num: projects.length, label: 'Projects' },
                { num: recentPosts.length, label: 'Posts' },
                { num: skills.length, label: 'Skills' },
                { num: 3, label: 'Years' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-0.5">
                  <span className="text-lg font-semibold text-fg/90">{s.num}</span>
                  <span className="text-[10px] text-muted/40">{s.label}</span>
                </div>
              ))}
            </Card>

            {/* Projects showcase */}
            <Card>
              <div className="text-[10px] text-muted/40 tracking-widest uppercase mb-4">Projects</div>
              <div className="grid grid-cols-2 gap-3">
                {projects.slice(0, 4).map((p) => (
                  <Link key={p.slug} href={`/projects/${p.slug}`}
                    className="rounded-xl bg-surface/30 border border-border/30 p-4 transition-all duration-200 hover:border-border/50 hover:-translate-y-0.5 hover:shadow-sm group"
                  >
                    <div className="text-lg mb-2">🔧</div>
                    <div className="text-sm font-medium text-fg/80 group-hover:text-accent transition-colors">{p.title}</div>
                    <div className="text-[11px] text-muted/50 leading-snug mt-1 line-clamp-2">{p.description}</div>
                  </Link>
                ))}
              </div>
            </Card>

          </div>

          {/* ─── Right Sidebar ─── */}

          {/* Skills */}
          <Card>
            <div className="text-[10px] text-muted/40 tracking-widest uppercase mb-3">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s} className="rounded-lg border border-border/30 bg-surface/30 px-2.5 py-1 text-[11px] text-muted/60">{s}</span>
              ))}
            </div>
          </Card>

          {/* Quick links */}
          <Card>
            <div className="text-[10px] text-muted/40 tracking-widest uppercase mb-3">Quick Links</div>
            <div className="flex flex-col gap-1">
              {QUICK_LINKS.map((l) => (
                <Link key={l.label} href={l.href}
                  className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-surface/40 transition-colors group"
                >
                  <span className="text-sm text-fg/70 group-hover:text-accent transition-colors">{l.label}</span>
                  <span className="text-[11px] text-muted/40 group-hover:text-muted/60">{l.desc}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Contact */}
          <Card className="text-center">
            <div className="text-[10px] text-muted/40 tracking-widest uppercase mb-3">Get in Touch</div>
            <p className="text-xs text-muted/50 mb-3 leading-relaxed">Have a question or want to collaborate?</p>
            <a href="mailto:hello@aphrosyne.dev"
              className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-xs text-accent hover:bg-accent/20 transition-colors"
            >
              Say Hello
            </a>
          </Card>

        </div>
      </section>
    </div>
  )
}
