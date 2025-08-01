import { NextRequest, NextResponse } from 'next/server';
import { FirebaseService } from '@/lib/FirebaseService';

const firebaseService = new FirebaseService();

// GET /api/scratch-cards?username=username
// GET /api/scratch-cards/:id
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const username = searchParams.get('username');
    
    if (id) {
      const scratchCard = await firebaseService.getScratchCard(id);
      return NextResponse.json(scratchCard);
    } else if (username) {
      const scratchCard = await firebaseService.getScratchCardByUsername(username);
      return NextResponse.json(scratchCard);
    } else {
      const query = searchParams.get('query') || '';
      const scratchCards = await firebaseService.searchScratchCards(query);
      return NextResponse.json(scratchCards);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/scratch-cards
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const scratchCard = await firebaseService.createScratchCard(body);
    return NextResponse.json(scratchCard, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/scratch-cards?id=id
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const body = await req.json();
    const scratchCard = await firebaseService.updateScratchCard(id, body);
    return NextResponse.json(scratchCard);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/scratch-cards?id=id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await firebaseService.deleteScratchCard(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}