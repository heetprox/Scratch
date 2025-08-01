'use client';

import React, { useState } from 'react';
import { useWeb3 } from '@/context/Provider';

const Profile = ({ profile, isOwner = false }) => {
  const { account, sendPayment, isConnected, connect } = useWeb3();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handlePayment = async () => {
    if (!profile || !account || !isConnected) return;
    
    try {
      setIsLoading(true);
      // Find the first wallet address to send payment to
      const recipientWallet = profile.walletAddresses[0];
      
      if (!recipientWallet) {
        throw new Error('No wallet address found for this profile');
      }
      
      const hash = await sendPayment({
        recipient: recipientWallet.address,
        amount,
        message
      });
      
      setTxHash(hash);
      setAmount('');
      setMessage('');
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
        <p>The requested profile does not exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute -bottom-16 left-8">
            <img 
              src={profile.image} 
              alt={profile.name} 
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-gray-600">@{profile.username}</p>
            </div>
            {!isOwner && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Support {profile.name}</h3>
                {isConnected ? (
                  <div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (ETH)</label>
                      <input 
                        type="text" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.01"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Leave a message..."
                        className="w-full p-2 border rounded-md"
                        rows={2}
                      />
                    </div>
                    <button 
                      onClick={handlePayment}
                      disabled={isLoading || !amount}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : 'Send Payment'}
                    </button>
                    {txHash && (
                      <div className="mt-2 text-sm text-green-600">
                        Payment sent! Transaction: {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 10)}
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={connect}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Connect Wallet to Pay
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">{profile.description}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Wallet Addresses</h2>
            <div className="space-y-2">
              {profile.walletAddresses.map((wallet, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-md">
                  <div className="flex justify-between">
                    <span className="font-medium">{wallet.network}</span>
                    <span className="text-gray-600 text-sm">{wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {profile.payments && profile.payments.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Recent Payments</h2>
              <div className="space-y-2">
                {profile.payments.map((payment) => (
                  <div key={payment.id} className="bg-gray-100 p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">{payment.amount} ETH</span>
                      <span className="text-gray-600 text-sm">
                        {payment.done ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    {payment.transactionHash && (
                      <div className="text-xs text-gray-500 mt-1">
                        Tx: {payment.transactionHash.substring(0, 6)}...{payment.transactionHash.substring(payment.transactionHash.length - 4)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
