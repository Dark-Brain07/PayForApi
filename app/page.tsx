"use client";
import Link from "next/link";
import { CELO_STABLECOINS } from "@/lib/stablecoins";
import { useWallet } from "@/components/wallet/WalletContext";
import { useState, useEffect } from "react";

const TERMINAL_BOOT_LOGS = [
  "> Initialize Celo Network...",
  "> Loading ERC-8004 Agent...",
  "> Loading MiniPay x x402 for payment...",
  "> Authenticating node connection...",
  "> Loading currencies: [cUSD, cEUR, cKES, cBRL, cGHS, cCOP, PUSO] ... OK",
  "> Checking API Integrations... OK",
  "> SUCCESS: All systems operational."
];

function InteractiveTerminal() {
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < TERMINAL_BOOT_LOGS.length) {
        const currentLog = TERMINAL_BOOT_LOGS[currentIndex];
        setBootLogs(prev => [...prev, currentLog]);
      }
      
      currentIndex++;
      if (currentIndex >= TERMINAL_BOOT_LOGS.length) {
        clearInterval(interval);
        setTimeout(() => setIsReady(true), 400);
      }
    }, 150); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isReady) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          window.location.href = '/marketplace';
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isReady]);

  return (
    <>
      <div className="absolute top-6 left-6 text-brand-green/50 text-[10px] md:text-xs font-mono space-y-1 text-left">
        {bootLogs.map((log, index) => (
          <p key={index} className={log?.includes("SUCCESS") ? "text-brand-green font-bold mt-2" : ""}>
            {log}
          </p>
        ))}
      </div>

      {isReady && (
        <div className="z-10 mt-32 md:mt-24 flex flex-col items-center w-full">

          
          <div className="mt-16 text-text-secondary text-sm md:text-base animate-pulse opacity-50 hover:opacity-100 hover:text-brand-yellow transition-all flex items-center space-x-2">
            <span className="border border-text-secondary/30 px-2 py-1 rounded">ENTER</span>
            <span>to execute</span>
          </div>
        </div>
      )}
    </>
  );
}

export default function Home() {
  const { isMiniPay, address } = useWallet();

  return (
    <div className="flex flex-col w-full">
      {/* Terminal Hero Section */}
      <section className="pt-20 pb-24 px-4 max-w-5xl mx-auto w-full text-center">
        {isMiniPay && (
          <div className="inline-flex items-center space-x-2 bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow px-4 py-2 rounded-full mb-8 text-sm font-medium animate-pulse">
            <span>📱</span>
            <span>Running in MiniPay — wallet auto-connected</span>
          </div>
        )}
        
        <div 
          onClick={() => window.location.href = '/marketplace'}
          aria-label="Enter marketplace"
          className="max-w-4xl mx-auto bg-[#0a0a0a] border border-[#222] rounded-xl shadow-[0_0_50px_rgba(0,255,0,0.1)] overflow-hidden cursor-pointer group hover:border-brand-green/50 transition-all duration-300 relative"
        >
          {/* Terminal Header */}
          <div className="bg-[#111] px-4 py-3 flex items-center border-b border-[#222]">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-brand-yellow/80"></div>
              <div className="w-3 h-3 rounded-full bg-brand-green/80"></div>
            </div>
            <div className="mx-auto text-[#666] text-sm font-mono tracking-wider flex items-center space-x-2">
              <span>root@celo</span>
              <span>~</span>
              <span>pay-for-api</span>
            </div>
          </div>
          
          {/* Terminal Body */}
          <div className="p-8 md:p-12 text-left font-mono min-h-[350px] flex flex-col justify-center items-center relative overflow-hidden">
            {/* Background Matrix/Grid effect */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgzMCwgNDEsIDU5LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

            <InteractiveTerminal />
          </div>
        </div>

        <div className="mt-12 flex justify-center opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards]">
          <Link prefetch={true} href="/marketplace" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black transition-all duration-300 bg-brand-yellow rounded-xl hover:bg-brand-yellow/90 hover:scale-105 hover:shadow-[0_0_30px_rgba(245,197,24,0.4)] overflow-hidden">
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative flex items-center gap-2 text-lg">
              Explore API Marketplace
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </span>
          </Link>
        </div>
      </section>

    </div>
  );
}
