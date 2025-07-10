import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://48.210.58.7:3001';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Forward the Authorization header from the frontend request
    const headers: HeadersInit = {};
    
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    
    const response = await fetch(`${BACKEND_URL}/api/speech/chat/voice`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Voice chat API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice chat request' },
      { status: 500 }
    );
  }
} 