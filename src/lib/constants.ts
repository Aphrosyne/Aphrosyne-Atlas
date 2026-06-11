export const SITE = {
  name: 'Aphrosyne',
  title: 'Aphrosyne — Personal Site & Blog',
  description: 'Wit, charm, and code. A personal website showcasing projects, thoughts, and explorations.',
  url: 'https://aphrosyne.dev',
  author: 'Aphrosyne',
} as const

export const NAV_ITEMS = [
  { label: '首页', href: '/' },
  {
    label: '博客',
    href: '/blog',
    children: [
      { label: '全部文章', href: '/blog' },
      { label: '标签', href: '/blog?view=tags' },
      { label: 'RSS 订阅', href: '/api/blog' },
    ],
  },
  {
    label: '项目',
    href: '/projects',
    children: [
      { label: '全部项目', href: '/projects' },
      { label: '本站', href: '/projects/aphrosyne-site' },
    ],
  },
  { label: '演示', href: '/playground' },
  { label: '关于', href: '/about' },
] as const

export const SOCIAL_LINKS = {
  github: 'https://github.com/aphrosyne',
  email: 'mailto:your-email@example.com',
  qq: 'https://wpa.qq.com/msgrd?v=3&uin=你的QQ号',
  bilibili: 'https://space.bilibili.com/你的UID',
} as const
