"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(src);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `payforapi-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download image", error);
      // Fallback to opening in new tab
      window.open(src, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative group inline-block">
      {/* Loading State - Shows until the image fully downloads */}
      {!isLoaded && <LoadingMasterpiece />}
      
      <img 
        src={src} 
        alt={alt} 
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`max-w-full max-h-[400px] object-contain rounded-xl shadow-2xl ring-1 ring-white/10 transition-transform ${isLoaded ? 'block' : 'hidden'}`}
      />
      
      {isLoaded && (
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          title="Download Image"
          className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white p-2.5 rounded-xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10"
        >
          {isDownloading ? (
             <svg className="w-5 h-5 animate-spin text-brand-yellow" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
             <svg className="w-5 h-5 group-hover:text-brand-yellow transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
             </svg>
          )}
        </button>
      )}
    </div>
  );
}

/**
 * Interactive Image Generation interface to test AI agents using x402 micropayments.
 */
export default function ImagePage() {
  const { address, isMiniPay } = useWallet();
  const [items, setItems] = useState<ImageItem[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const itemsEndRef = useRef<HTMLDivElement>(null);
  const [paymentToken, setPaymentToken] = useState<StablecoinKey | "APIC">("USDm");

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
          requestId,
          isMiniPay
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
        if (isMiniPay) {
          window.location.href = "https://link.minipay.xyz/add_cash?tokens=USDm";
          return;
        }
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
    <main className="fixed inset-0 top-[104px] bottom-0 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 overflow-hidden z-30">
      <title>AI Image Gen | PayForAPI</title>
      <meta name="description" content="Test your Celo Web3 micropayments via an interactive AI Image Generator." />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      {/* Sidebar Widgets (Right Side) */}
      <div className="hidden xl:flex absolute right-12 top-[20%] flex-col gap-6 z-10 w-64">
        
        {/* Payment Selector Widget */}
        <div className="flex flex-col p-5 bg-[#0A0D12] border border-[#1E293B] rounded-2xl shadow-2xl">
          <div className="text-[#94A3B8] text-xs font-bold uppercase tracking-[0.2em] mb-3 text-center">Payment Token</div>
          <div className="relative group w-full">
            <div className="absolute inset-0 bg-brand-yellow/5 rounded-xl blur-sm group-hover:bg-brand-yellow/20 transition-all duration-300 pointer-events-none"></div>
            <select 
              aria-label="Payment Token"
              value={paymentToken} 
              disabled={isGenerating}
              onChange={(e) => setPaymentToken(e.target.value as "USDm" | "APIC")}
              className="relative w-full bg-[#0F141C]/90 backdrop-blur-md border border-[#1E293B] hover:border-brand-yellow/50 text-white text-sm font-bold rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow appearance-none cursor-pointer transition-all disabled:opacity-50"
            >
              <option value="USDm" className="bg-[#050505] text-white">USDm ($0.01)</option>
              <option value="EURm" className="bg-[#050505] text-white">EURm (€0.01)</option>
              <option value="APIC" className="bg-[#050505] text-white">APIC (50 Credits)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-yellow">
              <svg className="fill-current h-4 w-4 drop-shadow-[0_0_8px_rgba(245,197,24,0.5)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col w-full max-w-6xl h-full sm:h-[85vh] sm:min-h-[600px] sm:max-h-[1000px] bg-[#0A0D12] border border-[#1E293B] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10">
        
      {/* Header Area */}
      <div className="border-b border-brand-border bg-[#0F141C] p-3 sm:p-5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
        <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xl sm:text-2xl">🎨</span>
          Image Generator
        </h1>
        <div className="flex xl:hidden items-center w-full sm:w-auto mt-1 sm:mt-0 relative group z-20">
          <div className="absolute inset-0 bg-brand-yellow/5 rounded-xl blur-md group-hover:bg-brand-yellow/20 transition-all duration-300 pointer-events-none"></div>
          <select 
            value={paymentToken} 
            onChange={(e) => setPaymentToken(e.target.value as "USDm" | "APIC")}
            disabled={isGenerating}
            className="relative w-full sm:w-auto bg-[#0F141C]/80 backdrop-blur-xl border border-[#1E293B] hover:border-brand-yellow/50 text-white text-sm font-black tracking-wide rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow appearance-none cursor-pointer shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            <option value="USDm" className="bg-[#050505] text-white py-2">Cost: $0.01 USDm</option>
            <option value="EURm" className="bg-[#050505] text-white py-2">Cost: €0.01 EURm</option>
            <option value="APIC" className="bg-[#050505] text-white py-2">Cost: 50 APIC Credits</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-yellow">
            <svg className="fill-current h-4 w-4 drop-shadow-[0_0_8px_rgba(245,197,24,0.5)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        <div className="hidden xl:block text-sm text-text-secondary bg-brand-elevated px-3 py-1 rounded-full border border-brand-border">
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
        {isMiniPay && (
          <div className="flex justify-center space-x-6 mt-3 text-[10px] text-[#94A3B8]">
            <Link href="/terms" className="hover:text-brand-yellow">Terms</Link>
            <Link href="/privacy" className="hover:text-brand-yellow">Privacy</Link>
            <a href="https://t.me/payforapi_support" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow">Support</a>
          </div>
        )}
      </div>

      </div>
    </main>
  );
}
