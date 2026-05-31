export const SITE = {
  name: 'Aphrosyne',
  title: 'Aphrosyne — Personal Site & Blog',
  description: 'Wit, charm, and code. A personal website showcasing projects, thoughts, and explorations.',
  url: 'https://aphrosyne.dev',
  author: 'Aphrosyne',
  /** Placeholder background image — swap the URL to your own image */
  bgImage:
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80',
} as const

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
] as const

export const SOCIAL_LINKS = {
  github: 'https://github.com/aphrosyne',
  // Add more as needed
} as const
