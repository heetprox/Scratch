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
}