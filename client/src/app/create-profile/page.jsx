'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '../../components/ProfileForm';
import { Web3Context } from '../../context/Provider';

const CreateProfilePage = () => {
  const router = useRouter();
  const { isConnected, connect, account } = useContext(Web3Context);
  const [isLoading, setIsLoading] = useState(false);
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
          // Redirect back to home if connection fails
          router.push('/');
        } finally {
          setIsCheckingWallet(false);
        }
      };
      
      connectWallet();
    } else {
      setIsCheckingWallet(false);
      // Check if user already has a profile
      checkExistingProfile();
    }
  }, [isConnected, connect, router, account]);

  // Function to check if the connected wallet already has a profile
  const checkExistingProfile = async () => {
    if (!account) return;
    
    try {
      setIsLoading(true);
      // Fetch all profiles
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const profiles = await response.json();
        
        // Check if any profile has the current wallet address
        const userProfile = profiles.find(profile => 
          profile.walletAddresses.some(wallet => 
            wallet.address.toLowerCase() === account.toLowerCase()
          )
        );
        
        if (userProfile) {
          // User already has a profile, redirect to it
          router.push(`/profile/${userProfile.username}`);
        }
      }
    } catch (err) {
      console.error('Error checking existing profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create profile');
      }
      
      // Redirect to the new profile page
      router.push(`/profile/${result.username}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingWallet || isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Connecting Wallet...</h1>
        <div className="animate-pulse flex justify-center">
          <div className="h-8 w-8 bg-blue-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Your Profile</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <ProfileForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateProfilePage;