export const API_PRODUCTS = [
  { id: 0, name: "Weather Info", priceUsd: "$0.001 cUSD/call", priceCredits: 10, description: "Real-time global weather parameters.", inputs: ["Dhaka"] },
  { id: 1, name: "Global News", priceUsd: "$0.002 cUSD/call", priceCredits: 15, description: "Latest headlines by category.", inputs: ["technology"] },
  { id: 2, name: "Crypto Pulse", priceUsd: "$0.001 cUSD/call", priceCredits: 10, description: "Live multi-currency asset prices.", inputs: ["bitcoin,ethereum,usd-coin"] },
  { id: 3, name: "AI Summary", priceUsd: "$0.005 cUSD/call", priceCredits: 25, description: "Summarize extensive text via Gemini.", inputs: ["Web3 protocols enable ownership..."] },
  { id: 4, name: "AI Translate", priceUsd: "$0.003 cUSD/call", priceCredits: 25, description: "Translate English to 30 global languages.", inputs: ["Hello, the future is agentic.", "Spanish"] },
] as const;
