import { ethers } from "hardhat";
import { Scratch } from "../typechain-types";
import { formatEther, formatUnits } from "ethers";

async function main() {
  console.log("Deploying Scratch contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", formatEther(balance), "ETH");

  // Get contract factory
  const ScratchFactory = await ethers.getContractFactory("Scratch");
  
  // Estimate gas
  const deploymentData = await ScratchFactory.getDeployTransaction();
  const estimatedGas = await deployer.estimateGas(deploymentData);
  console.log("Estimated gas:", estimatedGas.toString());

  // Get gas price
  const gasPrice = await ethers.provider.getFeeData();
  const effectiveGasPrice = gasPrice.gasPrice;
  console.log("Gas price:", formatUnits(effectiveGasPrice || 0n, "gwei"), "gwei");

  // Calculate deployment cost
  const deploymentCost = estimatedGas * (effectiveGasPrice || 0n);
  console.log("Estimated deployment cost:", formatEther(deploymentCost), "ETH");

  // Deploy the contract
  console.log("Deploying...");
  const scratch = await ScratchFactory.deploy() as Scratch;
  
  await scratch.waitForDeployment();

  console.log("✅ Scratch contract deployed!");
  const scratchAddress = await scratch.getAddress();
  console.log("Contract address:", scratchAddress);
  
  const deployTx = scratch.deploymentTransaction();
  console.log("Transaction hash:", deployTx?.hash);
  
  // Get deployment receipt
  const receipt = await deployTx?.wait();
  console.log("Gas used:", receipt?.gasUsed.toString());
  
  const actualCost = receipt?.gasUsed ? receipt.gasUsed * (receipt.gasPrice || 0n) : 0n;
  console.log("Actual cost:", formatEther(actualCost), "ETH");

  // Verify contract owner
  const owner = await scratch.owner();
  console.log("Contract owner:", owner);
  
  // Check chain ID
  const chainId = await scratch.getChainId();
  console.log("Chain ID:", chainId.toString());

  // Save deployment info
  const deploymentInfo = {
    contractAddress: scratchAddress,
    transactionHash: deployTx?.hash,
    deployer: deployer.address,
    chainId: chainId.toString(),
    gasUsed: receipt?.gasUsed.toString() || "0",
    gasCost: formatEther(actualCost),
    timestamp: new Date().toISOString()
  };

  console.log("\n📝 Deployment Summary:");
  console.table(deploymentInfo);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });