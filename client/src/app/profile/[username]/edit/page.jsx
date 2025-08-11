'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import { Web3Context } from '@/context/Provider';
import { AlertCircle } from 'lucide-react';

const EditProfilePage = ({ params }) => {
  const { username } = params;
  const router = useRouter();
  const { isConnected, connect, account } = useContext(Web3Context);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingWallet, setIsCheckingWallet] = useState(true);

  useEffect(() => {
    // Check if wallet is connected
    if (!isConnected) {
      // Show wallet connection popup
      const connectWallet = async () => {
        try {
          setIsCheckingWallet(true);
          await connect();
        } catch (err) {
          console.error('Failed to connect wallet:', err);
          setError('You must connect your wallet to edit your profile');
        } finally {
          setIsCheckingWallet(false);
        }
      };
      
      connectWallet();
    } else {
      setIsCheckingWallet(false);
    }
    
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${username}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/404');
            return;
          }
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [username, router, isConnected, connect]);

  const handleSubmit = async (data) => {
    setIsSaving(true);
    setError('');
    
    try {
      // Ensure wallet is connected before submitting
      if (!isConnected) {
        throw new Error('You must connect your wallet to update your profile');
      }
      
      const response = await fetch(`/api/profiles/${username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      router.push(`/profile/${data.username}`);
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };
  
  if (isCheckingWallet || isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          {isCheckingWallet ? 'Connecting Wallet...' : 'Loading Profile...'}
        </h1>
        <div className="animate-pulse flex justify-center items-center space-x-2">
          <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
          <div className="h-4 w-4 bg-blue-600 rounded-full animation-delay-200"></div>
          <div className="h-4 w-4 bg-blue-600 rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile Not Found</h1>
        <p className="mb-6 text-gray-600">The profile you are looking for does not exist.</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 py-12">
      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start gap-2 max-w-2xl mx-auto">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <ProfileForm 
        initialData={profile} 
        onSubmit={handleSubmit} 
        isLoading={isSaving} 
      />
    </div>
  );
};

export default EditProfilePage;