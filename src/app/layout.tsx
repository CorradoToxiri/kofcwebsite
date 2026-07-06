import type { Metadata } from 'next'
import { Source_Serif_4, Source_Sans_3, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-source-serif',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s · Presentation Council #6033 · Knights of Columbus',
    default: 'Presentation Council #6033 · Knights of Columbus · Upper Saddle River, NJ',
  },
  description:
    'Knights of Columbus Presentation Council #6033 serves the Church of the Presentation in Upper Saddle River, NJ. Chartered 1968. Faith, family, fraternity, and charity.',
  openGraph: {
    siteName: 'Presentation Council #6033 · Knights of Columbus',
    locale: 'en_US',
    type: 'website',
  },
}

// Root layout is intentionally chrome-free: it only sets up <html>/<body>, the
// font variables, and global styles. The public site's header/footer/golf banner
// live in app/(public)/layout.tsx; the admin area supplies its own shell. This
// keeps /admin from ever inheriting public chrome (and vice versa).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${sourceSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
