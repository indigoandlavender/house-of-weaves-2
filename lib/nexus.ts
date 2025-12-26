import { google } from 'googleapis';

const NEXUS_SPREADSHEET_ID = process.env.NEXUS_SPREADSHEET_ID;
const SITE_ID = process.env.SITE_ID || 'house-of-weaves';

async function getAuthClient() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString()
    );
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    return auth;
  }
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return auth;
}

export interface SiteConfig {
  site_id: string;
  site_name: string;
  site_url: string;
  legal_entity: string;
  contact_email: string;
  contact_phone: string;
  whatsapp: string;
  jurisdiction_country: string;
  jurisdiction_city: string;
  address_line1: string;
  address_line2: string;
  site_type: string;
  parent_brand: string;
  year_founded: string;
  currency_default: string;
  language_default: string;
}

export interface LegalSection {
  template_id: string;
  section_order: number;
  section_title: string;
  content: string;
}

// Get site configuration from Nexus
export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SPREADSHEET_ID,
      range: 'Sites!A:P',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return null;

    const headers = rows[0];
    const sites = rows.slice(1).map((row) => {
      const site: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        site[header] = row[index] || '';
      });
      return site as unknown as SiteConfig;
    });

    return sites.find((site) => site.site_id === SITE_ID) || null;
  } catch (error) {
    console.error('Error fetching site config:', error);
    return null;
  }
}

// Get legal content for a specific template
export async function getLegalContent(templateId: string): Promise<LegalSection[]> {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SPREADSHEET_ID,
      range: 'Legal_Content!A:D',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return [];

    const sections = rows.slice(1)
      .filter((row) => row[0] === templateId)
      .map((row) => ({
        template_id: row[0] || '',
        section_order: parseInt(row[1]) || 0,
        section_title: row[2] || '',
        content: row[3] || '',
      }))
      .sort((a, b) => a.section_order - b.section_order);

    return sections;
  } catch (error) {
    console.error('Error fetching legal content:', error);
    return [];
  }
}

// Replace template variables with site config values
export function processTemplate(content: string, config: SiteConfig): string {
  const replacements: Record<string, string> = {
    '{{site_id}}': config.site_id,
    '{{site_name}}': config.site_name,
    '{{site_url}}': config.site_url,
    '{{legal_entity}}': config.legal_entity,
    '{{contact_email}}': config.contact_email,
    '{{contact_phone}}': config.contact_phone,
    '{{whatsapp}}': config.whatsapp,
    '{{jurisdiction_country}}': config.jurisdiction_country,
    '{{jurisdiction_city}}': config.jurisdiction_city,
    '{{address_line1}}': config.address_line1,
    '{{address_line2}}': config.address_line2,
    '{{year_founded}}': config.year_founded,
  };

  let processed = content;
  for (const [key, value] of Object.entries(replacements)) {
    processed = processed.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
  }
  return processed;
}

// Get fully processed legal page
export async function getLegalPage(templateId: string): Promise<{ title: string; sections: { title: string; content: string }[] } | null> {
  const config = await getSiteConfig();
  if (!config) {
    console.error('No site config found for SITE_ID:', SITE_ID);
    return null;
  }

  const sections = await getLegalContent(templateId);
  if (sections.length === 0) {
    console.error('No legal content found for template:', templateId);
    return null;
  }

  const titleMap: Record<string, string> = {
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service',
    'disclaimer': 'Disclaimer',
    'intellectual-property': 'Intellectual Property',
    'booking-terms': 'Booking Terms & Conditions',
    'cancellation-policy': 'Cancellation Policy',
  };

  return {
    title: titleMap[templateId] || templateId,
    sections: sections.map((section) => ({
      title: section.section_title,
      content: processTemplate(section.content, config),
    })),
  };
}

// Get footer links from Nexus
export async function getFooterLinks(): Promise<{ label: string; url: string }[]> {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SPREADSHEET_ID,
      range: 'Footer_Links!A:B',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return [
        { label: 'Privacy', url: '/privacy' },
        { label: 'Terms', url: '/terms' },
        { label: 'Disclaimer', url: '/disclaimer' },
        { label: 'IP', url: '/intellectual-property' },
      ];
    }

    return rows.slice(1).map((row) => ({
      label: row[0] || '',
      url: row[1] || '',
    })).filter((link) => link.label && link.url);
  } catch (error) {
    console.error('Error fetching footer links:', error);
    return [
      { label: 'Privacy', url: '/privacy' },
      { label: 'Terms', url: '/terms' },
      { label: 'Disclaimer', url: '/disclaimer' },
      { label: 'IP', url: '/intellectual-property' },
    ];
  }
}
