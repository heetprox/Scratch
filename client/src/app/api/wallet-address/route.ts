import { NextRequest, NextResponse } from 'next/server';
import { FirebaseService } from '@/lib/FirebaseService';

const firebaseService = new FirebaseService();

// POST /api/wallet-address
// Add a wallet address to a scratch card
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scratchCardId, network, address } = body;
    
    if (!scratchCardId || !network || !address) {
      return NextResponse.json(
        { error: 'scratchCardId, network, and address are required' }, 
        { status: 400 }
      );
    }
    
    const scratchCard = await firebaseService.addWalletAddress(scratchCardId, network, address);
    return NextResponse.json(scratchCard);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/wallet-address?scratchCardId=id&network=network
// Remove a wallet address from a scratch card
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scratchCardId = searchParams.get('scratchCardId');
    const network = searchParams.get('network');
    
    if (!scratchCardId || !network) {
      return NextResponse.json(
        { error: 'scratchCardId and network are required' }, 
        { status: 400 }
      );
    }
    
    const scratchCard = await firebaseService.removeWalletAddress(scratchCardId, network);
    return NextResponse.json(scratchCard);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}