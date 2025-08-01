import { NextRequest, NextResponse } from 'next/server';
import { createScratchCard, getAllScratchCards } from '@/services/scratchCardService';
import { CreateScratchCardParams } from '@/types';

export async function GET() {
  try {
    const profiles = await getAllScratchCards();
    return NextResponse.json(profiles);
  } catch (error: any) {
    console.error('Failed to fetch profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as CreateScratchCardParams;
    
    // Validate required fields
    if (!data.username || !data.name || !data.description || !data.walletAddresses || data.walletAddresses.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate wallet addresses
    if (data.walletAddresses.some(wallet => !wallet.network || !wallet.address)) {
      return NextResponse.json(
        { error: 'Invalid wallet addresses' },
        { status: 400 }
      );
    }
    
    const profile = await createScratchCard(data);
    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create profile:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}