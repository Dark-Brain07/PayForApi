"use client";
import { useState } from "react";
import APICard from "@/components/api/APICard";
import PaymentModal from "@/components/payment/PaymentModal";
import APIResultDisplay from "@/components/api/APIResultDisplay";
import { useWallet } from "@/components/wallet/WalletContext";
import { ethers } from "ethers";
import { CONTRACTS, CELO_MAINNET } from "@/lib/contracts";

const API_PRODUCTS = [
  { id: 0, name: "Weather Info", priceUsd: "$0.001 cUSD/call", priceCredits: 10, description: "Real-time global weather parameters.", inputs: ["Dhaka"] },
  { id: 1, name: "Global News", priceUsd: "$0.002 cUSD/call", priceCredits: 15, description: "Latest headlines by category.", inputs: ["technology"] },
  { id: 2, name: "Crypto Pulse", priceUsd: "$0.001 cUSD/call", priceCredits: 10, description: "Live multi-currency asset prices.", inputs: ["bitcoin,ethereum,usd-coin"] },
  { id: 3, name: "AI Summary", priceUsd: "$0.005 cUSD/call", priceCredits: 25, description: "Summarize extensive text via Gemini.", inputs: ["Web3 protocols enable ownership..."] },
  { id: 4, name: "AI Translate", priceUsd: "$0.003 cUSD/call", priceCredits: 25, description: "Translate English to 30 global languages.", inputs: ["Hello, the future is agentic.", "Spanish"] },
];

export default function Marketplace() {
  const { address } = useWallet();
  const [selectedProduct, setSelectedProduct] = useState<{id: number, name: string, values: string[], priceCredits?: number} | null>(null);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [lastApiId, setLastApiId] = useState<number | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [communityApis, setCommunityApis] = useState<any[]>([]);

  // Fetch Community APIs from the blockchain
  useState(() => {
    async function fetchCommunityApis() {
      try {
        const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
        const contract = new ethers.Contract(CONTRACTS.API_REVENUE_SPLITTER.address, CONTRACTS.API_REVENUE_SPLITTER.abi, provider);
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(0, currentBlock - 2000000);
        const filter = contract.filters.ApiRegistered();
        const events = await contract.queryFilter(filter, fromBlock, "latest");
        
        const uniqueApis = new Map();
        interface ContractEvent { args?: string[] }
        for (const event of events) {
          const eventObj = event as ContractEvent;
          const endpointId = eventObj.args?.[0];
          const creator = eventObj.args?.[1];
          if (endpointId && creator) {
             uniqueApis.set(endpointId, { 
               id: uniqueApis.size + 100, 
               name: `Community API: ${endpointId.substring(0, 15)}...`, 
               endpoint: endpointId, 
               priceUsd: "$0.005 cUSD/call", 
               priceCredits: 50, 
               description: `Custom endpoint provided by ${creator.substring(0, 8)}...`, 
               inputs: ["param1"] 
             });
          }
        }
        setCommunityApis(Array.from(uniqueApis.values()));
      } catch (err) {
        console.error("Failed to load community APIs", err);
      }
    }
    fetchCommunityApis();
  });

  // const ALL_PRODUCTS = [...API_PRODUCTS, ...communityApis]; // Not needed anymore

  return (
    <div className="flex flex-col w-full min-h-screen pt-16 bg-black">
      {/* API Products Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="mb-16 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-yellow/10 rounded-[100%] blur-[120px] -z-10 pointer-events-none"></div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white font-sans tracking-tight">API <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-200">Marketplace</span></h1>
          <p className="text-[#94A3B8] text-lg md:text-xl max-w-2xl mx-auto font-medium">Sub-cent micropayments seamlessly enabled by x402 on Celo. No subscriptions, just pure utility.</p>
        </div>
        
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight border-b border-[#1E293B] pb-4">Core Platform APIs</h2>
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {API_PRODUCTS.map((api) => (
            <div key={api.id} className="break-inside-avoid relative">
              {isCalling && lastApiId === api.id && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 rounded-2xl flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mb-3"></div>
                  <span className="text-brand-yellow font-bold text-sm animate-pulse">Processing...</span>
                </div>
              )}
              <APICard 
                {...api}
                onTryIt={(id, name, values, priceCredits) => setSelectedProduct({id, name, values, priceCredits})}
              />
            </div>
          ))}
        </div>

        {communityApis.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-white mb-6 tracking-tight border-b border-[#1E293B] pb-4 flex items-center gap-3">
              <span className="bg-[#1E293B] text-brand-yellow px-3 py-1 rounded-full text-xs uppercase tracking-widest font-black">New</span>
              Community Creator APIs
            </h2>
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {communityApis.map((api) => (
                <div key={api.id} className="break-inside-avoid relative">
                  {isCalling && lastApiId === api.id && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 rounded-2xl flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-[#00E676] border-t-transparent rounded-full animate-spin mb-3"></div>
                      <span className="text-[#00E676] font-bold text-sm animate-pulse">Processing...</span>
                    </div>
                  )}
                  <APICard 
                    {...api}
                    onTryIt={(id, name, values, priceCredits) => setSelectedProduct({id, name, values, priceCredits})}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-20 text-center border-t border-[#1E293B] pt-12 relative max-w-4xl mx-auto">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0B0E14] px-6 py-2 rounded-full border border-[#1E293B] shadow-lg flex items-center gap-3">
             <span className="text-[#94A3B8] text-xs font-bold uppercase tracking-[0.2em]">Ecosystem Expansion</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">More Web3 & AI APIs Are Coming Soon</h2>
          <p className="text-[#94A3B8] text-lg leading-relaxed max-w-2xl mx-auto">
            We are actively collaborating with decentralized node operators to bring highly scalable new endpoints to the Pay For API network. Prepare for advanced LLM agents, deep blockchain indexers, and real-time oracle feeds.
          </p>
        </div>
      </section>

      <PaymentModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        productId={selectedProduct?.id ?? 0}
        productName={selectedProduct?.name ?? ""}
        priceCredits={selectedProduct?.priceCredits}
        onSuccess={async (txHash, token) => {
          const product = selectedProduct;
          setLastApiId(product!.id);
          setSelectedProduct(null);
          setIsCalling(true);
          try {
            const { id, values } = product!;
            let apiRequestBody: Record<string, unknown> = { txHash, walletAddress: address || "0x0000000000000000000000000000000000000000" };
            let endpoint = "";
            
            if (id === 0) {
              endpoint = "/api/weather";
              apiRequestBody.city = values[0] || "Dhaka";
            } else if (id === 1) {
              endpoint = "/api/news";
              apiRequestBody.category = values[0] || "technology";
            } else if (id === 2) {
              endpoint = "/api/crypto";
              apiRequestBody.ids = values[0] || "bitcoin,ethereum,usd-coin";
            } else if (id === 3) {
              endpoint = "/api/summary";
              apiRequestBody.text = values[0] || "Web3 protocols enable ownership...";
            } else if (id === 4) {
              endpoint = "/api/translate";
              apiRequestBody.text = values[0] || "Hello, the future is agentic.";
              apiRequestBody.language = values[1] || "Spanish";
            } else if (id >= 100) {
              endpoint = "/api/proxy";
              apiRequestBody.endpoint = communityApis.find(a => a.id === id)?.endpoint;
            }
            
            const res = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(apiRequestBody)
            });
            let data;
            try {
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              data = await res.json();
            } catch (err: unknown) {
              data = { error: err instanceof Error ? err.message : "Failed to parse API response" };
            }
            setApiResult(JSON.stringify(data, null, 2));
          } catch (e: unknown) {
            setApiResult("Error: " + (e instanceof Error ? e.message : String(e)));
          } finally {
            setIsCalling(false);
          }
        }}
      />

      {/* Result Modal */}
      {(isCalling || apiResult) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-[#0B0E14] border border-[#1E293B] rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
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
              <div className="flex flex-col items-center justify-center py-12 shrink-0">
                <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-brand-yellow animate-pulse font-bold">Executing API via Smart Contract...</div>
              </div>
            ) : (
              <div className="mb-6 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
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
                className="w-full bg-[#1E293B] hover:bg-[#334155] text-white font-bold py-3 rounded-xl transition-colors border border-white/5 shrink-0 mt-2"
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
