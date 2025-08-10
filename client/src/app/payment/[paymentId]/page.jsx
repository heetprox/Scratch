'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Web3Context } from '@/context/Provider';
import Image from 'next/image';
import { MoveRight } from 'lucide-react';

const PaymentPage = () => {
  const { paymentId } = useParams();
  const router = useRouter();
  const { account, sendPayment, isConnected, connect } = useContext(Web3Context);
  
  const [payment, setPayment] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        // In a real implementation, you would fetch the payment session data
        // For now, we'll simulate this with a timeout
        setTimeout(() => {
          // Simulated data - in production, fetch this from your API
          setPayment({
            id: paymentId,
            amount: '0.01',
            callbackUrl: 'https://example.com/payment-callback',
            status: 'pending'
          });
          
          // Simulated profile data - in production, fetch this from your API
          setProfile({
            id: 'profile-id',
            username: 'demo-user',
            name: 'Demo User',
            image: '/heet.jpg',
            description: 'This is a demo profile for payment testing',
            walletAddresses: [
              { network: 'Ethereum', address: '0x1234567890abcdef1234567890abcdef12345678' }
            ]
          });
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setError('Failed to load payment information');
        setIsLoading(false);
      }
    };

    if (paymentId) {
      fetchPaymentData();
    }
  }, [paymentId]);

  const handlePayment = async () => {
    if (!profile || !account || !isConnected || !payment) return;
    
    try {
      setIsPaying(true);
      // Find the first wallet address to send payment to
      const recipientWallet = profile.walletAddresses[0];
      
      if (!recipientWallet) {
        throw new Error('No wallet address found for this profile');
      }
      
      const hash = await sendPayment({
        recipient: recipientWallet.address,
        amount: payment.amount,
        message
      });
      
      setTxHash(hash);
      
      // In a real implementation, you would call your API to update the payment status
      // and then redirect to the callback URL with the payment result
      setTimeout(() => {
        window.location.href = `${payment.callbackUrl}?status=success&txHash=${hash}`;
      }, 3000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setError('Payment failed: ' + error.message);
    } finally {
      setIsPaying(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError('Failed to connect wallet: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#000] w-full min-h-screen flex items-center justify-center">
        <div className="text-[#fefff3] text-2xl">Loading payment information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#000] w-full min-h-screen flex flex-col items-center justify-center">
        <div className="text-[#FF6D38] text-2xl mb-4">{error}</div>
        <button 
          onClick={() => router.push('/')}
          className="bg-[#7A78FF] text-[#fefff3] px-6 py-3 rounded-full flex items-center"
        >
          Go Home <MoveRight className="ml-2" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#000] w-full min-h-screen">
      <div className="w-full h-full flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#111] p-8 rounded-3xl shadow-lg">
          <div className="flex items-center justify-center mb-6">
            {profile?.image && (
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-[#7A78FF]">
                <Image 
                  src={profile.image} 
                  alt={profile.name} 
                  fill 
                  className="object-cover"
                />
              </div>
            )}
          </div>
          
          <h1 className="text-[#fefff3] text-3xl font-bold text-center mb-2">
            Pay {profile?.name}
          </h1>
          
          <p className="text-[#fefff3] opacity-80 text-center mb-6">
            @{profile?.username}
          </p>
          
          <div className="bg-[#222] p-6 rounded-2xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#fefff3] opacity-70">Amount</span>
              <span className="text-[#fefff3] text-xl font-bold">{payment?.amount} ETH</span>
            </div>
            
            <div className="mb-4">
              <label className="block text-[#fefff3] opacity-70 mb-2">Message (optional)</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a message..."
                className="w-full bg-[#333] text-[#fefff3] p-3 rounded-xl border border-[#444] focus:border-[#7A78FF] focus:outline-none"
                rows={2}
              />
            </div>
          </div>
          
          {isConnected ? (
            <button 
              onClick={handlePayment}
              disabled={isPaying}
              className="w-full bg-[#7A78FF] text-[#fefff3] py-3 px-6 rounded-xl font-medium flex items-center justify-center hover:bg-[#6A68EF] transition-colors disabled:bg-[#444] disabled:cursor-not-allowed"
            >
              {isPaying ? 'Processing...' : 'Confirm Payment'}
              {!isPaying && <MoveRight className="ml-2" />}
            </button>
          ) : (
            <button 
              onClick={handleConnect}
              className="w-full bg-[#7A78FF] text-[#fefff3] py-3 px-6 rounded-xl font-medium flex items-center justify-center hover:bg-[#6A68EF] transition-colors"
            >
              Connect Wallet <MoveRight className="ml-2" />
            </button>
          )}
          
          {txHash && (
            <div className="mt-4 text-[#00A652] text-center">
              Payment sent! Redirecting...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;