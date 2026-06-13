"use client";
import { useState, useRef, useEffect } from "react";
import { useWallet } from "@/components/wallet/WalletContext";
import { EthereumProvider } from "@/hooks/useAuth";
import { ethers } from "ethers";
import { processPayment } from "@/lib/payment";
import { CELO_STABLECOINS, StablecoinKey } from "@/lib/stablecoins";
import { CONTRACTS } from "@/lib/contracts";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  txHash?: string;
}

export default function ChatPage() {
  const { address } = useWallet();
  const [messages, setMessages] = useState<Message[]>([
    { id: "intro", role: "ai", content: "Hello! I am your AI assistant powered by Celo micropayments. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [totalTokens, setTotalTokens] = useState(0);
  const [paymentToken, setPaymentToken] = useState<StablecoinKey | "APIC">("cUSD");

  // Load tokens from local storage on mount/address change
  useEffect(() => {
    if (address) {
      try {
        const stored = localStorage.getItem(`chat_tokens_${address}`);
        if (stored) setTotalTokens(parseInt(stored, 10));
      } catch (e) {}
    }
  }, [address]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendClick = async () => {
    if (!input.trim()) return;
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }
    
    const userMessage = input;
    setInput(""); // clear input immediately to feel responsive
    setIsTyping(true);

    try {
      let txHash = "0x0000000000000000000000000000000000000000"; // fallback if missing
      
      // Execute background transaction without modal popup
      if (typeof window !== "undefined" && (window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum) {
        const provider = new ethers.BrowserProvider((window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum as any);
        const requestId = ethers.id(Date.now().toString() + Math.random().toString());
        
        let tokenAddress, amountToPay;
        if (paymentToken === "APIC") {
          tokenAddress = CONTRACTS.API_CREDITS.address;
          amountToPay = "20"; // 20 APIC
        } else {
          const token = CELO_STABLECOINS[paymentToken as StablecoinKey];
          tokenAddress = token.address;
          amountToPay = token.pricePerCall; // e.g. "0.005"
        }

        const receipt = await processPayment(
          provider,
          tokenAddress,
          amountToPay,
          5, // productId for AI Chat
          requestId
        );
        txHash = receipt.hash;
      }

      // Add user message to UI with the confirmed txHash
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: userMessage, txHash }]);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage, 
          walletAddress: address, 
          txHash,
          localTime: new Date().toLocaleString()
        })
      });
      
      const data = await res.json();
      
      const newTokens = data.tokensUsed || 0;
      setTotalTokens(prev => {
        const updated = prev + newTokens;
        if (address) {
          try {
            localStorage.setItem(`chat_tokens_${address}`, updated.toString());
          } catch (e) {}
        }
        return updated;
      });

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "ai", 
        content: data.response || "Error: No response generated." 
      }]);
    } catch (e: unknown) {
      console.error(e);
      let errorMessage = e?.reason || e?.message || "Payment failed or cancelled.";
      if (errorMessage.includes("transfer amount exceeds balance")) {
        errorMessage = "Transaction failed: Insufficient cUSD balance.";
      }
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "ai", 
        content: `Error: ${errorMessage}` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };



  return (
    <div className="fixed inset-0 top-[76px] bottom-0 flex flex-col items-center justify-center p-4 overflow-hidden z-30">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      {/* Sidebar Widgets (Right Side) */}
      <div className="hidden xl:flex absolute right-12 top-[20%] flex-col gap-6 z-10 w-64">
        
        {/* Payment Selector Widget */}
        <div className="flex flex-col p-5 bg-[#0A0D12] border border-[#1E293B] rounded-2xl shadow-2xl">
          <div className="text-[#94A3B8] text-xs font-bold uppercase tracking-[0.2em] mb-3 text-center">Payment Token</div>
          <select 
            value={paymentToken} 
            onChange={(e) => setPaymentToken(e.target.value as "cUSD" | "APIC")}
            className="w-full bg-[#0F141C] border border-[#1E293B] text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-yellow appearance-none cursor-pointer text-center font-bold"
            style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"12\" height=\"8\" viewBox=\"0 0 12 8\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1 1.5L6 6.5L11 1.5\" stroke=\"%2394A3B8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "12px" }}
          >
            <option value="cUSD">cUSD ($0.005)</option>
            <option value="cEUR">cEUR (€0.005)</option>
            <option value="cREAL">cREAL (R$0.005)</option>
            <option value="APIC">APIC (20 Credits)</option>
          </select>
        </div>

        {/* Token Stats Widget */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#0A0D12] border border-[#1E293B] rounded-2xl shadow-2xl">
          <div className="text-[#94A3B8] text-xs font-bold uppercase tracking-[0.2em] mb-4 text-center">Wallet Tokens Used</div>
          <div className="text-4xl font-black text-brand-yellow mb-2 drop-shadow-[0_0_15px_rgba(245,197,24,0.4)]">
            {totalTokens.toLocaleString()}
          </div>
          <div className="text-text-secondary text-sm text-center">Total AI tokens consumed by your connected address</div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col w-full max-w-6xl h-[85vh] min-h-[600px] max-h-[1000px] bg-[#0A0D12] border border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden z-10">
        
      {/* Header Area */}
      <div className="border-b border-brand-border bg-[#0F141C] p-5 shrink-0 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
          Agentic Chat
        </h1>
        <div className="text-sm text-text-secondary bg-brand-elevated px-3 py-1 rounded-full border border-brand-border">
          Cost: $0.005 cUSD / message
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#050505]">
        <div className="w-full space-y-6 pb-4">
          {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${
              msg.role === "user" 
                ? "bg-brand-elevated border border-brand-border text-white rounded-br-sm" 
                : "bg-brand-border/20 text-[#E2E8F0] rounded-bl-sm"
            }`}>
              <div className="text-sm font-bold mb-1 text-text-secondary flex justify-between items-center">
                <span>{msg.role === "user" ? "You" : "AI Assistant"}</span>
                {msg.txHash && (
                  <a href={`https://celoscan.io/tx/${msg.txHash}`} target="_blank" rel="noreferrer" title={msg.txHash} className="text-xs text-brand-yellow hover:underline ml-4">
                    View Tx ↗
                  </a>
                )}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-brand-border/20 rounded-2xl rounded-bl-sm p-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-yellow/50 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-brand-yellow/70 animate-bounce" style={{animationDelay: "150ms"}}></span>
              <span className="w-2 h-2 rounded-full bg-brand-yellow/90 animate-bounce" style={{animationDelay: "300ms"}}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
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
                handleSendClick();
              }
            }}
            disabled={isTyping}
            placeholder="Type your message..."
            className="flex-grow min-w-0 bg-[#0B0E14] border border-[#1E293B] shadow-inner rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-brand-yellow transition-colors disabled:opacity-50 text-base"
          />
          <button 
            onClick={handleSendClick}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-b from-[#FDE047] to-[#F5C518] hover:brightness-110 text-black font-bold px-5 py-3 sm:px-8 sm:py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-[0_0_15px_rgba(245,197,24,0.3)] flex items-center gap-2 shrink-0"
          >
            <span>Send</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>


      </div>
    </div>
  );
}
