import { withX402 } from 'x402-next';
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CELO_MAINNET } from "@/lib/contracts";

export const dynamic = 'force-dynamic';

const getHandler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const categoryRaw = searchParams.get('category') || 'technology';
  const category = categoryRaw.trim().toLowerCase();
  
  const validCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: `Invalid category '${category}'. Please use one of: ${validCategories.join(', ')}` });
  }

  const apiKey = process.env.NEWS_API_KEY || "cdd52a365a664a4ca542a35327154b6e";
  if (!apiKey || apiKey === 'placeholder' || apiKey.includes('get_free_from')) {
    return NextResponse.json({ mock: true, articles: [{ title: "AI Reaches New Heights", source: {name: "Mock News"}, description: "Mock description" }] });
  }
  const data = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${apiKey}`, {
    headers: { 'User-Agent': 'PayForAPI/1.0' },
    cache: 'no-store'
  });
  const json = await data.json();
  console.log("NEWS API RESPONSE:", JSON.stringify(json).substring(0, 200));
  if (json.status === 'error') {
    return NextResponse.json({ error: json.message });
  }
  return NextResponse.json(json);
};

export const GET = withX402(
  getHandler,
  (process.env.NEXT_PUBLIC_GATEWAY_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  {
    price: '$0.002',
    network: 'celo-mainnet',
    config: { description: 'Latest news headlines - 1 call' },
  }
);

export async function POST(request: NextRequest) {
  try {
    const body: { walletAddress?: string; txHash?: string; category?: string } = await request.json();
    const { walletAddress, txHash, category = "technology" } = body;
    if (!walletAddress || !txHash) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 402 });
    
    const mockReq = new NextRequest(new URL(`http://localhost/api/news?category=${category}`));
    return getHandler(mockReq);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
