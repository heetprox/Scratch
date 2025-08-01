import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";


export interface ScratchCard {
  id: string;
  username: string;
  name: string;
  image: string;
  description: string;
  walletAddresses: {
    network: string;
    address: string;
  }[];
  payments?: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  senderId: string;
  amount: number;
  network: string;
  address: string;
  done: boolean;
  transactionHash?: string;
  timestamp?: bigint | number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PrismaSingleton {
  prisma: PrismaClient;
}

export interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  getContractBalance: () => Promise<string>;
  contract: ethers.Contract | null;
  provider: ethers.BrowserProvider | null;
}

interface EthereumProvider {
  request(args: { method: string; params?: any[] }): Promise<any>;
  on(event: string, callback: (...args: any[]) => void): void;
  removeListener(event: string, callback: (...args: any[]) => void): void;
  isMetaMask?: boolean;
  isConnected(): boolean;
  selectedAddress?: string;
  chainId?: string;
  networkVersion?: string;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}