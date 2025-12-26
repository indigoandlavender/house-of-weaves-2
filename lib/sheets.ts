import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.HOW_SPREADSHEET_ID;

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

// ==================== STORIES ====================

export interface Story {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  heroImage: string;
  heroCaption: string;
  excerpt: string;
  body: string;
  readTime: string;
  year: string;
  textBy: string;
  imagesBy: string;
  sources: string;
  tags?: string;
  published: string;
  featured: string;
  order: string;
}

export async function getStories(): Promise<Story[]> {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Stories!A:Q',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return [];

    const headers = rows[0];
    const stories = rows.slice(1).map((row) => {
      const story: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        let value = row[index] || '';
        if (typeof value === 'string') {
          value = value.replace(/<br>/g, '\n');
        }
        story[header] = value;
      });
      return story as unknown as Story;
    });

    return stories.filter((story) => {
      const pub = String(story.published || '').toLowerCase().trim();
      return pub === 'true' || pub === 'yes' || pub === '1';
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const stories = await getStories();
  return stories.find((story) => story.slug === slug) || null;
}

// ==================== PIECES (ARCHIVE + COLLECTION) ====================

export interface Piece {
  slug: string;
  title: string;
  subtitle: string;
  origin: string;
  region: string;
  period: string;
  circa: string;
  dimensions: string;
  materials: string;
  technique: string;
  condition: string;
  heroImage: string;
  description: string;
  provenance: string;
  notes: string;
  available: string;
  price: string;
  currency: string;
  shopifyId: string;
  published: string;
  featured: string;
  order: string;
}

export async function getPieces(): Promise<Piece[]> {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Pieces!A:W',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return [];

    const headers = rows[0];
    const pieces = rows.slice(1).map((row) => {
      const piece: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        let value = row[index] || '';
        if (typeof value === 'string') {
          value = value.replace(/<br>/g, '\n');
        }
        piece[header] = value;
      });
      return piece as unknown as Piece;
    });

    return pieces.filter((piece) => {
      const pub = String(piece.published || '').toLowerCase().trim();
      return pub === 'true' || pub === 'yes' || pub === '1';
    });
  } catch (error) {
    console.error('Error fetching pieces:', error);
    return [];
  }
}

export async function getPieceBySlug(slug: string): Promise<Piece | null> {
  const pieces = await getPieces();
  return pieces.find((piece) => piece.slug === slug) || null;
}

export async function getArchivePieces(): Promise<Piece[]> {
  const pieces = await getPieces();
  return pieces.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
}

export async function getCollectionPieces(): Promise<Piece[]> {
  const pieces = await getPieces();
  return pieces
    .filter((piece) => {
      const available = String(piece.available || '').toLowerCase().trim();
      return available === 'true' || available === 'yes' || available === '1';
    })
    .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
}

export async function getFeaturedPieces(): Promise<Piece[]> {
  const pieces = await getPieces();
  return pieces
    .filter((piece) => {
      const featured = String(piece.featured || '').toLowerCase().trim();
      return featured === 'true' || featured === 'yes' || featured === '1';
    })
    .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
}

// ==================== IMAGES ====================

export interface PieceImage {
  piece_slug: string;
  image_order: number;
  image_url: string;
  caption: string;
  type: 'main' | 'detail' | 'context';
}

export async function getPieceImages(slug: string): Promise<PieceImage[]> {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Images!A:E',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return [];

    const images = rows.slice(1)
      .map((row) => ({
        piece_slug: row[0] || '',
        image_order: parseInt(row[1]) || 0,
        image_url: row[2] || '',
        caption: row[3] || '',
        type: (row[4] || 'main') as 'main' | 'detail' | 'context',
      }))
      .filter((img) => img.piece_slug === slug && img.image_url)
      .sort((a, b) => a.image_order - b.image_order);

    return images;
  } catch (error) {
    console.error('Error fetching piece images:', error);
    return [];
  }
}

export interface StoryImage {
  story_slug: string;
  image_order: number;
  image_url: string;
  caption: string;
}

export async function getStoryImages(slug: string): Promise<StoryImage[]> {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Story_Images!A:D',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return [];

    const images = rows.slice(1)
      .map((row) => ({
        story_slug: row[0] || '',
        image_order: parseInt(row[1]) || 0,
        image_url: row[2] || '',
        caption: row[3] || '',
      }))
      .filter((img) => img.story_slug === slug && img.image_url)
      .sort((a, b) => a.image_order - b.image_order);

    return images;
  } catch (error) {
    console.error('Error fetching story images:', error);
    return [];
  }
}

// ==================== SETTINGS ====================

export async function getSetting(key: string): Promise<string | null> {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Settings!A:B',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return null;

    const setting = rows.slice(1).find((row) => row[0] === key);
    return setting ? setting[1] || null : null;
  } catch (error) {
    console.error('Error fetching setting:', error);
    return null;
  }
}

export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Settings!A:B',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return {};

    const settings: Record<string, string> = {};
    rows.slice(1).forEach((row) => {
      if (row[0]) {
        settings[row[0]] = row[1] || '';
      }
    });
    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
}
