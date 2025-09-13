#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MoneySaver Quick Deploy Script');
console.log('================================\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from template...');
  if (fs.existsSync('env.example')) {
    fs.copyFileSync('env.example', '.env');
    console.log('✅ .env file created! Please edit it with your configuration.\n');
  } else {
    console.log('❌ env.example not found. Please create .env manually.\n');
  }
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed!\n');
  } catch (error) {
    console.log('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

// Check if Hardhat is installed
try {
  execSync('npx hardhat --version', { stdio: 'pipe' });
} catch (error) {
  console.log('🔧 Installing Hardhat...');
  try {
    execSync('npm install --save-dev @nomicfoundation/hardhat-toolbox hardhat', { stdio: 'inherit' });
    console.log('✅ Hardhat installed!\n');
  } catch (error) {
    console.log('❌ Failed to install Hardhat:', error.message);
    process.exit(1);
  }
}

// Compile contracts
console.log('🔨 Compiling contracts...');
try {
  execSync('npx hardhat compile', { stdio: 'inherit' });
  console.log('✅ Contracts compiled!\n');
} catch (error) {
  console.log('❌ Compilation failed:', error.message);
  process.exit(1);
}

// Run tests
console.log('🧪 Running tests...');
try {
  execSync('npx hardhat test', { stdio: 'inherit' });
  console.log('✅ All tests passed!\n');
} catch (error) {
  console.log('❌ Tests failed:', error.message);
  process.exit(1);
}

// Ask user for deployment choice
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌐 Choose deployment network:');
console.log('1. Local network (for testing)');
console.log('2. Sepolia testnet');
console.log('3. Mainnet (production)');
console.log('4. Skip deployment\n');

rl.question('Enter your choice (1-4): ', (choice) => {
  rl.close();
  
  switch (choice) {
    case '1':
      console.log('\n🚀 Starting local network...');
      console.log('Run "npm run node" in another terminal, then "npm run deploy:local"');
      break;
    case '2':
      console.log('\n🚀 Deploying to Sepolia testnet...');
      try {
        execSync('npx hardhat run scripts/deploy.ts --network sepolia', { stdio: 'inherit' });
        console.log('✅ Deployed to Sepolia!');
      } catch (error) {
        console.log('❌ Deployment failed:', error.message);
      }
      break;
    case '3':
      console.log('\n🚀 Deploying to Mainnet...');
      console.log('⚠️  WARNING: This will deploy to the main Ethereum network!');
      try {
        execSync('npx hardhat run scripts/deploy.ts --network mainnet', { stdio: 'inherit' });
        console.log('✅ Deployed to Mainnet!');
      } catch (error) {
        console.log('❌ Deployment failed:', error.message);
      }
      break;
    case '4':
      console.log('\n⏭️  Skipping deployment.');
      break;
    default:
      console.log('\n❌ Invalid choice.');
  }
  
  console.log('\n📋 Next steps:');
  console.log('1. Update CONTRACT_ADDRESS in src/components/SmartContractIntegration.tsx');
  console.log('2. Test your contract functions');
  console.log('3. Deploy your frontend');
  console.log('\n🎉 Happy coding!');
});
