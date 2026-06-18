"use client";
import { useState, useEffect } from "react";
import APICard from "@/components/api/APICard";

export interface CommunityApi {
  id: number;
  name: string;
  endpoint: string;
  priceUsd: string;
  priceCredits: number;
  description: string;
  inputs: string[];
}

export interface ApiRequestPayload {
  txHash: string;
  walletAddress: string;
  [key: string]: unknown;
}

export interface SelectedProduct {
  id: number;
  name: string;
  values: string[];
  priceCredits?: number;
}

const generateNumericId = (str: string): number => Math.abs(str.split('').reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0)) + 1000;
const escapeHTML = (str: string) => str ? str.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";

import PaymentModal from "@/components/payment/PaymentModal";
import APIResultDisplay from "@/components/api/APIResultDisplay";
import { useWallet } from "@/components/wallet/WalletContext";
import { ethers } from "ethers";
import { CONTRACTS, CELO_MAINNET } from "@/lib/contracts";
import { API_PRODUCTS } from "@/lib/data";
import { BLOCKS_TO_QUERY, CACHE_KEYS } from "@/lib/constants";

export default function Marketplace() {
  const { address } = useWallet();
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [lastApiId, setLastApiId] = useState<number | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [communityApis, setCommunityApis] = useState<CommunityApi[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  // Fetch Community APIs from the blockchain
  useEffect(() => {
    async function fetchCommunityApis() {
      try {
        const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
        const contract = new ethers.Contract(CONTRACTS.API_REVENUE_SPLITTER.address, CONTRACTS.API_REVENUE_SPLITTER.abi, provider);
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(0, currentBlock - BLOCKS_TO_QUERY);
        const filter = contract.filters.ApiRegistered();
        const events = await contract.queryFilter(filter, fromBlock, "latest");
        
        const deletedCacheKey = CACHE_KEYS.DELETED_ENDPOINTS;
        let deletedIds: string[] = [];
        try {
          if (typeof window !== "undefined") {
            let globalIds: string[] = [];
            try { globalIds = JSON.parse(localStorage.getItem(deletedCacheKey) || "[]"); } catch (e) { try { localStorage.removeItem(deletedCacheKey); } catch (err) { console.error(err); } }
            // Check legacy local cache if user is connected
            let localIds: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith("deleted_endpoints_0x")) {
                try {
                  localIds = [...localIds, ...JSON.parse(localStorage.getItem(key) || "[]")];
                } catch (e) {
                  localStorage.removeItem(key);
                }
              }
            }
            deletedIds = [...new Set([...globalIds, ...localIds])];
          }
        } catch (e) {}

        const uniqueApis = new Map<string, CommunityApi>();
        interface ContractEvent { args?: string[] }
        for (const event of events) {
          const eventObj = event as ContractEvent;
          const endpointId = eventObj.args?.[0];
          const creator = eventObj.args?.[1];
          if (endpointId && creator && !deletedIds.includes(endpointId)) {
             uniqueApis.set(endpointId, { 
               id: generateNumericId(endpointId), 
               name: `Community API: ${escapeHTML(endpointId).substring(0, 30)}...`, 
               endpoint: escapeHTML(endpointId), 
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
      } finally {
        setIsLoadingCommunity(false);
      }
    }
    fetchCommunityApis();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen pt-16 bg-black">
      <title>API Marketplace | PayForAPI</title>
      <meta name="description" content="Discover and integrate decentralized Web3 APIs with x402 micropayments on Celo." />
      {/* API Products Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="mb-16 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-yellow/10 rounded-[100%] blur-[120px] -z-10 pointer-events-none"></div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white font-sans tracking-tight">API <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-200">Marketplace</span></h1>
          <p className="text-[#94A3B8] text-lg md:text-xl max-w-2xl mx-auto font-medium">Sub-cent micropayments seamlessly enabled by x402 on Celo. No subscriptions, just pure utility.</p>
        </div>
        
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight border-b border-[#1E293B] pb-4">Core Platform APIs</h2>
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {!isMounted ? Array.from({ length: 4 }).map((_, i) => (
            <div key={`core-skel-${i}`} className="break-inside-avoid bg-[#0F172A] border border-[#1E293B] rounded-[24px] h-[320px] animate-pulse"></div>
          )) : API_PRODUCTS.map((api) => (
            <div key={api.id} className="break-inside-avoid relative">
              {isCalling && lastApiId === api.id && (
                <div aria-hidden="true" className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 rounded-2xl flex flex-col items-center justify-center">
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

        <div className="mt-16">
          <h2 className="text-2xl font-black text-white mb-6 tracking-tight border-b border-[#1E293B] pb-4 flex items-center gap-3">
            <span className="bg-[#1E293B] text-brand-yellow px-3 py-1 rounded-full text-xs uppercase tracking-widest font-black">New</span>
            Community Creator APIs
          </h2>
          {isLoadingCommunity ? (
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`skel-${i}`} role="status" aria-label="Loading API" className="break-inside-avoid bg-[#0F172A] border border-[#1E293B] rounded-2xl h-48 animate-pulse"></div>
              ))}
            </div>
          ) : communityApis.length > 0 ? (
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {communityApis.map((api) => (
                <div key={api.id} className="break-inside-avoid relative">
                  {isCalling && lastApiId === api.id && (
                    <div aria-hidden="true" className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 rounded-2xl flex flex-col items-center justify-center">
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
          ) : (
            <div className="w-full relative overflow-hidden text-center py-20 px-6 border border-[#1E293B] bg-gradient-to-b from-[#0F172A] to-[#0B0E14] rounded-2xl flex flex-col items-center justify-center group transition-all duration-300 hover:border-[#334155] shadow-lg">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-yellow/5 rounded-full blur-3xl group-hover:bg-brand-yellow/10 transition-colors duration-500"></div>
              
              <div className="relative z-10 w-20 h-20 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300">
                <span className="block text-4xl">🌱</span>
              </div>
              
              <h3 className="relative z-10 font-bold text-white text-2xl mb-3 tracking-tight">No community APIs found</h3>
              <p className="relative z-10 text-[#94A3B8] text-lg max-w-lg mx-auto mb-8 leading-relaxed">
                No community APIs are available yet. Be the first visionary to register your endpoint on the Creator Dashboard and start monetizing.
              </p>
              
              <a href="/dashboard" target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-yellow/10 hover:bg-brand-yellow/20 border border-brand-yellow/20 rounded-xl text-brand-yellow font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]">
                Launch Creator Dashboard
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </a>
            </div>
          )}
        </div>
        
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
        productName={(selectedProduct?.name && selectedProduct.name.length > 40) ? `${selectedProduct.name.slice(0, 37)}...` : selectedProduct?.name ?? ""}
        priceCredits={selectedProduct?.priceCredits ?? 0}
        onSuccess={async (txHash, token) => {
          if (isCalling) return;
          const product = selectedProduct;
          setLastApiId(product!.id);
          setSelectedProduct(null);
          setIsCalling(true);
          try {
            const { id, values } = product!;
            let apiRequestBody: ApiRequestPayload = { txHash, walletAddress: address || "0x0000000000000000000000000000000000000000" };
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
                const text = await res.text().catch(() => "");
                throw new Error(`HTTP error ${res.status}: ${text || res.statusText}`);
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
          <div role="dialog" aria-modal="true" aria-labelledby="result-modal-title" className="bg-[#0B0E14] border border-[#1E293B] rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 id="result-modal-title" className="text-xl font-bold text-white">
                {isCalling ? "Verifying Payment..." : "API Response"}
              </h3>
              {!isCalling && (
                <button aria-label="Close modal" title="Close" onClick={() => setApiResult(null)} className="text-gray-500 hover:text-white transition-colors">
                  ✕
                </button>
              )}
            </div>
            
            {isCalling ? (
              <div aria-busy="true" aria-live="polite" className="flex flex-col items-center justify-center py-12 shrink-0">
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
                        return { error: "Failed to parse API response. The endpoint returned invalid JSON." };
                      }
                    })()
                  } 
                />
              </div>
            )}
            
            {!isCalling && (
              <button aria-label="Close API Result" onClick={() => { setApiResult(null); setLastApiId(null); }} className="w-full bg-[#1E293B] hover:bg-[#334155] text-white font-bold py-3 rounded-xl transition-colors border border-white/5 shrink-0 mt-2">
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
