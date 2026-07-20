import { ethers } from "ethers";
import { MASTER_MERCHANT_WALLET } from "@/lib/contracts";

/** Extends TransactionRequest to support Celo fee currency override */
interface CeloTransactionRequest extends ethers.TransactionRequest {
  feeCurrency?: string;
}

/**
 * Processes a crypto payment transaction.
 * @returns {Promise<ethers.TransactionReceipt | null>} The transaction receipt or null
 */
export async function processPayment(
  provider: ethers.BrowserProvider,
  tokenAddress: string,
  amount: string,
  productId: number,
  requestId: string,
  isMiniPay: boolean = false,
  decimals: number = 18
): Promise<ethers.TransactionReceipt | null> {
  const signer = await provider.getSigner();
  
  // The merchant / receiver address (x402 requirement)
  const getReceiverAddress = (): string => MASTER_MERCHANT_WALLET;
  const receiverAddress = getReceiverAddress();
  
  // Create ERC20 token instance for direct transfer
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ["function transfer(address to, uint256 amount) public returns (bool)"],
    signer
  );
  
  const parsedAmount = ethers.parseUnits(amount, decimals);

  const overrides: CeloTransactionRequest = {};
  
  if (isMiniPay) {
    // MiniPay best practices: use legacy tx type and let MiniPay handle fee abstraction automatically
    overrides.type = 0;
  } else {
    // Celo-specific override to explicitly pay gas (transaction fee) in USDm
    overrides.feeCurrency = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // USDm contract address
  }

  // Direct ERC20 Transfer to receiver with feeCurrency override
  const transferTx = await tokenContract.transfer(receiverAddress, parsedAmount, overrides);
  const receipt = await transferTx.wait();
  
  return receipt;
}
