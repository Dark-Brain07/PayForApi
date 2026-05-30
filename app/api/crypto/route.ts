import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CONTRACTS, CELO_MAINNET } from "@/lib/contracts";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, txHash, ids = "bitcoin,ethereum,usd-coin" } = await request.json();

    if (!walletAddress || !txHash) {
      return NextResponse.json({ error: "Missing required fields (walletAddress, txHash)" }, { status: 400 });
    }

    // Verify payment on Celo Mainnet
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 402 });
    }

    const data = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
    return NextResponse.json(await data.json());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
