export interface Recommendation {
  name: string
  url: string
  description: string
}

export interface RecommendationCategory {
  title: string
  icon: string
  items: Recommendation[]
}

export const recommendations: RecommendationCategory[] = [
  {
    title: '网站',
    icon: '🌐',
    items: [
      { name: 'Hacker News', url: 'https://news.ycombinator.com', description: '技术新闻和讨论，每天必刷' },
      { name: 'GitHub Trending', url: 'https://github.com/trending', description: '发现热门开源项目' },
    ],
  },
  {
    title: '软件',
    icon: '🛠',
    items: [
      { name: 'VS Code', url: 'https://code.visualstudio.com', description: '主力编辑器，插件生态无敌' },
      { name: 'Obsidian', url: 'https://obsidian.md', description: '本地 Markdown 知识管理' },
      { name: 'Docker', url: 'https://www.docker.com', description: '容器化部署，开发到生产一致' },
    ],
  },
  {
    title: '工具',
    icon: '🔧',
    items: [
      { name: 'Excalidraw', url: 'https://excalidraw.com', description: '手绘风格在线白板' },
      { name: 'Raycast', url: 'https://www.raycast.com', description: 'macOS 效率启动器' },
    ],
  },
]
