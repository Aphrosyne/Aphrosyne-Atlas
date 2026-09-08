export interface Project {
  slug: string
  title: string
  description: string
  longDescription: string
  tags: string[]
  status: 'public' | 'archived'
  language: string
  links: { label: string; href: string }[]
}

/** Fork 本站时，在这里替换项目卡片和详情页内容。 */
export const projects: Project[] = [
  {
    slug: 'aphrosyne-site',
    title: 'Aphrosyne Atlas',
    description: '静态优先的个人内容站，统一承载 Blog、Skyrim 知识库、项目展示与个人表达。',
    longDescription:
      '从个人博客逐步演进而来的静态内容站。项目使用 Next.js App Router、React、Tailwind CSS、Framer Motion 与 MDX 构建，保留具有个人风格的首页，同时为 Blog 与 Skyrim 知识库提供统一的搜索、阅读和 GitHub Pages 部署流程。',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'GitHub Pages'],
    status: 'public',
    language: 'TypeScript',
    links: [
      { label: '访问网站', href: '/' },
      { label: '查看源码', href: 'https://github.com/Aphrosyne/Aphrosyne-Atlas' },
    ],
  },
  {
    slug: 'community-os',
    title: 'CommunityOS',
    description: '面向 Skyrim Mod 社区的治理、自动化、文档与基础设施框架。',
    longDescription:
      '一套面向长期社区运营的开放式设计框架，把社区治理、管理员流程、知识沉淀、自动化与备份容灾视为同一个工程问题。项目以平台无关和低维护成本为目标；当前公开仓库已归档，作为阶段性设计与实现记录保留。',
    tags: ['Python', 'Community', 'Automation', 'Documentation'],
    status: 'archived',
    language: 'Python',
    links: [{ label: '查看归档源码', href: 'https://github.com/Aphrosyne/CommunityOS' }],
  },
  {
    slug: 'skyrim-content-workbench',
    title: 'Skyrim Content Workbench',
    description: '用于探索 Skyrim 内容整理与工作流工具的公开 Python 项目。',
    longDescription:
      '一个以 Python 为主要语言的 Skyrim 内容工作台项目。目前仓库保持公开并仍在建设中，功能边界与使用文档尚未完整发布；这里仅展示已经公开确认的项目定位与仓库入口。',
    tags: ['Python', 'Skyrim', 'Content Tools', 'Workbench'],
    status: 'public',
    language: 'Python',
    links: [{ label: '查看源码', href: 'https://github.com/Aphrosyne/Skyrim-Content-Workbench' }],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
