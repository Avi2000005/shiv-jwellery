import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Shiv Fine Jewelry — Jewelry That Tells Your Story',
  description:
    'Timeless craftsmanship, reimagined for the modern woman. Explore an immersive collection of fine Indian jewelry — rings, necklaces, earrings and bangles crafted in gold, diamonds and precious gemstones.',
  generator: 'v0.app',
  keywords: [
    'fine jewelry',
    'Indian jewelry',
    'gold jewelry',
    'diamond rings',
    'luxury jewelry',
    'Shiv Sarees',
  ],
  openGraph: {
    title: 'Shiv Fine Jewelry',
    description: 'Jewelry That Tells Your Story — timeless craftsmanship, reimagined.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0908',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} bg-background`}>
      <body className="antialiased grain">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
