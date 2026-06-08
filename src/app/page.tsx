import { getRecentPosts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { SITE } from '@/lib/constants'
import HeroSection from '@/components/home/HeroSection'
import Dashboard from '@/components/home/Dashboard'

export default async function Home() {
  const recentPosts = await getRecentPosts(3)

  return (
    <div className="overflow-x-hidden">

      {/* ═══ SECTION 1 — Animated Hero ═══ */}
      <HeroSection />

      {/* ═══ SECTION 2 — Animated Bento Dashboard ═══ */}
      <Dashboard
        siteName={SITE.name}
        recentPosts={recentPosts}
        projects={projects}
      />
    </div>
  )
}
