import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/layout/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import BackToTop from '@/components/layout/BackToTop'
import { SITE } from '@/lib/constants'

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
        {/* Fixed background layer */}
        <div className="fixed inset-0 -z-10 bg-bg">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${SITE.bgImage})` }}
          />
          <div className="absolute inset-0 bg-bg/60 backdrop-blur-[15px]" />
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
