"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const pieceSlug = searchParams.get("piece");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: pieceSlug ? `Inquiry: ${pieceSlug}` : "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (pieceSlug) {
      setFormData((prev) => ({
        ...prev,
        subject: `Inquiry about piece: ${pieceSlug}`,
        message: `I am interested in learning more about "${pieceSlug}".

`,
      }));
    }
  }, [pieceSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Header />

      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left - Title */}
            <div>
              <p className="text-meta uppercase tracking-wider text-foreground/50 mb-4">Contact</p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1]">
                Get in
                <br />
                Touch
              </h1>
              <p className="mt-6 text-foreground/60 max-w-sm">
                Questions about a piece? Want to learn more about our collection? 
                We'd love to hear from you.
              </p>
            </div>

            {/* Right - Form */}
            <div>
              {submitted ? (
                <div className="py-12">
                  <h3 className="font-display text-2xl font-semibold mb-4">
                    Thank you.
                  </h3>
                  <p className="text-foreground/60">
                    We'll be in touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                      {error}
                    </div>
                  )}
                  
                  {/* Name Row */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-meta uppercase tracking-wider text-foreground/50 mb-4">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        required
                        className="w-full border-b-2 border-foreground/20 bg-transparent py-3 text-lg focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-meta uppercase tracking-wider text-foreground/50 mb-4">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full border-b-2 border-foreground/20 bg-transparent py-3 text-lg focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-meta uppercase tracking-wider text-foreground/50 mb-4">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="w-full border-b-2 border-foreground/20 bg-transparent py-3 text-lg focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-meta uppercase tracking-wider text-foreground/50 mb-4">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full border-b-2 border-foreground/20 bg-transparent py-3 text-lg focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-meta uppercase tracking-wider text-foreground/50 mb-4">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={5}
                      required
                      className="w-full border-b-2 border-foreground/20 bg-transparent py-3 text-lg focus:outline-none focus:border-foreground transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-block bg-foreground text-cream px-10 py-4 text-sm tracking-wide hover:bg-foreground/80 transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
