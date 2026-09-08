import ProjectCard from '../shared/ProjectCard'
import { projects } from '@/config/projects'

export default function FeaturedProjects() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20">
      <h2 className="text-2xl font-semibold tracking-tight">Featured Projects</h2>
      <p className="mt-2 text-muted">Things I&apos;ve built and tinkered with.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, 3).map((project) => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            description={project.description}
            tags={project.tags}
            status={project.status}
            language={project.language}
            href={`/projects/${project.slug}`}
          />
        ))}
      </div>
    </section>
  )
}
