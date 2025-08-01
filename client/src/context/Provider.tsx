'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { SendPaymentParams, Web3ContextType } from '@/types';
import { CONTRACT_ABI, CONTRACT_ADDRESSES, SUPPORTED_NETWORKS } from './constants';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const metadata = {
  name: 'Scratch Payment App',
  description: 'Peer-to-peer payment application',
  url: 'https://your-app-url.com',
  icons: ['https://your-app-url.com/logo.png']
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: 'https://cloudflare-eth.com'
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

createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: true
});

const Web3Context = createContext<Web3ContextType | null>(null);

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const ethProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(ethProvider);

          // Check if already connected
          const accounts = await ethProvider.send('eth_accounts', []);
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            
            const network = await ethProvider.getNetwork();
            setChainId(Number(network.chainId));
            
            // Initialize contract
            const contractAddress = getContractAddress(Number(network.chainId));
            if (contractAddress) {
              const signer = await ethProvider.getSigner();
              const scratchContract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
              setContract(scratchContract);
            }
          }
        } catch (error) {
          console.error('Failed to initialize Web3:', error);
        }
      }
    };

    initializeWeb3();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
          setContract(null);
        }
      };

      const handleChainChanged = (chainId: string) => {
        const newChainId = parseInt(chainId, 16);
        setChainId(newChainId);
        
        // Reinitialize contract for new network
        if (provider && account) {
          initializeContract(newChainId);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [provider, account]);

  const getContractAddress = (chainId: number): string | null => {
    switch (chainId) {
      case 1:
        return CONTRACT_ADDRESSES.mainnet;
      case 11155111:
        return CONTRACT_ADDRESSES.sepolia;
      default:
        return CONTRACT_ADDRESSES.localhost;
    }
  };

  const initializeContract = async (networkChainId: number) => {
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
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
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

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) throw new Error('No wallet detected');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error: any) {
      // Network doesn't exist, add it
      if (error.code === 4902) {
        const network = SUPPORTED_NETWORKS[targetChainId as keyof typeof SUPPORTED_NETWORKS];
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

  const sendPayment = async (params: SendPaymentParams): Promise<string> => {
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

  const getContractBalance = async (): Promise<string> => {
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

  const contextValue: Web3ContextType = {
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
    provider
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};