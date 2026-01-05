import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with House of Weaves about research inquiries, pieces from the collection, or collaboration proposals.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-sand">
      <section className="px-6 md:px-12 py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left column — title only */}
            <div>
              <p className="text-meta uppercase tracking-extra-wide text-stone mb-6">
                Get in Touch
              </p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
                Send us<br />
                a note.
              </h1>
            </div>

            {/* Right column — form */}
            <div className="lg:pt-4">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
