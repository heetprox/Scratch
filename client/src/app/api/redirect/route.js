import { NextRequest, NextResponse } from 'next/server';

// This API handles redirects from external sites to the payment page
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const amount = searchParams.get('amount');
    const callback = searchParams.get('callback');
    
    if (!username || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Create a temporary payment session
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || request.headers.get('host')}/api/payment-redirect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        amount,
        callbackUrl: callback || '',
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment session');
    }
    
    const data = await response.json();
    
    // Redirect to the payment page
    return NextResponse.redirect(new URL(data.redirectUrl, process.env.NEXT_PUBLIC_APP_URL));
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.json(
      { error: 'Failed to process redirect' },
      { status: 500 }
    );
  }
}