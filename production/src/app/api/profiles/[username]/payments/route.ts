import { NextRequest, NextResponse } from 'next/server';
import { getScratchCardByUsername } from '@/services/scratchCardService';
import { createPayment, getPaymentsByScratchCardId, updatePaymentStatus } from '@/services/paymentService';

interface Params {
  params: {
    username: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { username } = params;
    
    // Check if profile exists
    const profile = await getScratchCardByUsername(username);
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Get payments for this profile
    const payments = await getPaymentsByScratchCardId(profile.id);
    return NextResponse.json(payments);
  } catch (error: any) {
    console.error('Failed to fetch payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { username } = params;
    const data = await request.json();
    
    // Check if profile exists
    const profile = await getScratchCardByUsername(username);
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Validate required fields
    if (!data.amount || !data.network || !data.address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create payment
    const payment = await createPayment({
      scratchCardId: profile.id,
      amount: parseFloat(data.amount),
      network: data.network,
      address: data.address
    });
    
    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { username } = params;
    const data = await request.json();
    
    // Check if profile exists
    const profile = await getScratchCardByUsername(username);
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Validate required fields
    if (!data.paymentId || !data.transactionHash || !data.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Update payment status
    const updatedPayment = await updatePaymentStatus(
      data.paymentId,
      data.transactionHash,
      data.timestamp
    );
    
    return NextResponse.json(updatedPayment);
  } catch (error: any) {
    console.error('Failed to update payment:', error);
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}