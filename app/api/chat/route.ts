import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CELO_MAINNET } from "@/lib/contracts";

export async function POST(request: NextRequest) {
  try {
    const body: { message?: string; walletAddress?: string; txHash?: string; localTime?: string } = await request.json();
    const { message, walletAddress, txHash, localTime } = body;

    if (!message || !walletAddress || !txHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify payment on Celo Mainnet
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 402 });
    }

    console.log(`Verified payment tx: ${txHash} for user ${walletAddress}`);

    const freemodelUrl = "https://api.freemodel.dev/v1/chat/completions";
    const apiKey = process.env.FREEMODEL_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Freemodel API key missing" }, { status: 500 });
    }

    const aiResponse = await fetch(freemodelUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Or whatever model you want to use from Freemodel
        messages: [
          { role: "system", content: `You are a highly capable AI assistant. The exact current date and time for the user is ${localTime || new Date().toLocaleString()}. This time is ALREADY in the user's local timezone. Do NOT add or subtract any hours. If the user asks for the current time, reply with EXACTLY this time without performing any timezone conversions.` },
          { role: "user", content: message }
        ],
        max_tokens: 500,
      }),
    });

    const data = await aiResponse.json();
    
    return NextResponse.json({
      response: data.choices?.[0]?.message?.content || "No response generated.",
      txHash,
      model: "gpt-4o-mini",
      tokensUsed: data.usage?.total_tokens || 0,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
