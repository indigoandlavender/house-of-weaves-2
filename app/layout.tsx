import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'House of Weaves | A Textile Archive',
  description: 'An archive of rugs and textiles from around the world. History, provenance, and the stories woven into every thread.',
  openGraph: {
    title: 'House of Weaves | A Textile Archive',
    description: 'An archive of rugs and textiles from around the world.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P1CGE62ZD4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P1CGE62ZD4');
          `}
        </Script>
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
