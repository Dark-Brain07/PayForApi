"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@/components/wallet/WalletContext";
import { EthereumProvider } from "@/hooks/useAuth";
import { ethers } from "ethers";
import { processPayment } from "@/lib/payment";
import { CELO_STABLECOINS, StablecoinKey } from "@/lib/stablecoins";
import { CONTRACTS } from "@/lib/contracts";

/** Represents a chat message in the UI */
interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  txHash?: string;
}

/**
 * Interactive chat interface to test AI agents using x402 micropayments.
 */
export default function ChatPage(): React.JSX.Element {
  const { address, isMiniPay } = useWallet();
  const [messages, setMessages] = useState<Message[]>([
    { id: "intro", role: "ai", content: "Hello! I am your Smart Assistant. You pay per message using your stablecoins. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [totalTokens, setTotalTokens] = useState(0);
  const [paymentToken, setPaymentToken] = useState<StablecoinKey | "APIC">("USDm");

  // Load tokens from local storage on mount/address change
  useEffect(() => {
    if (address) {
      try {
        const stored = localStorage.getItem(`chat_tokens_${address}`);
        if (stored) setTotalTokens(parseInt(stored, 10));
      } catch (e) {
        // Silent storage error
      }
    }
  }, [address]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /** Handles sending the chat message and processing payment */
  const handleSendClick = async () => {
    if (!input.trim()) return;
    if (!address) {
      alert("Please connect your account first.");
      return;
    }
    
    const userMessage = input.trim();
    setInput(""); // clear input immediately to feel responsive
    setIsTyping(true);

    try {
      const FALLBACK_TX_HASH = "0x0000000000000000000000000000000000000000";
      let txHash = FALLBACK_TX_HASH; // fallback if missing
      
      // Execute background transaction without modal popup
      if (typeof window !== "undefined" && (window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum) {
        const provider = new ethers.BrowserProvider((window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum as unknown as ethers.Eip1193Provider);
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
          requestId,
          isMiniPay
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
      
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
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
      const errObj = e as Record<string, any>;
      let errorMessage = errObj?.reason || errObj?.message || "Payment failed or cancelled.";
      if (errorMessage.includes("transfer amount exceeds balance")) {
        if (isMiniPay) {
          window.location.href = "https://link.minipay.xyz/add_cash?tokens=USDm";
          return;
        }
        errorMessage = "Transaction failed: Insufficient USDm balance.";
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
    <main className="fixed inset-0 top-[104px] bottom-0 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 overflow-hidden z-30">
      <title>Smart Assistant | PayForAPI</title>
      <meta name="description" content="Pay-as-you-go Premium AI Chat without subscriptions." />
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      {/* Sidebar Widgets (Right Side) */}
      <div className="hidden xl:flex absolute right-12 top-[20%] flex-col gap-6 z-10 w-64">
        
        {/* Payment Selector Widget */}
        <div className="flex flex-col p-5 bg-[#0A0D12] border border-[#1E293B] rounded-2xl shadow-2xl">
          <div className="text-[#94A3B8] text-xs font-bold uppercase tracking-[0.2em] mb-3 text-center">Payment Method</div>
          <div className="relative group w-full">
            <div className="absolute inset-0 bg-brand-yellow/5 rounded-xl blur-sm group-hover:bg-brand-yellow/20 transition-all duration-300 pointer-events-none"></div>
            <select 
              aria-label="Payment Method"
              value={paymentToken} 
              disabled={isTyping}
              title="Select payment token. Platform fee applies."
              onChange={(e) => setPaymentToken(e.target.value as "USDm" | "APIC")}
              className="relative w-full bg-[#0F141C]/90 backdrop-blur-md border border-[#1E293B] hover:border-brand-yellow/50 text-white text-sm font-bold rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow appearance-none cursor-pointer transition-all disabled:opacity-50"
            >
              {Object.keys(CELO_STABLECOINS).map(token => (
                <option key={token} value={token} className="bg-[#050505] text-white">{token} (~$0.005)</option>
              ))}
              {!isMiniPay && <option value="APIC" className="bg-[#050505] text-white">Prepaid (20 Credits)</option>}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-yellow">
              <svg aria-hidden="true" className="fill-current h-4 w-4 drop-shadow-[0_0_8px_rgba(245,197,24,0.5)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Token Stats Widget */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#0A0D12] border border-[#1E293B] rounded-2xl shadow-2xl">
          <div className="text-[#94A3B8] text-xs font-bold uppercase tracking-[0.2em] mb-4 text-center">AI Tokens Used</div>
          <div aria-live="polite" className="text-4xl font-black text-brand-yellow mb-2 drop-shadow-[0_0_15px_rgba(245,197,24,0.4)]">
            {totalTokens.toLocaleString()}
          </div>
          <div className="text-text-secondary text-sm text-center">Total AI tokens consumed by your connected account</div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col w-full max-w-6xl h-full sm:h-[85vh] sm:min-h-[600px] sm:max-h-[1000px] bg-[#0A0D12] border border-[#1E293B] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10">
        
      {/* Header Area */}
      <div className="border-b border-brand-border bg-[#0F141C] p-3 sm:p-5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
        <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 self-start sm:self-auto">
          Smart Assistant
        </h1>
        <div className="flex xl:hidden items-center w-full sm:w-auto mt-1 sm:mt-0 relative group z-20">
          <div className="absolute inset-0 bg-brand-yellow/5 rounded-xl blur-md group-hover:bg-brand-yellow/20 transition-all duration-300 pointer-events-none"></div>
          <select 
            value={paymentToken} 
            onChange={(e) => setPaymentToken(e.target.value as "USDm" | "APIC")}
            disabled={isTyping}
            className="relative w-full sm:w-auto bg-[#0F141C]/80 backdrop-blur-xl border border-[#1E293B] hover:border-brand-yellow/50 text-white text-sm font-black tracking-wide rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow appearance-none cursor-pointer shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            <option value="USDm" className="bg-[#050505] text-white py-2">Cost: $0.005 USDm</option>
            <option value="EURm" className="bg-[#050505] text-white py-2">Cost: €0.005 EURm</option>
            <option value="BRLm" className="bg-[#050505] text-white py-2">Cost: R$0.005 BRLm</option>
            {!isMiniPay && <option value="APIC" className="bg-[#050505] text-white py-2">Cost: 20 Prepaid Credits</option>}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-yellow">
            <svg className="fill-current h-4 w-4 drop-shadow-[0_0_8px_rgba(245,197,24,0.5)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        <div className="hidden xl:block text-sm text-text-secondary bg-brand-elevated px-3 py-1 rounded-full border border-brand-border">
          Cost: {paymentToken === "APIC" ? "20 APIC" : "$0.005"} / message
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
                <div className="flex gap-3">
                  {msg.role === "ai" && (
                    <button aria-label="Copy Message" onClick={() => {
                      try {
                        navigator.clipboard.writeText(msg.content);
                      } catch (e) {
                        console.error("Clipboard permission denied");
                      }
                    }} className="text-xs text-[#94A3B8] hover:text-white" title="Copy Message">Copy</button>
                  )}
                  {msg.txHash && (
                    <a href={`https://celoscan.io/tx/${msg.txHash}`} target="_blank" rel="noopener noreferrer" title={msg.txHash} className="text-xs text-brand-yellow hover:underline">
                      View Tx ↗
                    </a>
                  )}
                </div>
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
        <div className="flex flex-wrap gap-2 mb-3">
          {["✍️ Draft a professional email", "🌐 Translate to Spanish", "💡 Brainstorm business ideas"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="text-xs bg-[#1E293B] hover:bg-[#2D3748] text-[#94A3B8] hover:text-white px-3 py-1.5 rounded-full transition-colors border border-[#334155]"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="w-full flex gap-3 relative">
          <input 
            type="text" 
            aria-label="Message Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e): void => {
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
            aria-label="Send Chat Message"
            className="bg-gradient-to-b from-[#FDE047] to-[#F5C518] hover:brightness-110 text-black font-bold px-5 py-3 sm:px-8 sm:py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-[0_0_15px_rgba(245,197,24,0.3)] flex items-center gap-2 shrink-0"
          >
            <span>Send</span>
            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
        {isMiniPay && (
          <div className="flex justify-center space-x-6 mt-3 text-[10px] text-[#94A3B8]">
            <Link href="/terms" title="Terms of Service" className="hover:text-brand-yellow">Terms</Link>
            <Link href="/privacy" title="Privacy Policy" className="hover:text-brand-yellow">Privacy</Link>
            <a href="https://t.me/payforapi_support" title="Contact Support" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow">Support</a>
          </div>
        )}
      </div>


      </div>
    </main>
  );
}
