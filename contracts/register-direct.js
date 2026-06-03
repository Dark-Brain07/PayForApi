require('dotenv').config({ path: '../.env.local' });
const { ethers } = require('ethers');

async function main() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY;
  if(!pk) {
    console.error("No private key found in .env.local");
    return;
  }
  const provider = new ethers.JsonRpcProvider("https://forno.celo.org");
  const wallet = new ethers.Wallet(pk, provider);
  console.log("Wallet address:", wallet.address);

  const REGISTRY_ADDRESS = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432";
  const abi = [
    "function register(string metadataURI) external returns (uint256)",
    "function registerAgent(string metadataURI) external returns (uint256)"
  ];
  
  const registryContract = new ethers.Contract(REGISTRY_ADDRESS, abi, wallet);
  const metadataURI = "https://payforapi.online/agent-metadata.json";
  
  console.log("Registering URI:", metadataURI);
  try {
    const tx = await registryContract.register(metadataURI);
    console.log("Transaction sent! Hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("Registration complete! Block:", receipt.blockNumber);
  } catch (error) {
    console.error("Registration failed using 'register', trying 'registerAgent'...", error.shortMessage || error.message);
    try {
      const tx2 = await registryContract.registerAgent(metadataURI);
      console.log("Transaction sent! Hash:", tx2.hash);
      const receipt2 = await tx2.wait();
      console.log("Registration complete! Block:", receipt2.blockNumber);
    } catch(err) {
      console.error("Both functions failed.");
    }
  }
}
main();
