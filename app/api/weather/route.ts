import { withX402 } from 'x402-next';
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CELO_MAINNET } from "@/lib/contracts";

export const dynamic = 'force-dynamic';

const getHandler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city') || 'Dhaka';
  const apiKey = process.env.OPENWEATHER_API_KEY || "3c9b9c607531d5ff02b2cbf40cfd1989";
  if (!apiKey || apiKey === 'placeholder' || apiKey.includes('get_free_from')) {
    return NextResponse.json({ mock: true, name: city, main: { temp: 298.15, humidity: 74, pressure: 1006 }, weather: [{ description: "haze", main: "Haze" }], wind: { speed: 1.54 }, sys: { country: "BD" } });
  }
  const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
  return NextResponse.json(await data.json());
};

export const GET = withX402(
  getHandler,
  (process.env.NEXT_PUBLIC_GATEWAY_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  {
    price: '$0.001',
    network: 'celo-mainnet',
    config: { description: 'Real-time weather data - 1 call' },
  }
);

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, txHash, city = "Dhaka" } = await request.json();
    if (!walletAddress || !txHash) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
    const tx = await provider.getTransaction(txHash);
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 402 });
    
    const mockReq = new NextRequest(new URL(`http://localhost/api/weather?city=${city}`));
    return getHandler(mockReq);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
