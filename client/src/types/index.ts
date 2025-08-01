interface ScratchCard {
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

interface Payment {
    id: string;
    scratchCardId: string;
    amount: number;
    network: string;
    address: string;
    done: boolean;
}