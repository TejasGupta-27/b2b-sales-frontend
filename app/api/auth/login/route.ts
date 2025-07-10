import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://48.210.58.7:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Login API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to process login request' },
      { status: 500 }
    );
  }
} 