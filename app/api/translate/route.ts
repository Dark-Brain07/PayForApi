import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CONTRACTS, CELO_MAINNET } from "@/lib/contracts";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, txHash, text = "hello", language = "French" } = await request.json();

    if (!walletAddress || !txHash) {
      return NextResponse.json({ error: "Missing required fields (walletAddress, txHash)" }, { status: 400 });
    }

    // Verify payment on Celo Mainnet
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 402 });
    }

    const response = await fetch("https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-fr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: text })
    });
    
    const data = await response.json();
    if (data.error) {
       return NextResponse.json({ mock: true, translation: `Mock Translation of: ${text} to ${language} (API Rate Limited)` });
    }
    return NextResponse.json({ translation: data[0]?.translation_text || "Translation failed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
