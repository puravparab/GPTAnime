import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, images } = body;

    // Log detailed request information
    console.log('=== Transform API Request ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Prompt:', prompt);
    console.log('Number of images:', images?.length || 0);
    console.log('First image preview (if exists):', images?.[0]?.slice(0, 100) + '...');
    console.log('===========================');

    // Log each image's base64 data
    if (images && images.length > 0) {
      console.log('=== Image Base64 Data ===');
      images.forEach((image: string, index: number) => {
        console.log(`\nImage ${index + 1}:`);
        console.log('Base64:', image);
      });
      console.log('===========================');
    }

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
    console.error('=== Transform API Error ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error:', error);
    console.error('===========================');
    
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