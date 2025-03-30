import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, images } = body;

    return NextResponse.json({ 
      success: true, 
      message: 'Request received successfully',
      details: {
        prompt,
        numberOfImages: images?.length || 0,
        timestamp: new Date().toISOString(),
        images: images || []
      }
    });
  } catch (error) {
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing request',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 