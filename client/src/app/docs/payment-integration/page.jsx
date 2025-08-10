'use client';

import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { generatePaymentButtonCode } from '@/services/redirectService';

const PaymentIntegrationPage = () => {
  const [username, setUsername] = useState('demo-user');
  const [amount, setAmount] = useState('0.01');
  const [callbackUrl, setCallbackUrl] = useState('https://example.com/payment-callback');
  const [buttonText, setButtonText] = useState('Pay with ScratchCard');
  const [buttonColor, setButtonColor] = useState('#7A78FF');
  const [textColor, setTextColor] = useState('#FFFFFF');
  
  const generatedCode = generatePaymentButtonCode(username, amount, callbackUrl, {
    buttonText,
    buttonColor,
    textColor,
  });
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="bg-[#000] min-h-screen text-[#fefff3]">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Payment Integration</h1>
        
        <div className="mb-10">
          <p className="mb-4">
            ScratchCard allows you to easily integrate cryptocurrency payments into your website or application.
            Follow the instructions below to get started.
          </p>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Integration Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111] p-6 rounded-2xl border border-[#333]">
              <h3 className="text-xl font-semibold mb-3">Payment Button</h3>
              <p className="opacity-80 mb-4">
                Add a payment button to your website that redirects users to ScratchCard to complete the payment.
              </p>
              <div className="bg-[#222] p-3 rounded-xl">
                <code className="text-[#00A652]">Easy to implement</code>
              </div>
            </div>
            
            <div className="bg-[#111] p-6 rounded-2xl border border-[#333]">
              <h3 className="text-xl font-semibold mb-3">API Integration</h3>
              <p className="opacity-80 mb-4">
                Use our API to create custom payment experiences in your application.
              </p>
              <div className="bg-[#222] p-3 rounded-xl">
                <code className="text-[#FFC412]">Advanced implementation</code>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Payment Button Generator</h2>
          
          <div className="bg-[#111] p-6 rounded-2xl border border-[#333] mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium opacity-70 mb-2">Username</label>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#222] p-3 rounded-xl border border-[#444] focus:border-[#7A78FF] focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium opacity-70 mb-2">Amount (ETH)</label>
                    <input 
                      type="text" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-[#222] p-3 rounded-xl border border-[#444] focus:border-[#7A78FF] focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium opacity-70 mb-2">Callback URL</label>
                    <input 
                      type="text" 
                      value={callbackUrl}
                      onChange={(e) => setCallbackUrl(e.target.value)}
                      className="w-full bg-[#222] p-3 rounded-xl border border-[#444] focus:border-[#7A78FF] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Styling</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium opacity-70 mb-2">Button Text</label>
                    <input 
                      type="text" 
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      className="w-full bg-[#222] p-3 rounded-xl border border-[#444] focus:border-[#7A78FF] focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium opacity-70 mb-2">Button Color</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={buttonColor}
                        onChange={(e) => setButtonColor(e.target.value)}
                        className="h-10 w-10 rounded cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={buttonColor}
                        onChange={(e) => setButtonColor(e.target.value)}
                        className="flex-1 bg-[#222] p-3 rounded-xl border border-[#444] focus:border-[#7A78FF] focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium opacity-70 mb-2">Text Color</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-10 w-10 rounded cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 bg-[#222] p-3 rounded-xl border border-[#444] focus:border-[#7A78FF] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#111] p-6 rounded-2xl border border-[#333]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Generated Code</h3>
              <button 
                onClick={() => copyToClipboard(generatedCode)}
                className="bg-[#222] p-2 rounded-lg hover:bg-[#333] transition-colors"
              >
                <Copy size={18} />
              </button>
            </div>
            
            <div className="bg-[#222] p-4 rounded-xl overflow-x-auto">
              <pre className="text-[#FFC412] whitespace-pre-wrap">{generatedCode}</pre>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Preview</h4>
              <div className="bg-white p-6 rounded-xl flex justify-center">
                <div dangerouslySetInnerHTML={{ __html: generatedCode }} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">API Reference</h2>
          
          <div className="bg-[#111] p-6 rounded-2xl border border-[#333]">
            <h3 className="text-xl font-semibold mb-3">Create Payment Session</h3>
            
            <div className="bg-[#222] p-4 rounded-xl mb-4 overflow-x-auto">
              <code className="text-[#7A78FF]">POST /api/payment-redirect</code>
            </div>
            
            <p className="opacity-80 mb-4">Request Body:</p>
            
            <div className="bg-[#222] p-4 rounded-xl mb-6 overflow-x-auto">
              <pre className="text-[#FFC412]">{`{
  "username": "demo-user",
  "amount": "0.01",
  "callbackUrl": "https://example.com/payment-callback"
}`}</pre>
            </div>
            
            <p className="opacity-80 mb-4">Response:</p>
            
            <div className="bg-[#222] p-4 rounded-xl overflow-x-auto">
              <pre className="text-[#00A652]">{`{
  "success": true,
  "paymentId": "abc123",
  "redirectUrl": "https://scratchcard.com/payment/abc123"
}`}</pre>
            </div>
          </div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Webhook Integration</h2>
          
          <div className="bg-[#111] p-6 rounded-2xl border border-[#333]">
            <p className="mb-4">
              When a payment is completed, ScratchCard will send a webhook to your callback URL with the payment details.
            </p>
            
            <p className="opacity-80 mb-4">Webhook Payload:</p>
            
            <div className="bg-[#222] p-4 rounded-xl overflow-x-auto">
              <pre className="text-[#FFC412]">{`{
  "paymentId": "abc123",
  "status": "completed",
  "amount": "0.01",
  "transactionHash": "0x1234...",
  "timestamp": 1621234567890
}`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentIntegrationPage;