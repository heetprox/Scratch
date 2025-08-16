'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Profile from '@/components/Profile';

const Page = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${username}`);
        if (!response.ok) {
          notFound();
          return;
        }
        const profileData = await response.json();
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!profile) {
    notFound();
  }
  
  return <Profile profile={profile} />;
}

export default Page;