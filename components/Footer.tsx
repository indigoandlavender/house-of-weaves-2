import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-white/90">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link 
              href="/" 
              className="font-display text-3xl font-semibold tracking-tight mb-4 block"
            >
              House of Weaves
            </Link>
            <p className="text-white/60 max-w-sm leading-relaxed">
              An archive of rugs and textiles from around the world. 
              History, provenance, and the stories woven into every thread.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4 text-white/40">
              Explore
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link href="/stories" className="hover:text-white transition-colors">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4 text-white/40">
              Legal
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/intellectual-property" className="hover:text-white transition-colors">
                  Intellectual Property
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-4 text-sm text-white/40 text-center">
          <p>© {currentYear} House of Weaves</p>
        </div>
      </div>
    </footer>
  )
}
