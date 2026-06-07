export const SITE = {
  name: 'Aphrosyne',
  title: 'Aphrosyne — Personal Site & Blog',
  description: 'Wit, charm, and code. A personal website showcasing projects, thoughts, and explorations.',
  url: 'https://aphrosyne.dev',
  author: 'Aphrosyne',
} as const

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  {
    label: 'Blog',
    href: '/blog',
    children: [
      { label: 'All Posts', href: '/blog' },
      { label: 'Tags', href: '/blog?view=tags' },
      { label: 'RSS Feed', href: '/api/blog' },
    ],
  },
  {
    label: 'Projects',
    href: '/projects',
    children: [
      { label: 'All Projects', href: '/projects' },
      { label: 'Aphrosyne Site', href: '/projects/aphrosyne-site' },
      { label: 'Embedded Toolbox', href: '/projects/embedded-toolbox' },
      { label: 'CLI Tools', href: '/projects/cli-tools' },
    ],
  },
  { label: 'About', href: '/about' },
] as const

export const SOCIAL_LINKS = {
  github: 'https://github.com/aphrosyne',
  email: 'mailto:your-email@example.com',
  qq: 'https://wpa.qq.com/msgrd?v=3&uin=你的QQ号',
  bilibili: 'https://space.bilibili.com/你的UID',
} as const
