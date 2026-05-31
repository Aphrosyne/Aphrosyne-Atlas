# Aphrosyne — Personal Showcase Site & Blog

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4 + CSS Variables theming
- **Animation:** Framer Motion
- **Blog:** @next/mdx with dynamic imports (`src/content/*.mdx`)
- **Theme:** next-themes (system/light/dark)
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
    layout/                  # Navbar, Footer, ThemeToggle, ThemeProvider, BackToTop
    home/                    # HeroSection, FeaturedProjects, SkillsShowcase, RecentPosts
    blog/                    # BlogCard, BlogList, PostLayout, PostHeader, TableOfContents
    shared/                  # AnimatedSection, PageTransition, GradientText, ProjectCard, Button
  lib/
    posts.ts                 # Blog post utilities (getAllPosts, getPostSlugs, getRecentPosts)
    projects.ts              # Project data
    constants.ts             # Site name, nav items, social links
  types/
    post.ts                  # PostMetadata, Post interfaces
  app/
    layout.tsx               # Root layout (ThemeProvider, Navbar, Footer)
    page.tsx                 # Homepage
    blog/page.tsx            # Blog listing (with search + tag filter)
    blog/[slug]/page.tsx     # Blog post (dynamic MDX import)
    projects/page.tsx        # Projects grid
    projects/[slug]/page.tsx # Project detail
    about/page.tsx           # About + experience timeline
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

## Deployment

```bash
# On the server:
docker compose up --build -d
# Nginx reverse proxy on port 443 → localhost:3000
```
