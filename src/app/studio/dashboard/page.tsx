import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DashboardStudio from '@/components/studio/DashboardStudio'

export const metadata: Metadata = {
  title: 'Dashboard Layout Studio',
  robots: { index: false, follow: false },
}

export default function DashboardStudioPage() {
  if (process.env.NODE_ENV !== 'development') notFound()
  return <DashboardStudio />
}
