const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Registering Agent with wallet:", deployer.address);

  // Official ERC-8004 Registry on Celo Mainnet
  const REGISTRY_ADDRESS = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432";
  
  // The ABI for the standard ERC-8004 registration function
  const abi = [
    "function register(string metadataURI) external returns (uint256)",
    "function registerAgent(string metadataURI) external returns (uint256)"
  ];
  
  const registryContract = new ethers.Contract(REGISTRY_ADDRESS, abi, deployer);

  // Once deployed to Vercel, this is where your metadata will live:
  const metadataURI = "ipfs://bafkreibg4w3asbccekjcuu47epis3kljbxxajg46dzis6ggq7ym4qse4qa";
  
  console.log("Using metadata URI:", metadataURI);

  try {
    console.log("Sending registration transaction...");
    // Some implementations use register(), others use registerAgent()
    // You may need to verify the exact function name on blockscout
    const tx = await registryContract.register(metadataURI);
    console.log("Transaction Hash:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Successfully registered on ERC-8004 registry!");
    console.log("Block number:", receipt.blockNumber);
  } catch (error) {
    console.error("Error during registration:", error);
    console.log("Note: If 'register' fails, check the exact ABI of the 8004 registry on Celoscan.");
  }
}

main().catch(console.error);
