import { NextRequest, NextResponse } from 'next/server';
import { createScratchCard, getAllScratchCards } from '@/services/scratchCardService';
import { CreateScratchCardParams } from '@/types';

export async function GET() {
  try {
    const profiles = await getAllScratchCards();
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
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
    
    // Standardize Ethereum addresses (make them all lowercase)
    data.walletAddresses = data.walletAddresses.map(wallet => ({
      ...wallet,
      address: wallet.address.toLowerCase()
    }));
    
    // Remove duplicate addresses
    const uniqueAddresses = new Map();
    data.walletAddresses = data.walletAddresses.filter(wallet => {
      const key = `${wallet.network}-${wallet.address}`;
      if (uniqueAddresses.has(key)) {
        return false;
      }
      uniqueAddresses.set(key, true);
      return true;
    });
    
    const profile = await createScratchCard(data);
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
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