

export const CONTRACT_ADDRESSES = {
  sepolia: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  mainnet: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3" 
};

export const CONTRACT_ABI = require("../abi/Scratch.json").abi;

export const SUPPORTED_NETWORKS = {
  1: {
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/e8082e718e714e858c737b39b579cbf8',
    blockExplorer: 'https://etherscan.io'
  },
  11155111: {
    name: 'Sepolia Testnet',
    currency: 'ETH',
    rpcUrl: 'https://sepolia.infura.io/v3/e8082e718e714e858c737b39b579cbf8',
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};