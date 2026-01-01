import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5292';

    const response = await fetch(`${BACKEND_URL}/api/adminauth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Login gagal',
        },
        { status: response.status }
      );
    }

    // Buat response dengan set cookie
    const res = NextResponse.json(data, { status: 200 });
    
    // Set token di cookie (httpOnly lebih aman)
    if (data.token) {
      res.cookies.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 jam
        path: '/',
      });
    }

    return res;
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan di server',
      },
      { status: 500 }
    );
  }
}