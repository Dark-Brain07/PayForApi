import { withX402 } from 'x402-next';
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CELO_MAINNET } from "@/lib/contracts";

export const dynamic = 'force-dynamic';

const getHandler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get('ids') || 'bitcoin,ethereum,usd-coin';
  const data = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
  return NextResponse.json(await data.json());
};

export const GET = withX402(
  getHandler,
  (process.env.NEXT_PUBLIC_GATEWAY_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  {
    price: '$0.001',
    network: 'celo-mainnet',
    config: { description: 'Live crypto prices - 1 call' },
  }
);

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, txHash, ids = "bitcoin,ethereum,usd-coin" } = await request.json();
    if (!walletAddress || !txHash) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 402 });
    
    const mockReq = new NextRequest(new URL(`http://localhost/api/crypto?ids=${ids}`));
    return getHandler(mockReq);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
