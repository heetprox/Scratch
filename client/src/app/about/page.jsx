'use client';

import React from 'react';
import { ArrowRight, Wallet, CreditCard, Shield } from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">About Scratch</h1>
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#7A78FF]">Our Mission</h2>
          <p className="text-lg md:text-xl leading-relaxed mb-6">
            Scratch is revolutionizing the way creators receive support by leveraging blockchain technology 
            to create a direct, transparent, and secure payment system between creators and their supporters.
          </p>
          <p className="text-lg md:text-xl leading-relaxed">
            We believe that every creator deserves to be compensated fairly for their work, without 
            intermediaries taking large cuts or imposing restrictive policies. Our platform empowers creators 
            to build meaningful connections with their audience while maintaining full control over their content and earnings.
          </p>

          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-900 p-6 rounded-xl">
            <Wallet className="w-12 h-12 text-[#7A78FF] mb-4" />
            <h3 className="text-xl font-semibold mb-3">Web3 Integration</h3>
            <p className="text-gray-300">
              Connect your crypto wallet and receive payments directly, with no platform fees or delays.
            </p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl">
            <CreditCard className="w-12 h-12 text-[#7A78FF] mb-4" />
            <h3 className="text-xl font-semibold mb-3">Multiple Networks</h3>
            <p className="text-gray-300">
              Support for Ethereum, Polygon, Arbitrum, Optimism, and more networks to come.
            </p>
          </div>

          
          
          <div className="bg-gray-900 p-6 rounded-xl">
            <Shield className="w-12 h-12 text-[#7A78FF] mb-4" />
            <h3 className="text-xl font-semibold mb-3">Secure & Transparent</h3>
            <p className="text-gray-300">
              All transactions are recorded on the blockchain, ensuring complete transparency and security.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#7A78FF]">How It Works</h2>
          <ol className="space-y-6">
            <li className="flex items-start">
              <span className="bg-[#7A78FF] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">1</span>
              <div>
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-gray-300">Link your Web3 wallet to get started. We support MetaMask and other popular wallets.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-[#7A78FF] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">2</span>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                <p className="text-gray-300">Set up your creator profile with your details and wallet addresses for receiving payments.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-[#7A78FF] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">3</span>
              <div>
                <h3 className="text-xl font-semibold mb-2">Share Your Profile</h3>
                <p className="text-gray-300">Share your unique profile link with your audience to start receiving support.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-[#7A78FF] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">4</span>
              <div>
                <h3 className="text-xl font-semibold mb-2">Receive Payments</h3>
                <p className="text-gray-300">Supporters can send crypto directly to your wallet with just a few clicks.</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Ready to Get Started?</h2>
          <Link href="/create-profile" className="inline-flex items-center bg-[#7A78FF] text-white px-6 py-3 rounded-lg hover:bg-[#6563d4] transition-colors">
            Create Your Profile <ArrowRight className="ml-2" />
          </Link>
          <p className="mt-4 text-gray-400">Or try our <Link href="/profile/demo" className="text-[#7A78FF] underline">demo</Link> to see how it works.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;