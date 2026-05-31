import { CONTRACTS } from "./contracts";
import { ethers } from "ethers";

export async function processPayment(
  provider: ethers.BrowserProvider,
  tokenAddress: string,
  amount: string,
  productId: number,
  requestId: string
) {
  const signer = await provider.getSigner();
  
  // The merchant / receiver address (x402 requirement)
  const receiverAddress = "0xfd4960F33670f3477ebe817B184dd59fC4961437";
  
  // Create ERC20 token instance for direct transfer
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ["function transfer(address to, uint256 amount) public returns (bool)"],
    signer
  );
  
  const parsedAmount = ethers.parseUnits(amount, 18);

  // Celo-specific override to explicitly pay gas (transaction fee) in cUSD
  const overrides = {
    feeCurrency: "0x765DE816845861e75A25fCA122bb6898B8B1282a" // cUSD contract address
  };

  // Direct ERC20 Transfer to receiver with feeCurrency override
  const transferTx = await tokenContract.transfer(receiverAddress, parsedAmount, overrides);
  const receipt = await transferTx.wait();
  
  return receipt;
}
