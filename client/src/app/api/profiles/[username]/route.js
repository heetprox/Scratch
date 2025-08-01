import { NextRequest, NextResponse } from 'next/server';
import { getScratchCardByUsername, updateScratchCard, deleteScratchCard } from '@/services/scratchCardService';
import { CreateScratchCardParams } from '@/types';

export async function GET(request, { params }) {
  try {
    const { username } = await params;
    const profile = await getScratchCardByUsername(username);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { username } = params;
    const data = await request.json();
    
    // Check if profile exists
    const existingProfile = await getScratchCardByUsername(username);
    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Update profile
    const updatedProfile = await updateScratchCard(username, data);
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { username } = params;
    
    // Check if profile exists
    const existingProfile = await getScratchCardByUsername(username);
    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Delete profile
    await deleteScratchCard(username);
    return NextResponse.json(
      { message: 'Profile deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete profile:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}