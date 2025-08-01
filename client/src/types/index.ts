export interface ScratchCard {
  _id: string;
  name: string;
  image: string;
  description: string;
  NetworkAddress: {
    network: string;
    address: string;
  }[];
  payments: Payment[];
}

export interface UserData {
  walletAddress: string;
  username?: string;
  email?: string;
  createdAt?: any;
  lastLogin?: any;
  isActive: boolean;
}

export interface Payment {
    id: string;
    scratchCardId: string;
    amount: number;
    network: string;
    address: string;
    done: boolean;
}