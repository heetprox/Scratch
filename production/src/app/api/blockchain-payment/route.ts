import { NextRequest, NextResponse } from 'next/server';
import { FirebaseService } from '@/lib/FirebaseService';
import { PaymentSentEvent } from '@/types';

const firebaseService = new FirebaseService();

// POST /api/blockchain-payment
// Record a payment from blockchain event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentEvent, scratchCardId } = body;
    
    if (!paymentEvent || !scratchCardId) {
      return NextResponse.json(
        { error: 'paymentEvent and scratchCardId are required' }, 
        { status: 400 }
      );
    }
    
    // Validate the payment event structure
    const requiredFields = ['sender', 'recipient', 'amount', 'message', 'timestamp'];
    for (const field of requiredFields) {
      if (!(field in paymentEvent)) {
        return NextResponse.json(
          { error: `paymentEvent is missing required field: ${field}` }, 
          { status: 400 }
        );
      }
    }
    
    const payment = await firebaseService.recordBlockchainPayment(
      paymentEvent as PaymentSentEvent, 
      scratchCardId
    );
    
    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}