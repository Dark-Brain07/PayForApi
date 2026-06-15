import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CELO_MAINNET, CONTRACTS } from "@/lib/contracts";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, txHash, endpoint } = await request.json();
    if (!walletAddress || !txHash || !endpoint) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 402 });
    
    // In a real app we'd verify the tx amount, recipient, etc.
    let finalEndpoint = endpoint;
    if (!finalEndpoint.startsWith("http://") && !finalEndpoint.startsWith("https://")) {
      finalEndpoint = "https://" + finalEndpoint;
    }

    // Proxy the request to the creator's endpoint
    // Assuming GET for simplicity in community endpoints
    const res = await fetch(finalEndpoint, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    
    if (!res.ok) {
       return NextResponse.json({ error: `External API returned status ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
