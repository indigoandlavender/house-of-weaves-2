"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Social Icons - flat, minimal, Anthropic style
function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
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
    youtube: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <rect x="2" y="4" width="16" height="12" rx="3" />
        <path d="M8 7.5V12.5L13 10L8 7.5Z" fill="currentColor" stroke="none" />
      </svg>
    ),
    facebook: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <circle cx="10" cy="10" r="8" />
        <path d="M10.5 17V10H13L13.5 7.5H10.5V6C10.5 5 11 4.5 12 4.5H13.5V2.5C13.5 2.5 12.5 2.5 11.5 2.5C9.5 2.5 8.5 3.5 8.5 5.5V7.5H6V10H8.5V17" />
      </svg>
    ),
    tiktok: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M10 2V14C10 15.5 8.5 17 7 17C5.5 17 4 15.5 4 14C4 12.5 5.5 11 7 11" />
        <path d="M10 2C10 2 10 5 14 5" />
        <path d="M10 6C10 6 10 8 16 8" />
      </svg>
    ),
  };

  return icons[name] || <span className="text-sm">{name}</span>;
}

interface FooterLink {
  order: number;
  label: string;
  href: string | null;
  type: string;
}

interface FooterColumn {
  number: number;
  title: string;
  links: FooterLink[];
}

interface FooterData {
  newsletter: {
    show: boolean;
    title: string;
    description: string;
    brandName: string;
  };
  columns: FooterColumn[];
  legal: { label: string; href: string }[];
}

const defaultFooterData: FooterData = {
  newsletter: {
    show: true,
    title: "New Arrivals",
    description: "Be the first to see new rugs. No spam, just beautiful things.",
    brandName: "Tilwen",
  },
  columns: [
    {
      number: 1,
      title: "Tilwen",
      links: [
        { order: 1, label: "hello@tilwen.com", href: "mailto:hello@tilwen.com", type: "email" },
      ],
    },
    {
      number: 2,
      title: "Shop",
      links: [
        { order: 1, label: "All Rugs", href: "/shop", type: "link" },
        { order: 2, label: "About", href: "/about", type: "link" },
        { order: 3, label: "Contact", href: "/contact", type: "link" },
      ],
    },
    {
      number: 3,
      title: "Help",
      links: [
        { order: 1, label: "FAQ", href: "/faq", type: "link" },
        { order: 2, label: "Shipping", href: "/shipping", type: "link" },
        { order: 3, label: "Returns", href: "/returns", type: "link" },
        { order: 4, label: "Care Guide", href: "/care", type: "link" },
        { order: 5, label: "Glossary", href: "/glossary", type: "link" },
      ],
    },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData>(defaultFooterData);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    fetch("/api/footer")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setFooterData({
            newsletter: data.data.newsletter || defaultFooterData.newsletter,
            columns: data.data.columns || defaultFooterData.columns,
            legal: data.data.legal || defaultFooterData.legal,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch footer data:", err);
      });
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubscribing) return;

    setIsSubscribing(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscribed(true);
        setSubscribeMessage(data.message);
        setEmail("");
      } else {
        setSubscribeMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setSubscribeMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer>
      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 1: Newsletter
          Warm terracotta background, inviting
          ════════════════════════════════════════════════════════════════════ */}
      {footerData.newsletter.show && (
        <section className="py-16 md:py-20 bg-[#C4846C]">
          <div className="max-w-xl mx-auto px-6 text-center text-white">
            <h3 className="font-serif text-2xl md:text-3xl mb-3">
              {footerData.newsletter.title}
            </h3>
            <p className="text-white/80 mb-8 text-sm">
              {footerData.newsletter.description}
            </p>

            {subscribed ? (
              <p className="text-white/90">{subscribeMessage || "You're in."}</p>
            ) : (
              <>
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto items-end"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    disabled={isSubscribing}
                    className="flex-1 px-0 py-3 bg-transparent border-0 border-b border-white/50 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-6 py-3 bg-white text-[#C4846C] text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {isSubscribing ? "..." : "Subscribe"}
                  </button>
                </form>
                {subscribeMessage && !subscribed && (
                  <p className="text-white/70 text-sm mt-3">{subscribeMessage}</p>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 2: Brand Content
          Charcoal background with navigation columns
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#1f1f1f] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {footerData.columns.map((column, index) => {
              // Separate social links from regular links
              const socialLinks = column.links.filter(
                (link) =>
                  link.type === "social" ||
                  ["pinterest", "instagram", "youtube", "facebook", "tiktok"].includes(
                    link.label.toLowerCase()
                  )
              );
              const regularLinks = column.links.filter(
                (link) =>
                  link.type !== "social" &&
                  !["pinterest", "instagram", "youtube", "facebook", "tiktok"].includes(
                    link.label.toLowerCase()
                  )
              );

              return (
                <div key={index}>
                  {/* First column shows brand name in serif */}
                  {index === 0 ? (
                    <p className="font-serif text-xl mb-6 text-white/90">
                      {column.title}
                    </p>
                  ) : (
                    <h4 className="text-xs tracking-[0.15em] uppercase mb-6 text-white/50">
                      {column.title}
                    </h4>
                  )}

                  {/* Regular links */}
                  <ul className="space-y-3">
                    {regularLinks.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        {link.href ? (
                          link.type === "link" ? (
                            <Link
                              href={link.href}
                              className="text-sm text-white/70 hover:text-white transition-colors"
                            >
                              {link.label}
                            </Link>
                          ) : (
                            <a
                              href={link.href}
                              target={link.type === "email" ? undefined : "_blank"}
                              rel={link.type === "email" ? undefined : "noopener noreferrer"}
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

                  {/* Social icons in a row */}
                  {socialLinks.length > 0 && (
                    <div className="flex items-center gap-2 mt-4">
                      {socialLinks.map((link, linkIndex) => {
                        const socialName = link.label.toLowerCase();
                        return link.href ? (
                          <a
                            key={linkIndex}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/70 hover:text-white transition-colors p-2 -m-2"
                            aria-label={link.label}
                          >
                            <SocialIcon name={socialName} />
                          </a>
                        ) : (
                          <span
                            key={linkIndex}
                            className="text-white/70 p-2"
                            aria-label={link.label}
                          >
                            <SocialIcon name={socialName} />
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 3: Legal
          Darkest layer with legal links and copyright
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-[#161616]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Legal links row */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-4">
            {footerData.legal.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-xs text-white/40 hover:text-white/70 transition-colors py-2 px-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-white/30">
            © {new Date().getFullYear()} {footerData.newsletter.brandName}. All rights reserved.
          </p>
        </div>
      </section>
    </footer>
  );
}
