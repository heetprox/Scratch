# ScratchCard Smart Contract

A simple Ethereum smart contract for sending payments with messages.

## Features

- Send payments with custom messages
- Platform fee mechanism (configurable by owner)
- Reentrancy protection
- Owner management

## Prerequisites

- Node.js (v16+)
- Bun or npm/yarn
- Ethereum wallet with testnet/mainnet ETH

## Installation

```bash
# Using bun
bun install

# Or using npm
npm install
```

## Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit the `.env` file with your configuration:
   - Add your private key (for deployment)
   - Add RPC URLs for networks
   - Add Etherscan API key (for verification)

## Compilation

```bash
bun run compile
# or
npm run compile
```

## Testing

```bash
bun run test
# or
npm run test
```

## Deployment

### Using Hardhat

```bash
# Deploy to Sepolia testnet
bun run deploy:sepolia
# or
npm run deploy:sepolia

# Deploy to Ethereum mainnet
bun run deploy:mainnet
# or
npm run deploy:mainnet
```

### Using Hardhat Ignition

```bash
# Deploy to Sepolia testnet
bun run ignition:sepolia
# or
npm run ignition:sepolia

# Deploy to Ethereum mainnet
bun run ignition:mainnet
# or
npm run ignition:mainnet
```

## Contract Verification

After deployment, verify your contract on Etherscan:

```bash
bun run verify <NETWORK> <CONTRACT_ADDRESS>
# or
npm run verify <NETWORK> <CONTRACT_ADDRESS>
```

Example:
```bash
bun run verify sepolia 0x1234567890123456789012345678901234567890
```

## Local Development

Start a local Hardhat node:

```bash
bun run node
# or
npm run node
```

## License

MIT
