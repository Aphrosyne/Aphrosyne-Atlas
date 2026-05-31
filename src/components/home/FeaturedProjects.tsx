import AnimatedSection from '../shared/AnimatedSection'
import ProjectCard from '../shared/ProjectCard'

const featured = [
  {
    title: 'Project Alpha',
    description: 'An embedded systems project exploring real-time control on STM32 microcontrollers.',
    tags: ['Rust', 'STM32', 'RTOS'],
    href: '/projects/alpha',
  },
  {
    title: 'Aphrosyne Blog',
    description: 'This very site — built with Next.js, MDX, and a dash of charm.',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
    href: '/',
  },
  {
    title: 'CLI Toolbox',
    description: 'A collection of developer productivity tools written in Go.',
    tags: ['Go', 'CLI', 'DevTools'],
    href: '/projects/toolbox',
  },
]

export default function FeaturedProjects() {
  return (
    <AnimatedSection className="mx-auto max-w-5xl px-4 py-20">
      <h2 className="text-2xl font-semibold tracking-tight">Featured Projects</h2>
      <p className="mt-2 text-muted">Things I&apos;ve built and tinkered with.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </AnimatedSection>
  )
}
