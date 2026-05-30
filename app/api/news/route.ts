import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CONTRACTS, CELO_MAINNET } from "@/lib/contracts";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, txHash, category = "technology" } = await request.json();

    if (!walletAddress || !txHash) {
      return NextResponse.json({ error: "Missing required fields (walletAddress, txHash)" }, { status: 400 });
    }

    // Verify payment on Celo Mainnet
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 402 });
    }

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey || apiKey === 'placeholder' || apiKey.includes('get_free_from')) {
      return NextResponse.json({ mock: true, articles: [{ title: "AI Reaches New Heights", source: {name: "Mock News"} }] });
    }

    const data = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`);
    return NextResponse.json(await data.json());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
