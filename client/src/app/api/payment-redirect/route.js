import { NextRequest, NextResponse } from 'next/server';
import { createPayment, updatePaymentStatus } from '@/services/paymentService';
import { getScratchCardByUsername } from '@/services/scratchCardService';
import { v4 } from 'uuid';

// This API allows external sites to redirect users to make payments
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.username || !data.amount || !data.callbackUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get profile by username
    const profile = await getScratchCardByUsername(data.username);
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Create a payment session
    const paymentId = v4();
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/${paymentId}`;
    
    // Store payment session data
    const sessionData = {
      id: paymentId,
      profileId: profile.id,
      amount: data.amount,
      callbackUrl: data.callbackUrl,
      status: 'pending',
      createdAt: new Date(),
    };
    
    // Store in a session or database
    // For now, we'll use the existing payment model
    await createPayment(
      profile.id,
      data.amount,
      'redirect', // Using 'redirect' as network to distinguish from blockchain payments
      'external', // Placeholder for external payments
      null // No transaction hash yet
    );
    
    return NextResponse.json({
      success: true,
      paymentId,
      redirectUrl,
    });
  } catch (error) {
    console.error('Failed to create payment redirect:', error);
    return NextResponse.json(
      { error: 'Failed to create payment redirect' },
      { status: 500 }
    );
  }
}

// Webhook for external sites to notify of payment completion
export async function PATCH(request) {
  try {
    const data = await request.json();
    
    if (!data.paymentId || !data.status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Update payment status
    await updatePaymentStatus(
      data.paymentId,
      data.transactionId || 'external-payment',
      Date.now()
    );
    
    return NextResponse.json({
      success: true,
      message: 'Payment status updated',
    });
  } catch (error) {
    console.error('Failed to update payment status:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
}