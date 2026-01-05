"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const pieceSlug = searchParams.get("piece");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: pieceSlug ? `I am interested in learning more about "${pieceSlug}".\n\n` : "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          message: formData.message,
          piece: pieceSlug || undefined,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="py-16">
        <p className="font-display text-3xl mb-4">Message received.</p>
        <p className="font-body text-stone">We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* First Name + Last Name row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label
            htmlFor="firstName"
            className="block text-meta uppercase tracking-extra-wide text-stone mb-4"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            required
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstName: e.target.value }))
            }
            className="w-full border-b border-charcoal/20 py-3 bg-transparent font-body focus:border-charcoal transition-colors outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-meta uppercase tracking-extra-wide text-stone mb-4"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            className="w-full border-b border-charcoal/20 py-3 bg-transparent font-body focus:border-charcoal transition-colors outline-none"
          />
        </div>
      </div>

      {/* Email Address */}
      <div>
        <label
          htmlFor="email"
          className="block text-meta uppercase tracking-extra-wide text-stone mb-4"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="w-full border-b border-charcoal/20 py-3 bg-transparent font-body focus:border-charcoal transition-colors outline-none"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-meta uppercase tracking-extra-wide text-stone mb-4"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          required
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          className="w-full border-b border-charcoal/20 py-3 bg-transparent font-body focus:border-charcoal transition-colors resize-none outline-none"
        />
      </div>

      {status === "error" && (
        <p className="text-meta text-stone">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full md:w-auto px-12 border border-charcoal text-charcoal py-4 text-meta uppercase tracking-extra-wide hover:bg-charcoal hover:text-cream transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
