import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CELO_MAINNET, CONTRACTS } from "@/lib/contracts";

/**
 * Handles x402 payment validation and proxies requests to community API endpoints.
 * @param {NextRequest} request - Next.js HTTP Request
 * @returns {Promise<NextResponse>} Next.js HTTP Response
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) || {};
    const { walletAddress, txHash, endpoint } = body;
    if (!walletAddress || !txHash || !endpoint) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 402 });
    
    const HTTP_OK = 200;
    if (!res.ok) {
       return NextResponse.json({ error: `External API returned status ${res.status}` }, { status: res.status });
    }
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
    console.warn(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
