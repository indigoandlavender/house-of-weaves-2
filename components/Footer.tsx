'use client'

import Link from 'next/link'
import { useState } from 'react'

// Social Icons - flat, minimal, Anthropic style
function SocialIcon({ name }: { name: string }) {
  const icons: { [key: string]: JSX.Element } = {
    pinterest: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6C8 6 6.5 7.5 6.5 9.5C6.5 11 7.5 12 8.5 12.5C8 14 7.5 15.5 7.5 15.5" />
        <path d="M10 6C10 8 10 14 10 14" />
        <path d="M10 6C12 6 13.5 7.5 13.5 9.5C13.5 11.5 12 12.5 10 12.5" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <rect x="3" y="3" width="14" height="14" rx="4" />
        <circle cx="10" cy="10" r="3.5" />
        <circle cx="14.5" cy="5.5" r="0.75" fill="currentColor" />
      </svg>
    ),
  }

  return icons[name] || <span className="text-sm">{name}</span>
}

// Site configuration
const siteConfig = {
  siteId: 'house-of-weaves',
  siteType: 'content' as const,
  brandName: 'House of Weaves',
  contactEmail: 'hello@houseofweaves.com',
  location: 'Marrakech, Morocco',
}

// Footer columns data
const footerColumns = [
  {
    title: 'Contact',
    links: [
      { label: 'Marrakech, Morocco', href: null, type: 'address' },
      { label: 'hello@houseofweaves.com', href: 'mailto:hello@houseofweaves.com', type: 'email' },
    ],
    social: [
      { label: 'Instagram', href: 'https://instagram.com/houseofweaves' },
      { label: 'Pinterest', href: 'https://pinterest.com/houseofweaves' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Stories', href: '/stories', type: 'link' },
      { label: 'About', href: '/about', type: 'link' },
      { label: 'Contact', href: '/contact', type: 'link' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy', type: 'link' },
      { label: 'Terms of Service', href: '/terms', type: 'link' },
      { label: 'Disclaimer', href: '/disclaimer', type: 'link' },
      { label: 'Intellectual Property', href: '/intellectual-property', type: 'link' },
    ],
  },
]

// Legal links for bottom bar
const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'IP', href: '/intellectual-property' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubscribing) return
    
    setIsSubscribing(true)
    // Simulate subscription
    setTimeout(() => {
      setSubscribed(true)
      setIsSubscribing(false)
    }, 500)
  }

  return (
    <footer className="text-white">
      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 1: Newsletter (lightest)
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#3a3a3a]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-xl">
            <p className="text-meta uppercase tracking-wider text-white/40 mb-4">Newsletter</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              From the Loom
            </h2>
            <p className="text-white/60 mb-8">
              Occasional notes on textiles, makers, and the stories behind them.
            </p>
            
            {subscribed ? (
              <p className="text-accent">Thank you for subscribing.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-4 flex-col sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 px-4 py-3 bg-transparent border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/60"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="px-8 py-3 bg-accent text-white text-sm tracking-wide hover:bg-accent/80 transition-colors disabled:opacity-50"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 2: Navigation Links (medium)
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 bg-[#2d2d2d]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Column */}
            <div>
              <Link href="/" className="font-display text-2xl font-semibold tracking-tight mb-6 block">
                House of Weaves
              </Link>
              <p className="text-sm text-white/60 leading-relaxed">
                A textile archive documenting rugs and weaving traditions from around the world.
              </p>
            </div>

            {/* Dynamic Columns */}
            {footerColumns.map((column, index) => (
              <div key={index}>
                <h4 className="text-xs tracking-[0.15em] uppercase mb-6 text-white/50">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.href ? (
                        link.type === 'link' ? (
                          <Link
                            href={link.href}
                            className="text-sm text-white/70 hover:text-white transition-colors"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            href={link.href}
                            className="text-sm text-white/70 hover:text-white transition-colors"
                          >
                            {link.label}
                          </a>
                        )
                      ) : (
                        <span className="text-sm text-white/70">{link.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
                
                {/* Social icons */}
                {column.social && column.social.length > 0 && (
                  <div className="flex items-center gap-4 mt-4">
                    {column.social.map((social, socialIndex) => (
                      <a
                        key={socialIndex}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white transition-colors"
                        aria-label={social.label}
                      >
                        <SocialIcon name={social.label.toLowerCase()} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 3: Legal + Copyright (darkest)
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-[#1f1f1f]">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Legal links row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Separator */}
            <span className="text-white/20">|</span>
            
            {/* Language selector */}
            <button className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6.5" />
                <line x1="1.5" y1="8" x2="14.5" y2="8" />
                <path d="M8 1.5C6 4 6 12 8 14.5" />
                <path d="M8 1.5C10 4 10 12 8 14.5" />
              </svg>
              English
            </button>
          </div>
          
          {/* Copyright */}
          <p className="text-center text-xs text-white/40">
            © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
          </p>
        </div>
      </section>
    </footer>
  )
}
