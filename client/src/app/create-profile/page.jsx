'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '../../components/ProfileForm';
import { Web3Context } from '../../context/Provider';
import { AlertCircle } from 'lucide-react';
import ProfileWizard from '@/components/ProfileWizard';

const CreateProfilePage = () => {
  const router = useRouter();
  const { isConnected, connect, account } = useContext(Web3Context);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingWallet, setIsCheckingWallet] = useState(true);

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        setIsCheckingWallet(true);
        
        // Check if wallet is connected
        if (!isConnected) {
          // Show wallet connection popup
          try {
            await connect();
          } catch (err) {
            console.error('Failed to connect wallet:', err);
            // Redirect back to home if connection fails
            router.push('/');
            return;
          }
        }
        
        // If we have an account, check for existing profile
        if (account) {
          await checkExistingProfile();
        }
      } catch (err) {
        console.error('Wallet initialization error:', err);
        setError('Failed to initialize wallet connection');
      } finally {
        setIsCheckingWallet(false);
      }
    };
    
    initializeWallet();
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
        
        // Check if any profile has the current wallet address (case-insensitive)
        const userProfile = profiles.find(profile => 
          profile.walletAddresses.some(wallet => 
            wallet.address.toLowerCase() === account.toLowerCase()
          )
        );
        
        if (userProfile) {
          // User already has a profile, redirect to it
          console.log('Existing profile found, redirecting to:', userProfile.username);
          router.push(`/profile/${userProfile.username}`);
          return true;
        }
        return false;
      }
    } catch (err) {
      console.error('Error checking existing profile:', err);
      setError('Failed to check existing profiles. Please try again.');
      return false;
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
      <div className="max-w-4xl mx-auto p-6 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Connecting Wallet...</h1>
        <div className="animate-pulse flex justify-center items-center space-x-2">
          <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
          <div className="h-4 w-4 bg-blue-600 rounded-full animation-delay-200"></div>
          <div className="h-4 w-4 bg-blue-600 rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full h-full min-h-screen max-h-screen mx-auto ">
      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start gap-2 max-w-2xl mx-auto">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <ProfileWizard onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateProfilePage;