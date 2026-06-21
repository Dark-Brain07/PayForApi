"use client";
import { useState, useRef, useEffect } from "react";
import { useWallet } from "@/components/wallet/WalletContext";
import { EthereumProvider } from "@/hooks/useAuth";
import { ethers } from "ethers";
import { processPayment } from "@/lib/payment";
import { CELO_STABLECOINS, StablecoinKey } from "@/lib/stablecoins";
import { CONTRACTS } from "@/lib/contracts";

/** Represents a generated image or message in the UI */
interface ImageItem {
  id: string;
  prompt: string;
  imageUrl?: string;
  txHash?: string;
  error?: string;
}

function LoadingMasterpiece() {
  return (
    <div aria-live="polite" aria-busy="true" className="flex flex-col items-center justify-center gap-6 w-full py-12">
      <div className="relative flex items-center justify-center w-28 h-28">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-green-300 to-yellow-400 animate-spin blur-xl opacity-60"></div>
        <div className="absolute inset-1 rounded-full bg-[#0F141C] flex items-center justify-center z-10 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" className="animate-pulse">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#gemini-gradient)"/>
            <defs>
              <linearGradient id="gemini-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4ADE80" />
                <stop offset="1" stopColor="#FACC15" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-4 z-10 mt-2">
        <div className="flex gap-2.5">
           <span className="w-3 h-3 rounded-full bg-green-400 animate-bounce shadow-[0_0_10px_rgba(74,222,128,0.8)]" style={{animationDelay: "0ms"}}></span>
           <span className="w-3 h-3 rounded-full bg-yellow-400 animate-bounce shadow-[0_0_10px_rgba(250,204,21,0.8)]" style={{animationDelay: "150ms"}}></span>
           <span className="w-3 h-3 rounded-full bg-green-500 animate-bounce shadow-[0_0_10px_rgba(34,197,94,0.8)]" style={{animationDelay: "300ms"}}></span>
        </div>
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400 font-black text-sm tracking-[0.3em] uppercase animate-pulse">
          Creating Masterpiece
        </p>
      </div>
    </div>
  );
}

function ImageWithLoader({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Loading State - Shows until the image fully downloads */}
      {!isLoaded && <LoadingMasterpiece />}
      
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setIsLoaded(true)}
        className={`max-w-full max-h-[400px] object-contain rounded-xl hover:scale-[1.02] transition-transform cursor-pointer shadow-2xl ring-1 ring-white/10 ${isLoaded ? 'block' : 'hidden'}`}
      />
    </>
  );
}

/**
 * Interactive Image Generation interface to test AI agents using x402 micropayments.
 */
export default function ImagePage() {
  const { address } = useWallet();
  const [items, setItems] = useState<ImageItem[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const itemsEndRef = useRef<HTMLDivElement>(null);
  const [paymentToken, setPaymentToken] = useState<StablecoinKey | "APIC">("cUSD");

  // Auto-scroll to bottom
  useEffect(() => {
    itemsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items, isGenerating]);

  const handleGenerateClick = async () => {
    if (!input.trim()) return;
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }
    
    const prompt = input.trim();
    setInput(""); 
    setIsGenerating(true);

    try {
      const FALLBACK_TX_HASH = "0x0000000000000000000000000000000000000000";
      let txHash = FALLBACK_TX_HASH; 
      
      // Execute background transaction without modal popup
      if (typeof window !== "undefined" && (window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum) {
        const provider = new ethers.BrowserProvider((window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum as unknown as ethers.Eip1193Provider);
        const requestId = ethers.id(Date.now().toString() + Math.random().toString());
        
        let tokenAddress, amountToPay;
        if (paymentToken === "APIC") {
          tokenAddress = CONTRACTS.API_CREDITS.address;
          amountToPay = "50"; // 50 APIC for image gen
        } else {
          const token = CELO_STABLECOINS[paymentToken as StablecoinKey];
          tokenAddress = token.address;
          amountToPay = "0.01"; // Image gen might be slightly more expensive
        }

        const receipt = await processPayment(
          provider,
          tokenAddress,
          amountToPay,
          6, // productId for Image Gen
          requestId
        );
        txHash = receipt.hash;
      }

      // Add loading item
      const newItemId = Date.now().toString();
      setItems(prev => [...prev, { id: newItemId, prompt, txHash }]);

      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt, 
          walletAddress: address, 
          txHash
        })
      });
      
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      
      // Update item with image url
      setItems(prev => prev.map(item => 
        item.id === newItemId 
          ? { ...item, imageUrl: data.imageUrl } 
          : item
      ));

    } catch (e: unknown) {
      console.error(e);
      const errObj = e as Record<string, any>;
      let errorMessage = errObj?.reason || errObj?.message || "Payment failed or cancelled.";
      if (errorMessage.includes("transfer amount exceeds balance")) {
        errorMessage = "Transaction failed: Insufficient balance.";
      }
      setItems(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        prompt, 
        error: `Error: ${errorMessage}` 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="fixed inset-0 top-[76px] bottom-0 flex flex-col items-center justify-center p-4 overflow-hidden z-30">
      <title>AI Image Gen | PayForAPI</title>
      <meta name="description" content="Test your Celo Web3 micropayments via an interactive AI Image Generator." />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      {/* Sidebar Widgets (Right Side) */}
      <div className="hidden xl:flex absolute right-12 top-[20%] flex-col gap-6 z-10 w-64">
        
        {/* Payment Selector Widget */}
        <div className="flex flex-col p-5 bg-[#0A0D12] border border-[#1E293B] rounded-2xl shadow-2xl">
          <div className="text-[#94A3B8] text-xs font-bold uppercase tracking-[0.2em] mb-3 text-center">Payment Token</div>
          <select 
            aria-label="Payment Token"
            value={paymentToken} 
            disabled={isGenerating}
            onChange={(e) => setPaymentToken(e.target.value as "cUSD" | "APIC")}
            className="w-full bg-[#0F141C] border border-[#1E293B] text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-yellow appearance-none cursor-pointer text-center font-bold"
            style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"12\" height=\"8\" viewBox=\"0 0 12 8\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1 1.5L6 6.5L11 1.5\" stroke=\"%2394A3B8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "12px" }}
          >
            <option value="cUSD">cUSD ($0.01)</option>
            <option value="cEUR">cEUR (€0.01)</option>
            <option value="APIC">APIC (50 Credits)</option>
          </select>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col w-full max-w-6xl h-[85vh] min-h-[600px] max-h-[1000px] bg-[#0A0D12] border border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden z-10">
        
      {/* Header Area */}
      <div className="border-b border-brand-border bg-[#0F141C] p-5 shrink-0 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          Image Generator
        </h1>
        <div className="text-sm text-text-secondary bg-brand-elevated px-3 py-1 rounded-full border border-brand-border">
          Cost: {paymentToken === "APIC" ? "50 APIC" : "$0.01"} / image
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#050505]">
        <div className="w-full space-y-6 pb-4">
          
          {items.length === 0 && !isGenerating && (
             <div className="flex flex-col items-center justify-center h-full text-center opacity-50 pt-20">
                 <div className="text-6xl mb-4">🖼️</div>
                 <p className="text-xl font-bold text-white">No images generated yet</p>
                 <p className="text-sm text-[#94A3B8] mt-2">Enter a prompt below to create a new image using Flux AI on Celo.</p>
             </div>
          )}

          {items.map((item) => (
          <div key={item.id} className="flex justify-center">
            <div className="max-w-[95%] sm:max-w-[80%] w-full flex flex-col items-center">
              <div className="w-full text-sm font-bold mb-3 text-[#94A3B8] flex justify-between items-center px-2">
                <span className="text-white italic">"{item.prompt}"</span>
                <div className="flex gap-3">
                  {item.txHash && (
                    <a href={`https://celoscan.io/tx/${item.txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-yellow hover:underline flex items-center gap-1">
                      Tx <span className="hidden sm:inline">Paid</span> ↗
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center items-center w-full min-h-[200px] rounded-xl relative">
                {item.error ? (
                   <div className="text-red-500 font-bold p-4 text-center bg-red-500/10 rounded-xl w-full border border-red-500/20">{item.error}</div>
                ) : item.imageUrl ? (
                   <ImageWithLoader src={item.imageUrl} alt={item.prompt} />
                ) : (
                   <LoadingMasterpiece />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isGenerating && items.length > 0 && !items[items.length-1]?.imageUrl && !items[items.length-1]?.error && (
            <div ref={itemsEndRef} className="h-4" />
        )}
        <div ref={itemsEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-5 bg-[#0F141C] border-t border-brand-border shrink-0">
        <div className="w-full flex gap-3 relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerateClick();
              }
            }}
            disabled={isGenerating}
            placeholder="A futuristic city on Mars..."
            className="flex-grow min-w-0 bg-[#0B0E14] border border-[#1E293B] shadow-inner rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-brand-yellow transition-colors disabled:opacity-50 text-base"
          />
          <button 
            onClick={handleGenerateClick}
            disabled={!input.trim() || isGenerating}
            aria-label="Generate AI Image"
            className="bg-gradient-to-b from-[#FDE047] to-[#F5C518] hover:brightness-110 text-black font-bold px-5 py-3 sm:px-8 sm:py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-[0_0_15px_rgba(245,197,24,0.3)] flex items-center gap-2 shrink-0"
          >
            <span>Generate</span>
            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>

      </div>
    </main>
  );
}
