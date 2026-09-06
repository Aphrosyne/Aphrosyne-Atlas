import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ThemeProvider from '@/components/layout/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BackToTop from '@/components/layout/BackToTop'
import Backdrop from '@/components/shared/Backdrop'
import { SITE } from '@/config/site'

const sourceHanSans = localFont({
  src: [
    { path: './fonts/SourceHanSansSC-Regular.otf', weight: '400', style: 'normal' },
    { path: './fonts/SourceHanSansSC-Medium.otf', weight: '500', style: 'normal' },
    { path: './fonts/SourceHanSansSC-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-source-han-sans',
  display: 'swap',
  fallback: ['Microsoft YaHei', 'Arial', 'sans-serif'],
})

export const metadata: Metadata = {
  title: {
    default: SITE.title,
    template: `%s — ${SITE.title}`,
  },
  description: SITE.description,
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
      className={sourceHanSans.variable}
    >
      <body className="min-h-screen flex flex-col text-fg transition-colors">
        {/* Fixed background — auto-detects format */}
        <div className="fixed inset-0 -z-10">
          <Backdrop />
        </div>

        <ThemeProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
