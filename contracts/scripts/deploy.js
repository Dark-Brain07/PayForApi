const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy AgentRegistry
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const registry = await AgentRegistry.deploy();
  await registry.waitForDeployment();
  console.log("AgentRegistry:", await registry.getAddress());

  // Deploy APIPaymentGateway
  const Gateway = await ethers.getContractFactory("APIPaymentGateway");
  const gateway = await Gateway.deploy(deployer.address);
  await gateway.waitForDeployment();
  const gatewayAddress = await gateway.getAddress();
  console.log("APIPaymentGateway:", gatewayAddress);

  // Add all Celo stablecoins
  const tokens = [
    ["0x765DE816845861e75A25fCA122bb6898B8B1282a", "cUSD"],
    ["0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73", "cEUR"],
    ["0x456a3D042C0DbD3db53D5489e98dFb038553B0d0", "cKES"],
    ["0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787", "cBRL"],
    ["0xfAeA5F3404bbA20D3cc2f8C4B0A888F55a3c7313", "cGHS"],
    ["0x8A567e2aE79CA692Bd748aB832081C45de4041eA", "cCOP"],
    ["0x105d4A9306D2E55a71d2Eb95B81553AE1dC20d7B", "PUSO"],
  ];

  for (const [address, symbol] of tokens) {
    await gateway.addSupportedToken(address, symbol);
    console.log(`Added ${symbol}: ${address}`);
  }

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("Copy these to your .env.local:");
  console.log(`NEXT_PUBLIC_GATEWAY_ADDRESS=${gatewayAddress}`);
  console.log(`NEXT_PUBLIC_REGISTRY_ADDRESS=${await registry.getAddress()}`);
}

main().catch(console.error);
