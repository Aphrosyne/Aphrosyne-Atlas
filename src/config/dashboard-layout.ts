/**
 * 首页仪表盘的桌面端 12 列布局。
 *
 * 不必手动修改数字：运行 `npm run dev` 后访问 `/studio/dashboard/`，
 * 在本地工作台中调整并复制新的配置。
 */
export const DASHBOARD_CARD_IDS = [
  'bio',
  'posts',
  'projects',
  'tagcloud',
  'memes',
  'status',
  'clock',
  'hitokoto',
] as const

export type DashboardCardId = (typeof DASHBOARD_CARD_IDS)[number]

export interface DashboardLayoutItem {
  column: number
  row: number
  columnSpan: number
  rowSpan: number
}

export const DASHBOARD_LAYOUT: Record<DashboardCardId, DashboardLayoutItem> = {
  bio: { column: 1, row: 1, columnSpan: 3, rowSpan: 1 },
  posts: { column: 4, row: 1, columnSpan: 9, rowSpan: 1 },
  projects: { column: 1, row: 2, columnSpan: 3, rowSpan: 3 },
  tagcloud: { column: 4, row: 2, columnSpan: 6, rowSpan: 3 },
  memes: { column: 10, row: 2, columnSpan: 3, rowSpan: 1 },
  status: { column: 10, row: 3, columnSpan: 3, rowSpan: 1 },
  clock: { column: 10, row: 4, columnSpan: 3, rowSpan: 1 },
  hitokoto: { column: 1, row: 5, columnSpan: 12, rowSpan: 1 },
}
