'use client';

import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Provider';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { MoveRight, Copy, ExternalLink } from 'lucide-react';

const Profile = ({ profile, isOwner = false }) => {
  const { account, sendPayment, isConnected, connect } = useContext(Web3Context);
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 bg-[#000] text-[#fefff3]">
        <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
        <p>The requested profile does not exist.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#000] w-full min-h-screen">
      <div className="w-full max-w-6xl mx-auto p-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Profile Image */}
          <div className="relative w-40 h-40 md:w-48 md:h-48">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#7A78FF] p-1">
              {profile.image && (
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image 
                    src={profile.image} 
                    alt={profile.name} 
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-[#fefff3] mb-2">{profile.name}</h1>
            <p className="text-[#fefff3] opacity-70 text-xl mb-4">@{profile.username}</p>
            
            <p className="text-[#fefff3] opacity-90 mb-6 max-w-2xl">{profile.description}</p>
            
            {/* Wallet Addresses */}
            <div className="space-y-2 mb-6">
              {profile.walletAddresses.map((wallet, index) => (
                <div key={index} className="bg-[#111] p-3 rounded-xl border border-[#333] flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-[#7A78FF] font-medium mr-2">{wallet.network}</span>
                    <span className="text-[#fefff3] opacity-80">
                      {wallet.address.substring(0, 8)}...{wallet.address.substring(wallet.address.length - 6)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => copyToClipboard(wallet.address)}
                      className="text-[#fefff3] opacity-70 hover:opacity-100 p-1"
                    >
                      <Copy size={16} />
                    </button>
                    <a 
                      href={`https://etherscan.io/address/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#fefff3] opacity-70 hover:opacity-100 p-1"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Payment Box */}
          {!isOwner && (
            <div className="w-full md:w-80 bg-[#111] p-6 rounded-2xl border border-[#333] self-start">
              <h3 className="text-xl text-[#fefff3] font-semibold mb-4">Support {profile.name}</h3>
              {isConnected ? (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#fefff3] opacity-70 mb-2">Amount (ETH)</label>
                    <input 
                      type="text" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.01"
                      className="w-full bg-[#222] text-[#fefff3] p-3 rounded-xl border border-[#444] focus:border-[#7A78FF] focus:outline-none"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#fefff3] opacity-70 mb-2">Message</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Leave a message..."
                      className="w-full bg-[#222] text-[#fefff3] p-3 rounded-xl border border-[#444] focus:border-[#7A78FF] focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <button 
                    onClick={handlePayment}
                    disabled={isLoading || !amount}
                    className="w-full bg-[#7A78FF] text-[#fefff3] py-3 px-4 rounded-xl font-medium flex items-center justify-center hover:bg-[#6A68EF] transition-colors disabled:bg-[#444] disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : 'Send Payment'}
                    {!isLoading && <MoveRight className="ml-2" size={18} />}
                  </button>
                  {txHash && (
                    <div className="mt-3 text-[#00A652] text-sm">
                      Payment sent! Transaction: {txHash.substring(0, 6)}...{txHash.substring(txHash.length - 4)}
                    </div>
                  )}
                </div>
              ) : (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button 
                      onClick={openConnectModal}
                      className="w-full bg-[#7A78FF] text-[#fefff3] py-3 px-4 rounded-xl font-medium flex items-center justify-center hover:bg-[#6A68EF] transition-colors"
                    >
                      Connect Wallet
                      <MoveRight className="ml-2" size={18} />
                    </button>
                  )}
                </ConnectButton.Custom>
              )}
            </div>
          )}
        </div>
        
        {/* Recent Payments */}
        {profile.payments && profile.payments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-[#fefff3] mb-4">Recent Payments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.payments.map((payment) => (
                <div key={payment.id} className="bg-[#111] p-5 rounded-2xl border border-[#333]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#fefff3] font-bold text-xl">{payment.amount} ETH</span>
                    <span className={`text-sm px-3 py-1 rounded-full ${payment.done ? 'bg-[#00A652]/20 text-[#00A652]' : 'bg-[#FFC412]/20 text-[#FFC412]'}`}>
                      {payment.done ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  {payment.transactionHash && (
                    <div className="flex items-center justify-between text-[#fefff3] opacity-60 text-sm">
                      <span>Tx: {payment.transactionHash.substring(0, 6)}...{payment.transactionHash.substring(payment.transactionHash.length - 4)}</span>
                      <button 
                        onClick={() => copyToClipboard(payment.transactionHash)}
                        className="text-[#fefff3] opacity-70 hover:opacity-100 p-1"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Profile;
