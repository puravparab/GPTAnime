import { NextResponse } from 'next/server';
import { GeminiFlashEdit } from '@/services/gemini';

export async function POST(
  request: Request
) {
  try {
    const { prompt, images } = await request.json();

    if (!prompt || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Prompt and images array are required.' },
        { status: 400 }
      );
    }

    const results = await GeminiFlashEdit(prompt, images);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in transform API:', error);
    return NextResponse.json(
      { error: 'Failed to transform images' },
      { status: 500 }
    );
  }
} 