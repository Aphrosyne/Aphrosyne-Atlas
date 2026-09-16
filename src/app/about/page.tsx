import type { Metadata } from 'next'
import AboutContent from '@/components/about/AboutContent'
import { siteUrl } from '@/lib/site-url'
import PageTransition from '@/components/shared/PageTransition'

export const metadata: Metadata = {
  title: 'About',
  description: 'Embedded systems engineer, tinkerer, and builder.',
  alternates: { canonical: siteUrl('/about') },
}

export default function AboutPage() {
  return <PageTransition><AboutContent /></PageTransition>
}
