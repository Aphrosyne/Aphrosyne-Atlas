import type { Metadata } from 'next'
import AboutContent from '@/components/about/AboutContent'

export const metadata: Metadata = {
  title: 'About',
  description: 'Embedded systems engineer, tinkerer, and builder.',
}

export default function AboutPage() {
  return <AboutContent />
}
