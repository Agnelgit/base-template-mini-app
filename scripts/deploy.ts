import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting MoneySaver contract deployment...");

  // Get the contract factory
  const MoneySaver = await ethers.getContractFactory("MoneySaver");

  // Deploy the contract
  console.log("📦 Deploying MoneySaver contract...");
  const moneySaver = await MoneySaver.deploy();

  // Wait for deployment to finish
  await moneySaver.waitForDeployment();

  const contractAddress = await moneySaver.getAddress();
  const owner = await moneySaver.owner();

  console.log("✅ MoneySaver contract deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("👤 Owner Address:", owner);
  console.log("🔗 Network:", await ethers.provider.getNetwork());

  // Verify contract on Etherscan (if not local network)
  const network = await ethers.provider.getNetwork();
  if (network.chainId !== 1337n && network.chainId !== 31337n) {
    console.log("⏳ Waiting for block confirmations before verification...");
    await moneySaver.deploymentTransaction()?.wait(6);
    
    try {
      console.log("🔍 Verifying contract on Etherscan...");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("⚠️ Contract verification failed:", error);
    }
  }

  console.log("\n🎉 Deployment completed!");
  console.log("📋 Next steps:");
  console.log("1. Update CONTRACT_ADDRESS in src/components/SmartContractIntegration.tsx");
  console.log("2. Test the contract functions");
  console.log("3. Share the contract address with users");

  return {
    contractAddress,
    owner,
    network: network.name,
    chainId: network.chainId.toString(),
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then((result) => {
    console.log("Deployment result:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
