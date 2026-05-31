# Aphrosyne — Project Context & Decisions

## Project Overview

个人展示网站 + 博客，从 WordPress 迁移到 Next.js 16。部署在自有服务器（2核4G）。

## Tech Stack

- **Framework:** Next.js 16.2.6 (App Router) + React 19.2.4
- **Styling:** Tailwind CSS v4 + CSS Variables theming
- **Animation:** Framer Motion (飞入动画 + easeOutExpo 缓出)
- **Blog:** @next/mdx with dynamic imports (`src/content/*.mdx`)
- **Theme:** next-themes (system/light/dark)
- **Syntax Highlighting:** rehype-pretty-code + shiki
- **Deployment:** Docker (multi-stage, output: standalone)

## Key Design Decisions

### 首页布局
- **Navbar**: 首页隐藏（纯卡片启动台），子页面显示（用于导航）
- **Footer**: 已移除，备案信息预留
- **无滚动**: 全屏居中，flex-1 + min-h-screen + justify-center + items-center
- **卡片风格**: 全部矩形卡片（rounded-lg, border, bg-surface/40），无裸露文字

### 背景效果
- SVG 随机发光圆点（3-4个），不用 Canvas（省 CPU）
- 圆点位置：九宫格正中间那块（33%-67%）
- 参数：200-400px, sat 55-65%, light 65-75%, alpha 40-55%
- 毛玻璃遮罩：bg-bg/55 + backdrop-blur-[10px]
- 光点入场：1s ease-out fade-in

### 首页入场动画
- AnimatedEntrance 组件，easeOutExpo [0.16, 1, 0.3, 1]
- 固定 5000px off-screen（避免 SSR hydration mismatch）
- 各卡片飞入方向：brand→left, Blog→bottom, Projects→top, About→bottom, latest post→left, skills→right
- 每次进入首页（包括从子页面返回）都重放飞入动画

### 子页面布局
- Navbar 在首页隐藏 (`pathname === '/'` → null)
- 其他页面：Navbar + main + BackToTop

## File Structure (Key Files)

```
src/
  app/
    layout.tsx                    # Root: bg layer, ThemeProvider, Navbar, main
    page.tsx                      # Homepage: card launchpad with AnimatedEntrance
    blog/page.tsx                 # Blog listing
    blog/[slug]/page.tsx          # Blog post (dynamic MDX import)
    projects/page.tsx             # Projects grid
    projects/[slug]/page.tsx      # Project detail
    about/page.tsx                # About + experience timeline
    api/blog/route.ts             # JSON blog API
  components/
    shared/
      AnimatedEntrance.tsx        # Multi-directional fly-in with easeOutExpo
      GlowDots.tsx                # SVG random glowing dots background
      PageTransition.tsx          # Page fade-in wrapper
    home/
      SkillsShowcase.tsx          # Skills card
  content/
    getting-started.mdx           # Sample blog post
  lib/
    posts.ts                      # Blog utilities (getAllPosts, getPostSlugs, etc.)
    projects.ts                   # Project data
    constants.ts                  # Site name, nav items, social links
```

## Commit History

1. `Rebuild from WordPress to Next.js personal showcase site + blog` — 初始搭建
2. `Add frosted-glass background layer with configurable cover image` — 图片背景
3. `Redesign homepage as centered launchpad with card-only layout` — 卡片式首页
4. `Add multi-directional fly-in entrance animation for homepage cards` — 飞入动画
5. `Replace static image background with random SVG glow dots` — 发光圆点背景
6. `Polish homepage card styling with hue-based accents and glassmorphism` — 卡片风格翻新

## Current Style Parameters

| 参数 | 值 |
|------|-----|
| 卡片圆角 | `rounded-xl` (12px) |
| 卡片边框 | `border-border/50` |
| 卡片背景 | `bg-surface/30 backdrop-blur-xl` |
| 卡片hover | 上浮 + 阴影 + 渐变色叠加 |
| 操作卡片配色 | Blog→蓝色, Projects→琥珀色, About→紫色 |
| 最新文章卡片 | 左侧渐变装饰条 + "Latest" pulse badge |
| 遮罩透明度 | `bg-bg/55` |
| 模糊度 | `backdrop-blur-[10px]` |
| 光点数量 | 3-4 |
| 光点尺寸 | 200-400 相对单位 |
| 光点饱和度 | 55-65% |
| 光点透明度 | 40-55% |
| 光点位置 | 屏幕中间九分之一区域 |
| 光点淡入 | 1s ease-out |

## Getting Started

```bash
npm run dev       # Development
npm run build     # Production build
docker compose up --build  # Docker deploy
```

## Adding Blog Posts

Create `src/content/<slug>.mdx`:

```mdx
export const metadata = {
  title: 'Post Title',
  date: '2026-06-01',
  tags: ['tag1', 'tag2'],
  excerpt: 'Short description...',
  readingTime: '5 min',
}
```
