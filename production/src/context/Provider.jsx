'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { CONTRACT_ABI, CONTRACT_ADDRESSES, SUPPORTED_NETWORKS } from './constants';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const metadata = {
  name: 'Scratch Payment App',
  description: 'Peer-to-peer payment application',
  url: 'https://your-app-url.com',
  icons: ['https://your-app-url.com/logo.png']
};

// Simplified ethers config to reduce conflicts
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: false, // Disable to reduce conflicts
  enableInjected: true,
  enableCoinbase: false, // Disable to reduce conflicts
  rpcUrl: 'https://cloudflare-eth.com',
  defaultChainId: 1,
});

const chains = [
  {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
  },
  {
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://ethereum-sepolia.publicnode.com'
  }
];

// Suppress console errors from wallet connectors
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      args.some(arg => 
        typeof arg === 'string' && 
        (arg.includes('ConnectorController.setConnectors') || 
         arg.includes('Not possible to add connector'))
      )
    ) {
      return; // Suppress this specific error
    }
    originalError.apply(console, args);
  };
}

// Create Web3Modal with minimal configuration to avoid conflicts
createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: false, // Disable to reduce conflicts
  themeMode: 'light',
});

export const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [contract, setContract] = useState(null);
  const [initializationError, setInitializationError] = useState(null);
  
  // Use Web3Modal hooks instead of manual state management
  const { open, close } = useWeb3Modal();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  // Convert Web3Modal provider to ethers provider
  const [ethersProvider, setEthersProvider] = useState(null);

  useEffect(() => {
    if (walletProvider) {
      const provider = new ethers.BrowserProvider(walletProvider);
      setEthersProvider(provider);
    } else {
      setEthersProvider(null);
    }
  }, [walletProvider]);

  useEffect(() => {
    if (ethersProvider && address && chainId) {
      initializeContract(chainId);
    } else {
      setContract(null);
    }
  }, [ethersProvider, address, chainId]);

  const getContractAddress = (networkChainId) => {
    switch (networkChainId) {
      case 1:
        return CONTRACT_ADDRESSES.mainnet;
      case 11155111:
        return CONTRACT_ADDRESSES.sepolia;
      default:
        return CONTRACT_ADDRESSES.localhost;
    }
  };

  const initializeContract = async (networkChainId) => {
    if (!ethersProvider || !address) return;

    try {
      const contractAddress = getContractAddress(networkChainId);
      if (contractAddress && contractAddress !== "0x...") {
        const signer = await ethersProvider.getSigner();
        const scratchContract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
        setContract(scratchContract);
      }
    } catch (error) {
      console.error('Failed to initialize contract:', error);
      setInitializationError(error.message);
    }
  };

  // Use Web3Modal's connect instead of manual connection
  const connect = async () => {
    try {
      await open();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await close();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const switchNetwork = async (targetChainId) => {
    if (!walletProvider) throw new Error('No wallet connected');

    try {
      await walletProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        const network = SUPPORTED_NETWORKS[targetChainId];
        if (network) {
          await walletProvider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: network.name,
              nativeCurrency: {
                name: network.currency,
                symbol: network.currency,
                decimals: 18,
              },
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.blockExplorer],
            }],
          });
        }
      } else {
        throw error;
      }
    }
  };

  const sendPayment = async (params) => {
    if (!contract || !ethersProvider) {
      throw new Error('Contract not initialized');
    }

    try {
      const amountInWei = ethers.parseEther(params.amount);
      
      const tx = await contract.sendPayment(
        params.recipient,
        params.message,
        { value: amountInWei }
      );

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  };

  const getContractBalance = async () => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const balance = await contract.getContractBalance();
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get contract balance:', error);
      throw error;
    }
  };

  return (
    <Web3Context.Provider value={{
      account: address,
      chainId,
      isConnected,
      isConnecting: false, 
      connect,
      disconnect,
      switchNetwork,
      sendPayment,
      getContractBalance,
      contract,
      provider: ethersProvider,
      initializationError
    }}>
      {children}
    </Web3Context.Provider>
  );
}