import type { Metadata } from 'next'
import { Playfair_Display, Nanum_Myeongjo } from 'next/font/google'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
})

const nanum = Nanum_Myeongjo({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofweaves.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'House of Weaves | The History and Culture of Carpets and Textiles',
    template: '%s | House of Weaves',
  },
  description: 'Discover the stories behind the world\'s greatest carpets and textiles. From Persian gardens to Navajo looms, explore how cultures transmitted knowledge, identity, and beauty through thread.',
  keywords: ['carpet history', 'textile history', 'rug history', 'carpet culture', 'weaving traditions', 'oriental rugs', 'Persian carpets', 'textile art'],
  authors: [{ name: 'J. Ng' }],
  creator: 'House of Weaves',
  publisher: 'House of Weaves',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'House of Weaves | The History and Culture of Carpets and Textiles',
    description: 'Discover the stories behind the world\'s greatest carpets and textiles. From Persian gardens to Navajo looms, explore how cultures transmitted knowledge, identity, and beauty through thread.',
    url: siteUrl,
    siteName: 'House of Weaves',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House of Weaves | The History and Culture of Carpets and Textiles',
    description: 'Discover the stories behind the world\'s greatest carpets and textiles.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
}

// Organization Schema for site-wide structured data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'House of Weaves',
  url: siteUrl,
  logo: `${siteUrl}/favicon.svg`,
  description: 'A publication documenting the history, craft, and cultural meaning of carpets and textiles.',
  sameAs: [],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${nanum.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S384851DJ9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S384851DJ9');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
