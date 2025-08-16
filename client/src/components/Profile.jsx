'use client';

import { Hanken_Grotesk } from 'next/font/google';


const Space_hanken =Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
})

import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Provider';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { MoveRight, Copy, ExternalLink, Check } from 'lucide-react';

const Profile = ({ profile, isOwner = false }) => {
  const { account, sendPayment, isConnected, connect } = useContext(Web3Context);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [copiedAddress, setCopiedAddress] = useState('');

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
    setCopiedAddress(text);
    setTimeout(() => {
      setCopiedAddress('');
    }, 2000);
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
    <div className="bg-[#fff] flex w-full min-h-screen relative">

      <div className="w-[50%] flex justify-center p-1 min-h-screen h-full">
        <div className="flex flex-col w-[90%] rounded-t-[2vw] overflow-hidden border-2 border-black/10"
          style={{
            marginTop: "clamp(1rem,5vw,300rem)"
          }}
        >
          <div className="flex w-full bg-black h-[20vh]">

          </div>
          <div className="flex flex-col -translate-y-16  h-full w-full justify-start"
            style={{
              padding: "0 clamp(1rem,1vw,200rem)"
            }}
          >
            <Image
              src={profile.image}
              width={100}
              height={100}
               style={{
              margin: "0 clamp(1rem,2vw,200rem)"
            }}
              alt='logo'
              className='w-[8vw] border-4   border-white  h-auto rounded-4xl aspect-square'
            />

            <div className={`${Space_hanken.className} flex text-3xl mt-5 font-semibold text-black`}>{profile.name}</div>
            <div className={`${Space_hanken.className} flex text-xl  text-black`}>@{profile.username}</div>


          </div>

        </div>

      </div>
    </div>

  );
}
export default Profile;
