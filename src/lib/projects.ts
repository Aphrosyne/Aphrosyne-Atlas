export interface Project {
  slug: string
  title: string
  description: string
  longDescription: string
  tags: string[]
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    slug: 'aphrosyne-site',
    title: 'Aphrosyne Site',
    description: 'This very website — built from scratch with Next.js 16, MDX, and Tailwind CSS v4.',
    longDescription:
      'A personal showcase site and blog rebuilt from WordPress to a modern Next.js stack. Features an animated landing page, MDX-powered blog with syntax highlighting, dark mode, and GitHub Pages static deployment.',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'GitHub Pages'],
    links: [
      { label: 'Live Site', href: '/' },
      { label: 'Source', href: 'https://github.com/Aphrosyne/Aphrosyne-Atlas' },
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
