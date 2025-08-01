import { NextRequest, NextResponse } from 'next/server';
import { FirebaseService } from '@/lib/FirebaseService';

const firebaseService = new FirebaseService();

// GET /api/payments?scratchCardId=id
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scratchCardId = searchParams.get('scratchCardId');
    const paymentId = searchParams.get('id');
    
    if (paymentId) {
      const payment = await firebaseService.getPayment(paymentId);
      return NextResponse.json(payment);
    } else if (scratchCardId) {
      const payments = await firebaseService.getPaymentsByScratchCard(scratchCardId);
      return NextResponse.json(payments);
    } else {
      return NextResponse.json({ error: 'scratchCardId or id parameter is required' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/payments
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payment = await firebaseService.createPayment(body);
    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/payments?id=id
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const body = await req.json();
    const payment = await firebaseService.updatePayment(id, body);
    return NextResponse.json(payment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/payments/complete
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, transactionHash } = body;
    
    if (!id || !transactionHash) {
      return NextResponse.json({ error: 'ID and transactionHash are required' }, { status: 400 });
    }
    
    const payment = await firebaseService.markPaymentComplete(id, transactionHash);
    return NextResponse.json(payment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}