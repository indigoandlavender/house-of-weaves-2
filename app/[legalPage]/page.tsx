import { getNexusData } from "@/lib/sheets";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Valid legal page slugs
const LEGAL_PAGES = ["privacy", "terms", "disclaimer", "intellectual-property"];

interface LegalSection {
  page_id: string;
  page_title: string;
  section_order: string;
  section_title: string;
  section_content: string;
}

export async function generateStaticParams() {
  return LEGAL_PAGES.map((slug) => ({ legalPage: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { legalPage: string };
}): Promise<Metadata> {
  const titles: Record<string, string> = {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    disclaimer: "Disclaimer",
    "intellectual-property": "Intellectual Property",
  };

  const title = titles[params.legalPage] || "Legal";

  return {
    title,
    description: `${title} for Tilwen - Moroccan rugs with character and soul.`,
  };
}

export default async function LegalPage({
  params,
}: {
  params: { legalPage: string };
}) {
  const { legalPage } = params;

  // Check if valid legal page
  if (!LEGAL_PAGES.includes(legalPage)) {
    notFound();
  }

  // Fetch legal content from Nexus
  let sections: LegalSection[] = [];
  let pageTitle = "";

  try {
    const legalData = await getNexusData("Nexus_Legal_Pages");
    
    // Filter sections for this page
    sections = legalData
      .filter((row) => row.page_id === legalPage)
      .sort((a, b) => {
        const orderA = parseInt(a.section_order) || 0;
        const orderB = parseInt(b.section_order) || 0;
        return orderA - orderB;
      })
      .map((row) => ({
        page_id: row.page_id || "",
        page_title: row.page_title || "",
        section_order: row.section_order || "0",
        section_title: row.section_title || "",
        section_content: row.section_content || "",
      }));

    // Get page title from first section
    if (sections.length > 0) {
      pageTitle = sections[0].page_title || legalPage;
    }
  } catch (error) {
    console.error("Error fetching legal page:", error);
  }

  // Fallback titles
  const fallbackTitles: Record<string, string> = {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    disclaimer: "Disclaimer",
    "intellectual-property": "Intellectual Property",
  };

  const displayTitle = pageTitle || fallbackTitles[legalPage] || "Legal";

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="py-16 md:py-24 px-6 md:px-12 border-b border-charcoal/10">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            {displayTitle}
          </h1>
          <p className="mt-4 text-stone text-sm">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          {sections.length > 0 ? (
            <div className="space-y-10">
              {sections.map((section, index) => (
                <section key={index}>
                  {section.section_title && (
                    <h2 className="font-serif text-xl text-charcoal mb-4">
                      {section.section_title}
                    </h2>
                  )}
                  <div className="text-stone text-sm leading-relaxed whitespace-pre-wrap">
                    {section.section_content}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="text-stone text-sm leading-relaxed">
              <p>
                This page is being updated. Please contact us at{" "}
                <a
                  href="mailto:hello@tilwen.com"
                  className="text-charcoal hover:text-terracotta transition-colors"
                >
                  hello@tilwen.com
                </a>{" "}
                if you have any questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
