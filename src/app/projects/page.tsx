import type { Metadata } from 'next'
import { projects } from '@/lib/projects'
import PageTransition from '@/components/shared/PageTransition'
import AnimatedSection from '@/components/shared/AnimatedSection'
import ProjectCard from '@/components/shared/ProjectCard'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Things I have built, contributed to, or tinkered with.',
}

export default function ProjectsPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Projects</h1>
        <p className="mt-2 text-muted">
          Things I&apos;ve built, contributed to, or tinkered with.
        </p>
        <AnimatedSection className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              title={project.title}
              description={project.description}
              tags={project.tags}
              href={`/projects/${project.slug}`}
            />
          ))}
        </AnimatedSection>
      </div>
    </PageTransition>
  )
}
