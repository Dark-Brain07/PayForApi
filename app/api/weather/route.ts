import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CONTRACTS, CELO_MAINNET } from "@/lib/contracts";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, txHash, city = "Dhaka" } = await request.json();

    if (!walletAddress || !txHash) {
      return NextResponse.json({ error: "Missing required fields (walletAddress, txHash)" }, { status: 400 });
    }

    // Verify payment on Celo Mainnet
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 402 });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'placeholder' || apiKey.includes('get_free_from')) {
      return NextResponse.json({ mock: true, name: city, main: { temp: 298.15 }, weather: [{ description: "Sunny (mock data)" }] });
    }

    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    return NextResponse.json(await data.json());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
