'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Web3Context } from '../context/Provider';
import Home from '@/components/Home';
import Video from '@/components/Video';

export default function HomePage({ profiles = [] }) {
  const router = useRouter();
  const { isConnected, connect } = useContext(Web3Context);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      try {
        await connect();
        router.push('/create-profile');
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      router.push('/create-profile');
    }
  };

  return (
    <div className="w-full bg-[#F58300] min-h-screen  h-full">
      <Home />
      <Video />

    </div>
  );
}


