import { NextResponse } from "next/server";
import { getNexusData, getSettings } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_ID = "tilwen";

export async function GET() {
  try {
    // Get site settings for contact info
    const settings = await getSettings();

    // Build contact column from settings
    const contactLinks: any[] = [];

    if (settings.contactEmail) {
      contactLinks.push({
        order: 1,
        label: settings.contactEmail,
        href: `mailto:${settings.contactEmail}`,
        type: "email",
      });
    }
    if (settings.pinterest) {
      contactLinks.push({
        order: 2,
        label: "Pinterest",
        href: settings.pinterest,
        type: "social",
      });
    }
    if (settings.instagram) {
      contactLinks.push({
        order: 3,
        label: "Instagram",
        href: settings.instagram,
        type: "social",
      });
    }

    // Get legal pages from Nexus
    let legal: any[] = [];
    try {
      const legalPages = await getNexusData("Nexus_Legal_Pages");
      
      // Get unique page_ids (each page has multiple sections)
      const pageIds = Array.from(new Set(legalPages.map((p: any) => p.page_id)));
      
      // Map to legal links
      const pageTitles: Record<string, string> = {
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        disclaimer: "Disclaimer",
        "intellectual-property": "Intellectual Property",
      };
      
      legal = pageIds
        .filter((id) => pageTitles[id as string])
        .map((id) => ({
          label: pageTitles[id as string],
          href: `/${id}`,
        }));
    } catch (e) {
      console.warn("Could not fetch legal pages from Nexus:", e);
    }

    // Fallback legal if Nexus is empty
    const finalLegal =
      legal.length > 0
        ? legal
        : [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
          ];

    // Build columns for Tilwen e-commerce
    const columns = [
      {
        number: 1,
        title: "Tilwen",
        links: contactLinks.length > 0 ? contactLinks : [
          { order: 1, label: "hello@tilwen.com", href: "mailto:hello@tilwen.com", type: "email" },
        ],
      },
      {
        number: 2,
        title: "Shop",
        links: [
          { order: 1, label: "All Rugs", href: "/", type: "link" },
          { order: 2, label: "About", href: "/about", type: "link" },
          { order: 3, label: "Contact", href: "/contact", type: "link" },
        ],
      },
      {
        number: 3,
        title: "Help",
        links: [
          { order: 1, label: "Shipping", href: "/shipping", type: "link" },
          { order: 2, label: "Returns", href: "/returns", type: "link" },
          { order: 3, label: "Care Guide", href: "/care", type: "link" },
        ],
      },
    ];

    const footerData = {
      brandId: SITE_ID,
      newsletter: {
        show: true,
        title: "New Arrivals",
        description: "Be the first to see new rugs. No spam, just beautiful things.",
        brandName: settings.siteName,
      },
      columns,
      legal: finalLegal,
      copyright: {
        year: new Date().getFullYear(),
        name: settings.siteName,
      },
    };

    const response = NextResponse.json({
      success: true,
      data: footerData,
    });

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error: any) {
    console.error("Footer fetch error:", error);

    // Return fallback on error
    return NextResponse.json({
      success: true,
      data: {
        brandId: SITE_ID,
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
              { order: 1, label: "All Rugs", href: "/", type: "link" },
              { order: 2, label: "About", href: "/about", type: "link" },
              { order: 3, label: "Contact", href: "/contact", type: "link" },
            ],
          },
          {
            number: 3,
            title: "Help",
            links: [
              { order: 1, label: "Shipping", href: "/shipping", type: "link" },
              { order: 2, label: "Returns", href: "/returns", type: "link" },
              { order: 3, label: "Care Guide", href: "/care", type: "link" },
            ],
          },
        ],
        legal: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ],
        copyright: {
          year: new Date().getFullYear(),
          name: "Tilwen",
        },
      },
    });
  }
}
