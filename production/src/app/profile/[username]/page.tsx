import React from 'react';
import { notFound } from 'next/navigation';
import Profile from '@/components/Profile';
import { getScratchCardByUsername } from '@/services/scratchCardService';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params;
  
  // Fetch profile data
  const profile = await getScratchCardByUsername(username);
  
  // If profile doesn't exist, show 404
  if (!profile) {
    notFound();
  }
  
  return <Profile profile={profile} />;
}

export default ProfilePage;