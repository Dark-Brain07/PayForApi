import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CELO_MAINNET } from "@/lib/contracts";
import { loggerInstance } from "@/lib/server/logger";

/** Handles AI image generation requests */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: { prompt?: string; walletAddress?: string; txHash?: string } = await request.json();
    const { prompt, walletAddress, txHash } = body;

    if (!prompt || !walletAddress || !txHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify payment on Celo Mainnet
    console.log(`[API/Image] Verifying txHash: ${txHash}`);
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      console.error(`[API/Image] Transaction NOT FOUND on Celo Mainnet: ${txHash}`);
      return NextResponse.json({ error: "Transaction not found on Celo Mainnet" }, { status: 402 });
    }
    console.log(`[API/Image] Transaction found:`, tx.hash);

    // Generate image using Pollinations AI authenticated endpoint
    const imageResponse = await fetch("https://gen.pollinations.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.POLLINATIONS_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "flux",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
      })
    });

    if (!imageResponse.ok) {
      const errData = await imageResponse.text();
      throw new Error(`Failed to generate image: ${imageResponse.statusText} - ${errData}`);
    }

    const data = await imageResponse.json();
    const base64Image = data.data?.[0]?.b64_json;
    
    if (!base64Image) {
      throw new Error("Invalid response format from image API");
    }

    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      txHash,
      model: "flux (pollinations.ai)"
    });

  } catch (error: unknown) {
    loggerInstance.error("Image Gen API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: `Image generation failed: ${errorMessage}` }, { status: 500 });
  }
}
