import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { projects, getProjectBySlug } from '@/config/projects'
import PageTransition from '@/components/shared/PageTransition'
import Link from 'next/link'

const STATUS = {
  public: {
    label: '公开',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  archived: {
    label: '公开归档',
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200',
  },
} as const

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: project.title,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) notFound()
  const statusMeta = STATUS[project.status]

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <div className="rounded-[2rem] border border-border/40 bg-surface/50 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.24)] backdrop-blur-md sm:p-8">
          <Link
            href="/projects"
            className="inline-flex rounded-xl border border-border/20 bg-surface/40 px-4 py-2.5 text-sm font-semibold text-fg/65 transition-colors hover:bg-surface/60 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            &larr; 返回项目
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full border px-2.5 py-1 ${statusMeta.className}`}>{statusMeta.label}</span>
            <span className="rounded-full bg-fg/5 px-2.5 py-1 text-fg/60">{project.language}</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl">{project.title}</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-fg/5 px-2.5 py-1 text-xs text-fg/65">
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-8 text-lg leading-8 text-fg/65">{project.longDescription}</p>

          {project.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3 border-t border-border/40 pt-6">
              {project.links.map((link) => {
                const isExternal = /^https?:\/\//.test(link.href)
                const className =
                  'inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
                const content = (
                  <>
                    {link.label}
                    {isExternal && (
                      <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 002 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </>
                )

                return isExternal ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href} className={className}>
                    {content}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false
