"use client";
import { useState, useEffect } from "react";
import APICard from "@/components/api/APICard";
import PaymentModal from "@/components/payment/PaymentModal";
import { CELO_STABLECOINS } from "@/lib/stablecoins";
import { useWallet } from "@/components/wallet/WalletContext";

const API_PRODUCTS = [
  { id: 0, name: "Weather Info", priceUsd: "$0.001 USDC/call", description: "Real-time global weather parameters.", inputs: ["Dhaka"] },
  { id: 1, name: "Global News", priceUsd: "$0.002 USDC/call", description: "Latest headlines by category.", inputs: ["technology"] },
  { id: 2, name: "Crypto Pulse", priceUsd: "$0.001 USDC/call", description: "Live multi-currency asset prices.", inputs: ["bitcoin,ethereum,usd-coin"] },
  { id: 3, name: "AI Summary", priceUsd: "$0.005 USDC/call", description: "Summarize extensive text via Gemini.", inputs: ["Web3 protocols enable ownership..."] },
  { id: 4, name: "AI Translate", priceUsd: "$0.003 USDC/call", description: "Translate English to 30 global languages.", inputs: ["Hello, the future is agentic.", "Spanish"] },
];

export default function Home() {
  const { isMiniPay } = useWallet();
  const [selectedProduct, setSelectedProduct] = useState<{id: number, name: string} | null>(null);
  
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 max-w-7xl mx-auto w-full text-center">
        {isMiniPay && (
          <div className="inline-flex items-center space-x-2 bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow px-4 py-2 rounded-full mb-8 text-sm font-medium animate-pulse">
            <span>📱</span>
            <span>Running in MiniPay — wallet auto-connected</span>
          </div>
        )}
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Pay Per <span className="text-brand-yellow">API Call</span>
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed">
          AI APIs powered by Celo stablecoins. No subscriptions. No credit cards. Just pay what you use.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          <button className="btn-primary text-lg px-8 py-4 w-full sm:w-auto" onClick={() => document.getElementById("apis")?.scrollIntoView({behavior: "smooth"})}>
            Try API Playground
          </button>
          <a href="/docs" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto text-center border-brand-green/50">
            View Docs
          </a>
        </div>
        
        {/* Animated stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto border-y border-brand-border py-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white mb-1">920K+</span>
            <span className="text-sm text-text-secondary uppercase tracking-wider">Total Calls</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-brand-green mb-1">$1.4K+</span>
            <span className="text-sm text-text-secondary uppercase tracking-wider">Revenue</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white mb-1">12K+</span>
            <span className="text-sm text-text-secondary uppercase tracking-wider">Active Users</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-brand-yellow mb-1">7</span>
            <span className="text-sm text-text-secondary uppercase tracking-wider">Supported Tokens</span>
          </div>
        </div>
      </section>

      {/* Stablecoin Ticker */}
      <section className="w-full bg-brand-elevated border-y border-brand-border py-4 overflow-hidden flex whitespace-nowrap">
        <div className="animate-[ticker_30s_linear_infinite] flex items-center space-x-12 px-6">
          {Object.entries(CELO_STABLECOINS).map(([key, token], i) => (
            <div key={`${key}-1`} className="flex items-center space-x-2">
              <span className="text-xl">{token.flag}</span>
              <span className={i % 2 === 0 ? "text-brand-yellow font-bold" : "text-brand-green font-bold"}>{token.symbol}</span>
              <span className="text-text-secondary">@ {token.pricePerCall}/call</span>
            </div>
          ))}
        </div>
        <div className="animate-[ticker_30s_linear_infinite] flex items-center space-x-12 px-6">
          {Object.entries(CELO_STABLECOINS).map(([key, token], i) => (
            <div key={`${key}-2`} className="flex items-center space-x-2">
              <span className="text-xl">{token.flag}</span>
              <span className={i % 2 === 0 ? "text-brand-yellow font-bold" : "text-brand-green font-bold"}>{token.symbol}</span>
              <span className="text-text-secondary">@ {token.pricePerCall}/call</span>
            </div>
          ))}
        </div>
      </section>

      {/* API Products Grid */}
      <section id="apis" className="py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="mb-10">
          <h2 className="text-3xl font-black mb-2 text-white font-sans tracking-tight">API Marketplace</h2>
          <p className="text-blue-300 text-sm">Sub-cent micropayments enabled by x402 on Celo.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {API_PRODUCTS.map((api) => (
            <APICard 
              key={api.id}
              {...api}
              onTryIt={(id, name) => setSelectedProduct({id, name})}
            />
          ))}
        </div>
      </section>
      
      {/* Payment Flow Section */}
      <section className="py-24 px-4 bg-brand-elevated border-y border-brand-border w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">How It Works</h2>
            <p className="text-text-secondary">Zero-friction API access powered by blockchain</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Choose API", desc: "Select the endpoint you need from our collection" },
              { step: "2", title: "Select Token", desc: "Pay with any of the 7 supported Celo stablecoins" },
              { step: "3", title: "Pay on Celo", desc: "Sign a sub-cent transaction that finalizes in seconds" },
              { step: "4", title: "Get Response", desc: "The smart contract unlocks access and returns data" },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-brand-yellow/10 text-brand-yellow border-2 border-brand-yellow flex items-center justify-center text-2xl font-bold mb-6">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Developer Friendly</h2>
            <p className="text-text-secondary text-lg mb-8">
              Integrate in minutes. Just pass your wallet address and the transaction hash in the headers. Our gateway verifies the payment onchain and routes the request.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-white">
                <span className="text-brand-green">✓</span>
                <span>No API keys to leak</span>
              </li>
              <li className="flex items-center space-x-3 text-white">
                <span className="text-brand-green">✓</span>
                <span>Pay only for successful requests</span>
              </li>
              <li className="flex items-center space-x-3 text-white">
                <span className="text-brand-green">✓</span>
                <span>Works in browser and server</span>
              </li>
            </ul>
          </div>
          
          <div className="code-block text-sm relative">
            <div className="absolute top-4 right-4 text-xs text-text-muted">JavaScript</div>
            <pre>
              <code className="text-brand-green">
{`// Pay for API with cUSD
const response = await fetch("https://pay-for-api.vercel.app/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Payment-Token": "cUSD",
    "X-Wallet-Address": userAddress,
  },
  body: JSON.stringify({ 
    message: "Hello AI!",
    txHash: "0x..." // Payment transaction hash
  }),
});

const data = await response.json();
console.log(data.response);`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      <PaymentModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        productId={selectedProduct?.id ?? 0}
        productName={selectedProduct?.name ?? ""}
        onSuccess={(txHash, token) => {
          alert(`Payment successful! Tx: ${txHash}. Now you can call the API.`);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
