'use client';

import React, { useState, useEffect } from 'react';
import { UserService } from '@/lib/UserService';
import { Profile } from '@/components/Profile';
import { ScratchCard } from '@/types';
import { useWeb3 } from '@/context/Provider';

export default function HomePage() {
  const { account, isConnected, connect, disconnect, chainId } = useWeb3();
  const [scratchCard, setScratchCard] = useState<ScratchCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchedCard, setSearchedCard] = useState<ScratchCard | null>(null);
  const [createForm, setCreateForm] = useState({
    username: '',
    name: '',
    description: '',
    image: ''
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'search' | 'create'>('profile');

  const userService = new UserService();

  useEffect(() => {
    if (isConnected && account) {
      loadUserProfile();
    }
  }, [isConnected, account]);

  const loadUserProfile = async () => {
    if (!account) return;
    
    setIsLoading(true);
    try {
      // Try to find existing profile by wallet address
      // This would require a backend endpoint to search by wallet address
      // For now, we'll just set loading to false
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !account) {
      await connect();
      return;
    }

    setIsLoading(true);
    try {
      const networkName = userService.getNetworkName(chainId || 1);
      const newCard = await userService.createScratchCard({
        username: createForm.username,
        name: createForm.name,
        description: createForm.description,
        image: createForm.image,
        WalletAddress: [{
          network: networkName,
          address: account
        }],
        payments: []
      });
      
      setScratchCard(newCard);
      setActiveTab('profile');
      setCreateForm({ username: '', name: '', description: '', image: '' });
    } catch (error) {
      console.error('Failed to create profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;

    setIsLoading(true);
    try {
      const card = await userService.getScratchCardByUsername(searchUsername.trim());
      setSearchedCard(card);
    } catch (error) {
      console.error('Failed to search user:', error);
      setSearchedCard(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = (updatedCard: ScratchCard) => {
    setScratchCard(updatedCard);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Scratch</h1>
            
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <p className="text-gray-600">Connected</p>
                    <p className="font-mono text-xs">
                      {account?.slice(0, 6)}...{account?.slice(-4)}
                    </p>
                  </div>
                  <button
                    onClick={disconnect}
                    className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connect}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['profile', 'search', 'create'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            {!isConnected ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
                <p className="text-gray-600 mb-6">
                  Connect your wallet to view or create your payment profile
                </p>
                <button
                  onClick={connect}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            ) : scratchCard ? (
              <Profile
                scratchCard={scratchCard}
                isOwner={true}
                onUpdate={handleUpdateProfile}
              />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">No Profile Found</h2>
                <p className="text-gray-600 mb-6">
                  Create your payment profile to start receiving payments
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Create Profile
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            <div className="max-w-md mx-auto mb-8">
              <form onSubmit={handleSearch} className="flex space-x-3">
                <input
                  type="text"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isLoading || !searchUsername.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </form>
            </div>

            {searchedCard && (
              <Profile
                scratchCard={searchedCard}
                isOwner={false}
              />
            )}
          </div>
        )}

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Your Profile</h2>
            
            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Connect your wallet to create a profile</p>
                <button
                  onClick={connect}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={createForm.username}
                    onChange={(e) => setCreateForm({...createForm, username: e.target.value})}
                    placeholder="yourname"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    placeholder="Your Full Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    placeholder="Tell people about yourself..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={createForm.image}
                    onChange={(e) => setCreateForm({...createForm, image: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 transition-colors font-medium"
                >
                  {isLoading ? 'Creating...' : 'Create Profile'}
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}