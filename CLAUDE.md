# Aphrosyne — Personal Showcase Site & Blog

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4 + CSS Variables theming
- **Animation:** Framer Motion
- **Blog:** @next/mdx with dynamic imports (`src/content/*.mdx`)
- **Theme:** next-themes (forced dark mode only)
- **Syntax Highlighting:** rehype-pretty-code + shiki
- **Deployment:** Docker (multi-stage, output: standalone)

## Key Commands

```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Start production server
docker compose up --build  # Docker deployment
```

## Project Structure

```
src/
  mdx-components.tsx         # MDX global component mappings
  content/                   # Blog posts (.mdx files)
  components/
    layout/                  # Navbar, Footer, ThemeProvider, BackToTop
    home/                    # HeroSection, Dashboard
    blog/                    # BlogCard, BlogList, PostHeader, TableOfContents
    shared/                  # Backdrop, Button, CountUp, GradientText, MarqueeTechStack, ProjectCard, SocialIcons
    about/                   # AboutContent
  lib/
    posts.ts                 # Blog post utilities (getAllPosts, getPostSlugs, getRecentPosts)
    projects.ts              # Project data
    constants.ts             # Site name, nav items, social links
    useBounce.ts             # Click bounce animation hook
  types/
    post.ts                  # PostMetadata, Post interfaces
  app/
    layout.tsx               # Root layout (ThemeProvider, Navbar, Footer)
    page.tsx                 # Homepage (HeroSection + Dashboard)
    blog/page.tsx            # Blog listing (with search + tag filter)
    blog/[slug]/page.tsx     # Blog post (dynamic MDX import)
    projects/page.tsx        # Projects grid
    projects/[slug]/page.tsx # Project detail
    about/page.tsx           # About page
    api/blog/route.ts        # JSON API for blog posts
```

## Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Home with hero, projects, skills, recent posts |
| `/blog` | Static | Blog listing with search & tag filter |
| `/blog/[slug]` | SSG | Individual blog post |
| `/projects` | Static | Projects showcase |
| `/projects/[slug]` | SSG | Project detail |
| `/about` | Static | About page with timeline |
| `/api/blog` | Dynamic | JSON blog post list |

## Adding a Blog Post

1. Create `src/content/<slug>.mdx`
2. Add metadata export:
   ```mdx
   export const metadata = {
     title: 'Post Title',
     date: '2026-06-01',
     tags: ['tag1', 'tag2'],
     excerpt: 'Short description...',
     readingTime: '5 min',
   }
   ```
3. Write content in Markdown + optional JSX
4. Build will auto-discover it

## Adding a Project

Edit `src/lib/projects.ts` and add an entry to the `projects` array.

## Dashboard Layout

Dashboard 使用 12 列 CSS Grid + 显式定位。两个常量集中控制：

- `GRID` — 卡片在 grid 中的位置（col-start / col-span / row-start / row-span）
- `DIR` — 卡片入场动画方向（left / top / right / bottom），和 GRID key 一一对应

**已知问题：grid 最底部的卡片不要用 `direction="bottom"`**，否则 Framer Motion `whileInView` 会触发页面高度震导致滚动卡顿。改用 `left`/`right`/`top`。

## Blog Post Metadata Parsing

MDX metadata 解析在 `src/lib/posts.ts`。注意：文件换行符可能为 CRLF（`\r\n`），正则须用 `\r?\n` 而非单纯的 `\n`，否则部分帖子不会出现在列表中。

## Coding Conventions

See `.spec/tailwind-v4.md` for Tailwind CSS v4 syntax rules.

## Agent 禁区

- **禁止主动修改 `.spec/` 目录下的任何文件**，只有用户明确要求时才能修改。规范文档必须由用户主导变更，否则形同虚设。
- **禁止主动修改 `CLAUDE.md`**（本文件），同样只有用户明确要求时才能修改。
- **禁止使用 `transform-gpu` 作为 blur 闪烁/渲染问题的修复方案**，这个类并不能解决 backdrop-filter 在 opacity 动画中的延迟渲染问题。

## Deployment

```bash
# On the server:
docker compose up --build -d
# Nginx reverse proxy on port 443 → localhost:3000
```
