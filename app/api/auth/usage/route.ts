import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://48.210.58.7:3001';

export async function GET(request: NextRequest) {
  try {
    // Forward headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    
    const response = await fetch(`${BACKEND_URL}/api/auth/usage`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Usage API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to get usage statistics' },
      { status: 500 }
    );
  }
} 