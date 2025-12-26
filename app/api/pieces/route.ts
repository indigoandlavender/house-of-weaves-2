import { NextResponse } from 'next/server';
import { getPieces } from '@/lib/sheets';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const pieces = await getPieces();
    return NextResponse.json(pieces);
  } catch (error) {
    console.error('Error fetching pieces:', error);
    return NextResponse.json({ error: 'Failed to fetch pieces' }, { status: 500 });
  }
}
