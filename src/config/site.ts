/**
 * 站点的公开、构建期配置。
 *
 * 使用或 Fork 本项目时，优先修改此文件，而不是在页面组件中搜索个人资料。
 * 不要在这里填写 Token、密码或其他私密信息：本文件会进入静态站点产物。
 */

export type SocialPlatform = 'github' | 'email' | 'qq' | 'bilibili'

export interface SocialLink {
  platform: SocialPlatform
  label: string
  href: string
}

export const SITE = {
  name: 'Aphrosyne',
  title: 'Aphrosyne Atlas',
  description: 'Aphrosyne Atlas is a personal space for projects, notes, and explorations.',
  url: 'https://aphrosyne.github.io/Aphrosyne-Atlas',
  author: 'Aphrosyne',
  assets: {
    avatar: '/images/avatar/avatar.jpg',
    background: '/images/bg/bg.jpg',
  },
  profile: {
    tagline: '设计 · 创造',
    heroPrefix: '在下，',
    heroName: '柳江凝',
    heroQuote: '薄暝柳隙人独立，数点雨痕待江凝。',
  },
  about: {
    createdAt: '2026-06-01',
    updatedAt: '2026-06-08',
    paragraphs: ['一个兴趣使然的人，喜欢学有趣的东西', '还没想好写什么喵'],
    currentFocus: '学习前端，构建个人网站',
  },
} as const

export const NAV_ITEMS = [
  { label: '首页', href: '/' },
  {
    label: '博客',
    href: '/blog',
    children: [
      { label: '全部文章', href: '/blog' },
      { label: '标签', href: '/blog?view=tags' },
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

// 只添加已确认可公开的链接；数组顺序即页面显示顺序。
export const SOCIAL_LINKS = [
  { platform: 'github', label: 'GitHub', href: 'https://github.com/aphrosyne' },
] as const satisfies readonly SocialLink[]
