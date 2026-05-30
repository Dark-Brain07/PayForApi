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
  
  // Create contract instances
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ["function approve(address spender, uint256 amount) public returns (bool)"],
    signer
  );
  
  const gatewayContract = new ethers.Contract(
    CONTRACTS.API_GATEWAY.address,
    CONTRACTS.API_GATEWAY.abi,
    signer
  );

  const parsedAmount = ethers.parseUnits(amount, 18);

  // 1. Approve token spending
  const approveTx = await tokenContract.approve(CONTRACTS.API_GATEWAY.address, parsedAmount);
  await approveTx.wait();

  // 2. Pay for API
  const payTx = await gatewayContract.payForAPI(
    tokenAddress,
    parsedAmount,
    productId,
    requestId
  );
  const receipt = await payTx.wait();
  
  return receipt;
}
