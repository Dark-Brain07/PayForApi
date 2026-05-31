"use client";
import { useState } from "react";
import APICard from "@/components/api/APICard";
import PaymentModal from "@/components/payment/PaymentModal";
import APIResultDisplay from "@/components/api/APIResultDisplay";
import { useWallet } from "@/components/wallet/WalletContext";

const API_PRODUCTS = [
  { id: 0, name: "Weather Info", priceUsd: "$0.001 USDC/call", description: "Real-time global weather parameters.", inputs: ["Dhaka"] },
  { id: 1, name: "Global News", priceUsd: "$0.002 USDC/call", description: "Latest headlines by category.", inputs: ["technology"] },
  { id: 2, name: "Crypto Pulse", priceUsd: "$0.001 USDC/call", description: "Live multi-currency asset prices.", inputs: ["bitcoin,ethereum,usd-coin"] },
  { id: 3, name: "AI Summary", priceUsd: "$0.005 USDC/call", description: "Summarize extensive text via Gemini.", inputs: ["Web3 protocols enable ownership..."] },
  { id: 4, name: "AI Translate", priceUsd: "$0.003 USDC/call", description: "Translate English to 30 global languages.", inputs: ["Hello, the future is agentic.", "Spanish"] },
];

export default function Marketplace() {
  const { address } = useWallet();
  const [selectedProduct, setSelectedProduct] = useState<{id: number, name: string, values: string[]} | null>(null);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [lastApiId, setLastApiId] = useState<number | null>(null);
  const [isCalling, setIsCalling] = useState(false);

  return (
    <div className="flex flex-col w-full min-h-screen pt-16">
      {/* API Products Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black mb-4 text-white font-sans tracking-tight">API Marketplace</h1>
          <p className="text-text-secondary text-lg">Sub-cent micropayments enabled by x402 on Celo.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {API_PRODUCTS.map((api) => (
            <APICard 
              key={api.id}
              {...api}
              onTryIt={(id, name, values) => setSelectedProduct({id, name, values})}
            />
          ))}
        </div>
      </section>

      <PaymentModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        productId={selectedProduct?.id ?? 0}
        productName={selectedProduct?.name ?? ""}
        onSuccess={async (txHash, token) => {
          const product = selectedProduct;
          setLastApiId(product!.id);
          setSelectedProduct(null);
          setIsCalling(true);
          try {
            const { id, values } = product!;
            let payload: any = { txHash, walletAddress: address || "0x0000000000000000000000000000000000000000" };
            let endpoint = "";
            
            if (id === 0) {
              endpoint = "/api/weather";
              payload.city = values[0] || "Dhaka";
            } else if (id === 1) {
              endpoint = "/api/news";
              payload.category = values[0] || "technology";
            } else if (id === 2) {
              endpoint = "/api/crypto";
              payload.ids = values[0] || "bitcoin,ethereum,usd-coin";
            } else if (id === 3) {
              endpoint = "/api/summary";
              payload.text = values[0] || "Web3 protocols enable ownership...";
            } else if (id === 4) {
              endpoint = "/api/translate";
              payload.text = values[0] || "Hello, the future is agentic.";
              payload.language = values[1] || "Spanish";
            }
            
            const res = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            setApiResult(JSON.stringify(data, null, 2));
          } catch (e: any) {
            setApiResult("Error: " + e.message);
          } finally {
            setIsCalling(false);
          }
        }}
      />

      {/* Result Modal */}
      {(isCalling || apiResult) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-[#0B0E14] border border-[#1E293B] rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {isCalling ? "Verifying Payment..." : "API Response"}
              </h3>
              {!isCalling && (
                <button onClick={() => setApiResult(null)} className="text-gray-500 hover:text-white transition-colors">
                  ✕
                </button>
              )}
            </div>
            
            {isCalling ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-brand-yellow animate-pulse font-bold">Executing API via Smart Contract...</div>
              </div>
            ) : (
              <div className="mb-6">
                <APIResultDisplay 
                  apiId={lastApiId!} 
                  data={
                    (() => {
                      try {
                        return JSON.parse(apiResult || "{}");
                      } catch {
                        return { error: apiResult };
                      }
                    })()
                  } 
                />
              </div>
            )}
            
            {!isCalling && (
              <button 
                onClick={() => setApiResult(null)}
                className="w-full bg-[#1E293B] hover:bg-[#334155] text-white font-bold py-3 rounded-xl transition-colors border border-white/5"
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
