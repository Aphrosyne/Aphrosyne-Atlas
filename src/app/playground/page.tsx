import type { Metadata } from 'next'
import PlaygroundClient from './PlaygroundClient'

export const metadata: Metadata = {
  title: 'Playground',
  description: '前端小动画、CSS 实验、交互 Demo',
}

export default function PlaygroundPage() {
  return <PlaygroundClient />
}
