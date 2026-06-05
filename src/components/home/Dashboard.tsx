'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import CountUp from '@/components/shared/CountUp'
import type { PostMetadata } from '@/types/post'

interface DashboardProps {
  siteName: string
  recentPosts: PostMetadata[]
  projects: { slug: string; title: string; description: string }[]
  skills: string[]
}

const QUICK_LINKS = [
  { label: 'Blog', href: '/blog', desc: 'Thoughts & notes' },
  { label: 'Projects', href: '/projects', desc: 'Stuff I built' },
  { label: 'About', href: '/about', desc: 'Who I am' },
]

/* ─── Icons ─── */
function IconGH() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, scale: 1.015, boxShadow: '0 10px 40px -10px rgba(37, 99, 235, 0.12)' }}
      whileTap={{ scale: 0.985 }}
      className={`rounded-2xl border border-border/50 bg-surface/30 backdrop-blur-xl p-5 hover:border-accent/20 transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  )
}

function ProjectSubCard({ project }: { project: DashboardProps['projects'][number] }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="rounded-xl bg-surface/30 border border-border/30 p-4 hover:border-accent/20 transition-colors duration-200 group cursor-pointer"
    >
      <div className="text-lg mb-2">🔧</div>
      <div className="text-sm font-medium text-fg/80 group-hover:text-accent transition-colors">{project.title}</div>
      <div className="text-[11px] text-muted/50 leading-snug mt-1 line-clamp-2">{project.description}</div>
    </motion.div>
  )
}

export default function Dashboard({ siteName, recentPosts, projects, skills }: DashboardProps) {
  return (
    <section id="content" className="px-4 pb-20 max-w-5xl mx-auto">
      <p className="text-center text-[11px] text-muted/30 tracking-[0.15em] uppercase mb-3">Explore</p>
      <div className="w-8 h-px bg-accent/30 mx-auto mb-12" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-[220px_1fr_240px] gap-4 lg:gap-5"
      >
        {/* ─── Left Sidebar ─── */}

        {/* Bio + Social */}
        <Card className="flex flex-col items-center justify-center text-center gap-3 py-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center text-white font-bold text-lg">A</div>
          <div>
            <div className="text-sm font-semibold text-fg">{siteName}</div>
            <div className="text-[11px] text-muted/50">Embedded · Creative</div>
          </div>
          <div className="flex gap-2 mt-1">
            <a href="https://github.com/aphrosyne" className="w-8 h-8 rounded-lg bg-surface/50 border border-border/30 flex items-center justify-center text-muted/40 hover:text-fg hover:border-border/50 transition-all">
              <IconGH />
            </a>
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

        <div className="flex flex-col gap-4 lg:gap-5">
          {/* Welcome */}
          <Card className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center text-white font-bold text-lg shrink-0">A</div>
            <div>
              <div className="text-xs text-muted/50">Welcome back</div>
              <div className="text-base font-semibold text-fg">
                {siteName} <span className="text-muted/40 font-normal text-sm">· Embedded Developer</span>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card className="flex items-center justify-around py-4">
            {[
              { num: projects.length, label: 'Projects' },
              { num: recentPosts.length, label: 'Posts' },
              { num: skills.length, label: 'Skills' },
              { num: 3, label: 'Years' },
            ].map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5">
                <CountUp to={s.num} delay={i * 0.15} className="text-lg font-semibold text-fg/90" />
                <span className="text-[10px] text-muted/40">{s.label}</span>
              </div>
            ))}
          </Card>

          {/* Projects showcase */}
          <Card>
            <div className="text-[10px] text-muted/40 tracking-widest uppercase mb-4">Projects</div>
            <div className="grid grid-cols-2 gap-3">
              {projects.slice(0, 4).map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`}>
                  <ProjectSubCard project={p} />
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
              <span key={s} className="rounded-lg border border-border/30 bg-surface/30 px-2.5 py-1 text-[11px] text-muted/60 hover:border-accent/20 hover:text-fg/80 transition-colors cursor-default">
                {s}
              </span>
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

      </motion.div>
    </section>
  )
}
