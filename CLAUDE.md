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
    blog/                    # BlogCard, BlogList, PostLayout, TableOfContents
    shared/                  # Backdrop, Button, CountUp, GradientText, MarqueeTechStack, ProjectCard, SocialIcons
    about/                   # AboutContent
  lib/
    posts.ts                 # Blog post utilities (getAllPosts, getPostSlugs, getRecentPosts)
    projects.ts              # Project data
    constants.ts             # Site name, nav items, social links
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

## Tailwind CSS v4 Conventions

This project uses Tailwind CSS v4. When writing or reviewing code, follow these rules:

### Gradient direction
```css
/* ✅ CORRECT */
bg-linear-to-r    /* not bg-gradient-to-r */
```

### Opacity modifiers
Use `/N` integer syntax, not `/[0.NN]` brackets:
```css
/* ✅ CORRECT */
bg-white/3        /* 3% opacity  — not bg-white/[0.03] */
bg-accent/6       /* 6% opacity  — not bg-accent/[0.06] */
border-white/20   /* 20% opacity — not border-white/[0.20] */
```

### Spacing scale
Use built-in spacing scale instead of arbitrary pixel values where possible (1 = 0.25rem = 4px):
```css
/* ✅ CORRECT */
-inset-0.5           /* 2px  — not -inset-[2px] */
h-0.5                /* 2px  — not h-[2px] */
-inset-0.375         /* 1.5px — not -inset-[1.5px] */
min-w-37.5           /* 150px — not min-w-[150px] */
```

### Backdrop blur
Use named utilities when they match:
```css
/* ✅ CORRECT */
backdrop-blur-md     /* 12px — not backdrop-blur-[12px] */
/* Keep for non-standard values: */
backdrop-blur-[15px] /* no matching named utility */
```

### Directional border colors
Use per-direction color classes to avoid override:
```css
/* ✅ CORRECT — each direction independent */
border-t border-t-white/20 border-b border-b-white/5
/* ❌ WRONG — border-b-white/5 overrides border-white/20 */
border-t border-white/20 border-b border-white/5
```

## Deployment

```bash
# On the server:
docker compose up --build -d
# Nginx reverse proxy on port 443 → localhost:3000
```
