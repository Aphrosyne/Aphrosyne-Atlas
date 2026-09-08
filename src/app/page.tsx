import { getRecentPosts, getAllPosts } from '@/lib/posts'
import { getAllKnowledge } from '@/lib/knowledge'
import { projects } from '@/config/projects'
import { SITE } from '@/config/site'
import HeroSection from '@/components/home/HeroSection'
import Dashboard from '@/components/home/Dashboard'

export default async function Home() {
  const recentPosts = await getRecentPosts(3)
  const allPosts = await getAllPosts()
  const knowledgeEntries = await getAllKnowledge()
  const tags = [...new Set(allPosts.flatMap(p => p.tags))]

  return (
    <div className="overflow-x-hidden">

      <HeroSection />
      <Dashboard siteName={SITE.name} recentPosts={recentPosts} knowledgeEntries={knowledgeEntries} projects={projects} tags={tags} />
    </div>
  )
}
