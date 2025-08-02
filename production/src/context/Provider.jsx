'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { CONTRACT_ABI, CONTRACT_ADDRESSES, SUPPORTED_NETWORKS } from './constants';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const metadata = {
  name: 'Scratch Payment App',
  description: 'Peer-to-peer payment application',
  url: 'https://your-app-url.com',
  icons: ['https://your-app-url.com/logo.png']
};

// Updated ethers config with better injected wallet handling
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: 'https://cloudflare-eth.com',
  // Add these options to better handle wallet conflicts
  defaultChainId: 1,
  auth: {
    email: false // Disable email auth to reduce conflicts
  }
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

// Create Web3Modal with additional options to handle connector conflicts
createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: true,
  // Add these options to reduce connector conflicts
  themeMode: 'light',
  themeVariables: {
    '--w3m-z-index': 1000
  },
  // Explicitly include wallets to avoid auto-detection conflicts
  includeWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
    '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662', // Rabby
  ]
});

export const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [initializationError, setInitializationError] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      // Add a small delay to ensure all wallet extensions are loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Check if there are multiple providers (common with Rabby + MetaMask)
          let selectedProvider = window.ethereum;
          
          // If multiple providers exist, prefer the user's selection
          if (window.ethereum.providers?.length > 0) {
            // Let the user choose or use the first available
            selectedProvider = window.ethereum.providers[0];
          }
          
          const ethProvider = new ethers.BrowserProvider(selectedProvider);
          setProvider(ethProvider);

          const accounts = await ethProvider.send('eth_accounts', []);
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            
            const network = await ethProvider.getNetwork();
            setChainId(Number(network.chainId));
            
            const contractAddress = getContractAddress(Number(network.chainId));
            if (contractAddress) {
              const signer = await ethProvider.getSigner();
              const scratchContract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
              setContract(scratchContract);
            }
          }
        } catch (error) {
          console.error('Failed to initialize Web3:', error);
          setInitializationError(error.message);
        }
      }
    };

    initializeWeb3();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
          setContract(null);
        }
      };

      const handleChainChanged = (chainId) => {
        const newChainId = parseInt(chainId, 16);
        setChainId(newChainId);
        
        if (provider && account) {
          initializeContract(newChainId);
        }
      };

      // Use a more defensive approach for event listeners
      try {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      } catch (error) {
        console.warn('Failed to attach wallet event listeners:', error);
      }

      return () => {
        try {
          window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum?.removeListener('chainChanged', handleChainChanged);
        } catch (error) {
          console.warn('Failed to remove wallet event listeners:', error);
        }
      };
    }
  }, [provider, account]);

  const getContractAddress = (chainId) => {
    switch (chainId) {
      case 1:
        return CONTRACT_ADDRESSES.mainnet;
      case 11155111:
        return CONTRACT_ADDRESSES.sepolia;
      default:
        return CONTRACT_ADDRESSES.localhost;
    }
  };

  const initializeContract = async (networkChainId) => {
    if (!provider || !account) return;

    try {
      const contractAddress = getContractAddress(networkChainId);
      if (contractAddress && contractAddress !== "0x...") {
        const signer = await provider.getSigner();
        const scratchContract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
        setContract(scratchContract);
      }
    } catch (error) {
      console.error('Failed to initialize contract:', error);
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        // Handle multiple providers more gracefully
        let selectedProvider = window.ethereum;
        if (window.ethereum.providers?.length > 0) {
          selectedProvider = window.ethereum.providers[0];
        }
        
        const ethProvider = new ethers.BrowserProvider(selectedProvider);
        await ethProvider.send('eth_requestAccounts', []);
        
        const signer = await ethProvider.getSigner();
        const address = await signer.getAddress();
        const network = await ethProvider.getNetwork();
        
        setProvider(ethProvider);
        setAccount(address);
        setChainId(Number(network.chainId));
        setIsConnected(true);
        
        await initializeContract(Number(network.chainId));
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    setProvider(null);
    setContract(null);
  };

  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) throw new Error('No wallet detected');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        const network = SUPPORTED_NETWORKS[targetChainId];
        if (network) {
          await window.ethereum.request({
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
    if (!contract || !provider) {
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
      account,
      chainId,
      isConnected,
      isConnecting,
      connect,
      disconnect,
      switchNetwork,
      sendPayment,
      getContractBalance,
      contract,
      provider,
      initializationError
    }}>
      {children}
    </Web3Context.Provider>
  );
}