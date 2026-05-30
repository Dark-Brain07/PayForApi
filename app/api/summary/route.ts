import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CONTRACTS, CELO_MAINNET } from "@/lib/contracts";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, txHash, text = "Example text to summarize" } = await request.json();

    if (!walletAddress || !txHash) {
      return NextResponse.json({ error: "Missing required fields (walletAddress, txHash)" }, { status: 400 });
    }

    // Verify payment on Celo Mainnet
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 402 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'placeholder' || apiKey.includes('get_free_from')) {
      return NextResponse.json({ mock: true, summary: "Mock AI Summary of: " + text.substring(0, 50) + "..." });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Summarize this text: " + text }] }]
      })
    });
    
    const data = await response.json();
    return NextResponse.json({ summary: data.candidates?.[0]?.content?.parts?.[0]?.text || "Summary failed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
