interface ScratchCard {
  id: string;
  name: string;
  image: string;
  description: string;
  NetworkAddress: {
    network: string;
    address: string;
  }[];
}


