'use client';

import React, { useState, useEffect } from 'react';
import { UserService } from '@/lib/UserService';
import { ScratchCard } from '@/types';
import { useWeb3 } from '@/context/Provider';

interface PaymentFormProps {
    scratchCard: ScratchCard;
    onPaymentSuccess?: (transactionHash: string) => void;
    onPaymentError?: (error: string) => void;
}

export function PaymentForm({ scratchCard, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
    const {
        account,
        chainId,
        isConnected,
        isConnecting,
        connect,
        sendPayment,
        switchNetwork
    } = useWeb3();

    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState<string>('ethereum');
    const [recipientAddress, setRecipientAddress] = useState<string>('');

    const userService = new UserService();

    // Set recipient address based on selected network
    useEffect(() => {
        const walletAddress = scratchCard.WalletAddress.find(
            wa => wa.network === selectedNetwork
        );
        setRecipientAddress(walletAddress?.address || '');
    }, [selectedNetwork, scratchCard.WalletAddress]);

    // Ensure correct network is selected
    useEffect(() => {
        if (isConnected && chainId) {
            const networkName = userService.getNetworkName(chainId);
            if (networkName !== 'unknown') {
                setSelectedNetwork(networkName);
            }
        }
    }, [chainId, isConnected]);

    const handleNetworkChange = (network: string) => {
        setSelectedNetwork(network);

        // Switch to corresponding blockchain network
        if (isConnected) {
            const targetChainId = network === 'ethereum' ? 1 : 11155111; // Sepolia
            if (chainId !== targetChainId) {
                switchNetwork(targetChainId).catch(console.error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConnected) {
            try {
                await connect();
            } catch (error) {
                onPaymentError?.('Failed to connect wallet');
                return;
            }
        }

        if (!userService.validateAmount(amount)) {
            onPaymentError?.('Please enter a valid amount');
            return;
        }

        if (!userService.validateEthereumAddress(recipientAddress)) {
            onPaymentError?.('Invalid recipient address');
            return;
        }

        if (!message.trim()) {
            onPaymentError?.('Please enter a message');
            return;
        }

        setIsProcessing(true);

        try {
            // Send payment through smart contract
            const transactionHash = await sendPayment({
                recipient: recipientAddress,
                amount: amount,
                message: message.trim()
            });

            // Record payment in database
            await userService.createPayment({
                scratchCardId: scratchCard._id,
                amount: parseFloat(amount),
                network: selectedNetwork,
                address: recipientAddress,
                done: true,
                transactionHash,
                timestamp: Date.now()
            });

            // Reset form
            setAmount('');
            setMessage('');

            onPaymentSuccess?.(transactionHash);
        } catch (error: any) {
            console.error('Payment failed:', error);
            onPaymentError?.(userService.handleApiError(error));
        } finally {
            setIsProcessing(false);
        }
    };

    const availableNetworks = scratchCard.WalletAddress.filter(wa => wa.address);

    if (availableNetworks.length === 0) {
        return (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                    This user hasn't added any wallet addresses yet.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Send Payment</h3>
                <div className="flex items-center space-x-3">
                    <img
                        src={scratchCard.image || '/default-avatar.png'}
                        alt={scratchCard.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-medium">{scratchCard.name}</p>
                        <p className="text-gray-600 text-sm">@{scratchCard.username}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Network
                    </label>
                    <select
                        value={selectedNetwork}
                        onChange={(e) => handleNetworkChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isProcessing}
                    >
                        {availableNetworks.map((wa) => (
                            <option key={wa.network} value={wa.network}>
                                {wa.network.charAt(0).toUpperCase() + wa.network.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Address
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm font-mono">
                        {recipientAddress ? (
                            <span className="text-gray-800">
                                {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
                            </span>
                        ) : (
                            <span className="text-gray-500">No address for selected network</span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount (ETH)
                    </label>
                    <input
                        type="number"
                        step="0.000001"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isProcessing}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Say something nice..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        disabled={isProcessing}
                        required
                        maxLength={200}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {message.length}/200 characters
                    </p>
                </div>

                {isConnected && chainId && (
                    <div className="text-xs text-gray-600">
                        Connected to: {userService.getNetworkName(chainId)}
                        {chainId !== (selectedNetwork === 'ethereum' ? 1 : 11155111) && (
                            <span className="text-yellow-600 ml-2">
                                ⚠️ Switch to {selectedNetwork} network
                            </span>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isProcessing || !recipientAddress || isConnecting}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${isProcessing || !recipientAddress || isConnecting
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        }`}
                >
                    {isConnecting ? 'Connecting...' :
                        isProcessing ? 'Processing...' :
                            !isConnected ? 'Connect & Send Payment' :
                                'Send Payment'}
                </button>
            </form>

            {isConnected && (
                <div className="mt-4 text-xs text-gray-500 text-center">
                    <p>Connected: {account?.slice(0, 6)}...{account?.slice(-4)}</p>
                </div>
            )}
        </div>
    );
}
