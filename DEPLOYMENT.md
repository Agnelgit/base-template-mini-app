# Smart Contract Deployment Guide

This guide will help you deploy the MoneySaver smart contract to various networks.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **MetaMask** or another Web3 wallet
4. **Test ETH** for deployment (for testnets)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Hardhat dependencies:
```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox hardhat
```

## Environment Setup

1. Copy the environment file:
```bash
cp env.example .env
```

2. Edit `.env` with your configuration:
```env
# For Sepolia testnet
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# For mainnet (when ready)
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

## Getting Test ETH

### Sepolia Testnet
- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Enter your wallet address
- Request test ETH

### Other Testnets
- [Goerli Faucet](https://goerlifaucet.com/)
- [Mumbai Faucet](https://faucet.polygon.technology/)

## Deployment Steps

### 1. Compile the Contract
```bash
npm run compile
```

### 2. Run Tests
```bash
npm run test
```

### 3. Deploy to Local Network (for testing)
```bash
# Terminal 1: Start local Hardhat node
npm run node

# Terminal 2: Deploy to local network
npm run deploy:local
```

### 4. Deploy to Sepolia Testnet
```bash
npm run deploy:sepolia
```

### 5. Deploy to Mainnet (when ready)
```bash
npm run deploy:mainnet
```

## After Deployment

1. **Update Contract Address**: Copy the deployed contract address and update it in:
   - `src/components/SmartContractIntegration.tsx` (line 78)
   - Or set `NEXT_PUBLIC_CONTRACT_ADDRESS` in your `.env` file

2. **Verify Contract**: The deployment script will automatically verify the contract on Etherscan

3. **Test the Contract**: Use the frontend to test deposit and withdrawal functions

## Contract Functions

### For Users
- `deposit()`: Deposit ETH to the contract
- `getUserBalance(address)`: Check user's deposit balance
- `getBalance()`: Check total contract balance

### For Owner
- `withdraw()`: Withdraw all funds from the contract
- `transferOwnership(address)`: Transfer contract ownership
- `getContractInfo()`: Get complete contract information

## Security Considerations

1. **Private Key Security**: Never commit your private key to version control
2. **Test First**: Always test on testnets before mainnet deployment
3. **Verify Contract**: Ensure contract is verified on Etherscan
4. **Ownership**: Keep your private key secure as the contract owner

## Troubleshooting

### Common Issues

1. **"Insufficient funds"**: Make sure you have enough ETH for gas fees
2. **"Contract verification failed"**: Check your Etherscan API key
3. **"Nonce too low"**: Wait a moment and try again
4. **"Gas limit exceeded"**: Increase gas limit in deployment script

### Getting Help

- Check the [Hardhat documentation](https://hardhat.org/docs)
- Visit [Etherscan](https://etherscan.io/) to verify your contract
- Use [Remix IDE](https://remix.ethereum.org/) for contract development

## Contract Addresses

After deployment, your contract addresses will be:

- **Local Network**: `0x5FbDB2315678afecb367f032d93F642f64180aa3` (example)
- **Sepolia**: `0x...` (your deployed address)
- **Mainnet**: `0x...` (your deployed address)

## Next Steps

1. Test all contract functions
2. Update the frontend with the correct contract address
3. Deploy your frontend to Vercel or your preferred platform
4. Share your mini-app with users!

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure you have sufficient test ETH
4. Check network connectivity
