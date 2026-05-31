import PageTransition from '@/components/shared/PageTransition'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import SkillsShowcase from '@/components/home/SkillsShowcase'
import RecentPosts from '@/components/home/RecentPosts'
import { getRecentPosts } from '@/lib/posts'

export default async function Home() {
  const recentPosts = await getRecentPosts()

  return (
    <PageTransition>
      <HeroSection />
      <FeaturedProjects />
      <SkillsShowcase />
      <RecentPosts posts={recentPosts} />
    </PageTransition>
  )
}
