'use client';

import React, { useState, useEffect } from 'react';
import { UserService } from '@/lib/UserService';
import { ScratchCard, Payment } from '@/types';
import { useWeb3 } from '@/context/Provider';

interface ScratchCardProfileProps {
  scratchCard: ScratchCard;
  isOwner?: boolean;
  onUpdate?: (updatedCard: ScratchCard) => void;
}

export function Profile({ scratchCard, isOwner = false, onUpdate }: ScratchCardProfileProps) {
  const { account, isConnected } = useWeb3();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: scratchCard.name,
    description: scratchCard.description,
    image: scratchCard.image
  });
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const userService = new UserService();

  useEffect(() => {
    loadPayments();
  }, [scratchCard._id]);

  const loadPayments = async () => {
    try {
      const cardPayments = await userService.getPaymentsByScratchCard(scratchCard._id);
      setPayments(cardPayments.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
    } catch (error) {
      console.error('Failed to load payments:', error);
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    try {
      const updatedCard = await userService.updateScratchCard(scratchCard._id, editForm);
      onUpdate?.(updatedCard);
      setIsEditing(false);
      showNotification('success', 'Profile updated successfully!');
    } catch (error) {
      showNotification('error', 'Failed to update profile');
    }
  };

  const handleAddWalletAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    if (!userService.validateEthereumAddress(newWalletAddress)) {
      showNotification('error', 'Invalid Ethereum address');
      return;
    }

    try {
      const updatedCard = await userService.addWalletAddress(
        scratchCard._id,
        selectedNetwork,
        newWalletAddress
      );
      onUpdate?.(updatedCard);
      setNewWalletAddress('');
      showNotification('success', 'Wallet address added successfully!');
    } catch (error) {
      showNotification('error', 'Failed to add wallet address');
    }
  };

  const handleRemoveWalletAddress = async (network: string) => {
    if (!isOwner) return;

    try {
      const updatedCard = await userService.removeWalletAddress(scratchCard._id, network);
      onUpdate?.(updatedCard);
      showNotification('success', 'Wallet address removed');
    } catch (error) {
      showNotification('error', 'Failed to remove wallet address');
    }
  };

  const handlePaymentSuccess = (transactionHash: string) => {
    showNotification('success', 'Payment sent successfully!');
    setShowPaymentForm(false);
    loadPayments(); // Reload payments
  };

  const handlePaymentError = (error: string) => {
    showNotification('error', `Payment failed: ${error}`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExplorerUrl = (network: string, txHash: string) => {
    const baseUrls: Record<string, string> = {
      ethereum: 'https://etherscan.io/tx/',
      sepolia: 'https://sepolia.etherscan.io/tx/'
    };
    return baseUrls[network] + txHash;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {notification && (
        <div className={`mb-4 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Profile</h2>
            {isOwner && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
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
                  value={editForm.image}
                  onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Profile
              </button>
            </form>
          ) : (
            <div className="text-center">
              <img
                src={scratchCard.image || '/default-avatar.png'}
                alt={scratchCard.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">{scratchCard.name}</h3>
              <p className="text-gray-600">@{scratchCard.username}</p>
              {scratchCard.description && (
                <p className="mt-3 text-gray-700">{scratchCard.description}</p>
              )}
            </div>
          )}

          {/* Wallet Addresses */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Wallet Addresses</h4>
            {scratchCard.WalletAddress.length > 0 ? (
              <div className="space-y-2">
                {scratchCard.WalletAddress.map((wa) => (
                  <div key={wa.network} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium capitalize">{wa.network}</p>
                      <p className="text-sm text-gray-600 font-mono">
                        {wa.address.slice(0, 10)}...{wa.address.slice(-8)}
                      </p>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => handleRemoveWalletAddress(wa.network)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No wallet addresses added</p>
            )}

            {/* Add Wallet Address */}
            {isOwner && (
              <form onSubmit={handleAddWalletAddress} className="mt-4 space-y-3">
                <select
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="sepolia">Sepolia</option>
                </select>
                <input
                  type="text"
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Add Address
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {!isOwner && scratchCard.WalletAddress.length > 0 && (
            <div className="mb-6">
              {!showPaymentForm ? (
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Send Payment
                </button>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Send Payment</h3>
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <PaymentForm
                    scratchCard={scratchCard}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </div>
              )}
            </div>
          )}

          {/* Payment History */}
          <div>
            <h4 className="font-semibold mb-4">Payment History</h4>
            {payments.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-4 border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {userService.formatEthAmount(payment.amount)} ETH
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        payment.done ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.done ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 capitalize">
                      Network: {payment.network}
                    </p>
                    {payment.timestamp && (
                      <p className="text-sm text-gray-500">
                        {formatDate(payment.timestamp)}
                      </p>
                    )}
                    {payment.transactionHash && (
                      <a
                        href={getExplorerUrl(payment.network, payment.transactionHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        View Transaction
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No payments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}