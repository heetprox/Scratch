'use client';

import React, { createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESSES, SUPPORTED_NETWORKS } from './constants';

export const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contract, setContract] = useState(null);
  const [initializationError, setInitializationError] = useState(null);
  const [ethersProvider, setEthersProvider] = useState(null);
  
  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum && isConnected) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setEthersProvider(provider);
      } else {
        setEthersProvider(null);
      }
    };
    
    initProvider();
  }, [isConnected]);

  // Initialize contract when provider, account and chainId are available
  useEffect(() => {
    if (ethersProvider && account && chainId) {
      initializeContract(chainId);
    } else {
      setContract(null);
    }
  }, [ethersProvider, account, chainId]);

  // Listen for account and network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      };

      const handleChainChanged = (chainIdHex) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
      };

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch(error => console.error('Error checking accounts:', error));
      
      // Get current chain ID
      window.ethereum.request({ method: 'eth_chainId' })
        .then(chainIdHex => {
          const newChainId = parseInt(chainIdHex, 16);
          setChainId(newChainId);
        })
        .catch(error => console.error('Error getting chain ID:', error));

      // Set up event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

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
    if (!ethersProvider || !account) return;

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

  const connect = async () => {
    if (!window.ethereum) {
      throw new Error('No Ethereum wallet detected. Please install MetaMask or another wallet.');
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
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
    setIsConnected(false);
    setEthersProvider(null);
    setContract(null);
  };

  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) throw new Error('No wallet connected');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902 && SUPPORTED_NETWORKS[targetChainId]) {
        try {
          const network = SUPPORTED_NETWORKS[targetChainId];
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: network.name,
                nativeCurrency: {
                  name: network.currency,
                  symbol: network.currency,
                  decimals: 18,
                },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorer],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
          throw addError;
        }
      } else {
        console.error('Failed to switch network:', error);
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
      provider: ethersProvider,
      initializationError
    }}>
      {children}
    </Web3Context.Provider>
  );
}