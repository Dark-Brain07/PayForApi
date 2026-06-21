import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "healthy",
    agent: "Pay For API",
    chain: "Celo Mainnet",
    x402Support: true,
    timestamp: new Date().toISOString()
  });
}
