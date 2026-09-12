import type { Metadata } from 'next'
import { projects } from '@/config/projects'
import ProjectCard from '@/components/shared/ProjectCard'

export const metadata: Metadata = {
  title: 'Projects',
  description: '公开项目、工具与阶段性探索。',
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">Projects</h1>
      <p className="mt-2 text-fg/65">公开项目、工具与阶段性探索。</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            description={project.description}
            tags={project.tags}
            status={project.status}
            language={project.language}
            href={`/projects/${project.slug}`}
            featured={project.slug === 'aphrosyne-site'}
          />
        ))}
      </div>
    </div>
  )
}
