import { ethers } from "ethers";

export interface SendPaymentParams {
  recipient: string;
  amount: string;
  message: string;
}

export interface PaymentSentEvent {
  sender: string;
  recipient: string;
  amount: bigint;
  message: string;
  timestamp: bigint;
  paymentId: string;
  transactionHash?: string;
}

export interface ScratchCard {
  _id: string;
  username: string;
  name: string;
  image: string;
  description: string;
  WalletAddress: {
    network: string;
    address: string;
  }[];
  payments: Payment[];
}

export interface Payment {
  id: string;
  scratchCardId: string;
  amount: number;
  network: string;
  address: string;
  done: boolean;
  transactionHash?: string;
  timestamp?: number;
}

export interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  sendPayment: (params: SendPaymentParams) => Promise<string>;
  getContractBalance: () => Promise<string>;
  contract: ethers.Contract | null;
  provider: ethers.BrowserProvider | null;
}