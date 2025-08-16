'use client';

import { Hanken_Grotesk } from 'next/font/google';


const Space_hanken = Hanken_Grotesk({
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
    <div className={`bg-[#fff] flex w-full min-h-screen relative ${Space_hanken.className}`}>

      <div className="w-[50%] flex justify-center p-1 min-h-screen h-full">
        <div className="flex flex-col w-[90%] rounded-t-[1vw] overflow-hidden border-2 border-black/10"
          style={{
            marginTop: "clamp(1rem,5vw,300rem)"
          }}
        >
          <div className="flex w-full bg-black h-[20vh]">

          </div>
          <div className="flex flex-col -translate-y-16  h-fit w-full justify-start"
            style={{
              padding: "0 clamp(1rem,2vw,200rem)"
            }}
          >
            <div className="flex w-full items-center justify-between">

              <Image
                src={profile.image}
                width={100}
                height={100}
                style={{
                  // margin: "0 clamp(1rem,2vw,200rem)"
                }}
                alt='logo'
                className='w-[8vw] border-4 border-white  h-auto rounded-2xl aspect-square'
              />

              <div className="flex gap-2 items-center w-fit">
                <div className="bg-white px-3 py-1 border borde-black text-black rounded-xl text-xl navigator-hand h-fit">
                
                  <span>Follow</span></div>

                <div className="bg-white px-3 py-1 border borde-black text-black rounded-xl text-xl navigator-hand h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>


                </div>
              </div>
            </div>

            <div className={`navigator-hand flex text-2xl mt-3  text-black`}>{profile.name}</div>

            <div className={`${Space_hanken.className} flex text-md font-semibold  text-black/60 -mt-1`}>{profile.username} • cursed</div>

            <div className={`${Space_hanken.className} flex mt-2 font-semibold text-md  text-black`}>Look at things differently!</div>


          </div>

          <div className="flex justify-between gap-2 px-2 w-full">
            <div className="w-1/3 p-2 border-b border-black capitalize items-center justify-center text-sm flex text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </div>
            <div className="w-1/3 p-2 border-b border-black capitalize items-center justify-center text-sm flex text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
              </svg>

            </div>
            <div className="w-1/3 p-2 border-b border-black capitalize items-center justify-center text-sm flex text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>

            </div>
          </div>

        </div>

      </div>
    </div>

  );
}
export default Profile;
