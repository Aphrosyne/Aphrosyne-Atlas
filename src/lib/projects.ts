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
      'A personal showcase site and blog rebuilt from WordPress to a modern Next.js stack. Features animated landing page, MDX-powered blog with syntax highlighting, dark mode, and Docker-based deployment on a self-hosted VPS.',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Docker'],
    links: [
      { label: 'Live Site', href: '/' },
      { label: 'Source', href: 'https://github.com/aphrosyne/aphrosyne' },
    ],
  },
  {
    slug: 'embedded-toolbox',
    title: 'Embedded Toolbox',
    description: 'A collection of utilities and snippets for embedded development in Rust and C.',
    longDescription:
      'A curated set of reusable drivers, linker scripts, and build helpers accumulated across several STM32 and ESP32 projects. Includes a minimal RTOS scheduler, I2C/SPI abstraction layer, and CI templates for embedded firmware.',
    tags: ['Rust', 'C', 'STM32', 'ESP32', 'Embedded'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aphrosyne/embedded-toolbox' },
    ],
  },
  {
    slug: 'cli-tools',
    title: 'CLI Tools',
    description: 'Developer productivity tools written in Go — because every workflow deserves automation.',
    longDescription:
      'A collection of small, focused CLI tools: a project scaffolder, a markdown link checker, a time-tracker, and a log parser. Each tool is designed to do one thing well and compose with Unix pipes.',
    tags: ['Go', 'CLI', 'DevTools'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aphrosyne/cli-tools' },
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
