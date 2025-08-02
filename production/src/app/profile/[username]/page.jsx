import React from 'react';
import { notFound } from 'next/navigation';
import Profile from '@/components/Profile';
import { getScratchCardByUsername } from '@/services/scratchCardService';

async function ProfilePage({ params }) {
  const { username } = params;
  
  const profile = await getScratchCardByUsername(username);
  
  if (!profile) {
    notFound();
  }
  
  return <Profile profile={profile} />;
}

export default ProfilePage;