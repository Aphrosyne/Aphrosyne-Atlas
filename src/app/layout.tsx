import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/layout/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import BackToTop from '@/components/layout/BackToTop'
import GlowDots from '@/components/shared/GlowDots'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Aphrosyne',
    template: '%s — Aphrosyne',
  },
  description:
    'Wit, charm, and code. A personal website showcasing projects, thoughts, and explorations.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col text-fg transition-colors">
        {/* Fixed background: random glowing dots + heavy frosted glass overlay */}
        <div className="fixed inset-0 -z-10 bg-bg">
          <GlowDots />
          <div className="absolute inset-0 bg-bg/55 backdrop-blur-[10px]" />
        </div>

        <ThemeProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
