import { withX402 } from 'x402-next';
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CELO_MAINNET } from "@/lib/contracts";

export const dynamic = 'force-dynamic';

const getHandler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') || 'hello';
  const language = searchParams.get('language') || 'French';
  try {
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
    return NextResponse.json({ mock: true, translation: `Mock Translation of: ${text} to ${language}` });
  }
};

export const GET = withX402(
  getHandler,
  (process.env.NEXT_PUBLIC_GATEWAY_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  {
    price: '$0.003',
    network: 'celo-mainnet',
    config: { description: 'AI text translation - 1 call' },
  }
);

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, txHash, text = "hello", language = "French" } = await request.json();
    if (!walletAddress || !txHash) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 402 });
    
    const mockReq = new NextRequest(new URL(`http://localhost/api/translate?text=${encodeURIComponent(text)}&language=${encodeURIComponent(language)}`));
    return getHandler(mockReq);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
