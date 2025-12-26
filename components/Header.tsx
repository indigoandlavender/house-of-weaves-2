'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface HeaderProps {
  transparent?: boolean
}

export default function Header({ transparent = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isTransparent = transparent && !scrolled && !menuOpen

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent 
          ? 'bg-transparent' 
          : 'bg-cream/95 backdrop-blur-sm border-b border-foreground/10'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link 
          href="/" 
          className={`font-display text-2xl md:text-3xl font-semibold tracking-tight transition-colors duration-300 ${
            isTransparent ? 'text-white' : 'text-foreground'
          }`}
        >
          House of Weaves
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/stories" 
            className={`text-sm tracking-wide transition-colors ${
              isTransparent ? 'text-white/90 hover:text-white' : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            Stories
          </Link>
          <Link 
            href="/about" 
            className={`text-sm tracking-wide transition-colors ${
              isTransparent ? 'text-white/90 hover:text-white' : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            About
          </Link>
        </nav>

        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`w-full h-0.5 transition-all ${isTransparent ? 'bg-white' : 'bg-foreground'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-full h-0.5 transition-all ${isTransparent ? 'bg-white' : 'bg-foreground'} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-0.5 transition-all ${isTransparent ? 'bg-white' : 'bg-foreground'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-cream border-t border-foreground/10 px-6 py-6 space-y-4">
          <Link 
            href="/stories" 
            className="block text-lg"
            onClick={() => setMenuOpen(false)}
          >
            Stories
          </Link>
          <Link 
            href="/about" 
            className="block text-lg"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </nav>
      )}
    </header>
  )
}
