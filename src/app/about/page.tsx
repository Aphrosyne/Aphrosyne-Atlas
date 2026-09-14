import type { Metadata } from 'next'
import AboutContent from '@/components/about/AboutContent'
import { siteUrl } from '@/lib/site-url'

export const metadata: Metadata = {
  title: 'About',
  description: 'Embedded systems engineer, tinkerer, and builder.',
  alternates: { canonical: siteUrl('/about') },
}

export default function AboutPage() {
  return <AboutContent />
}
