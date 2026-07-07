"use client";
import Link from "next/link";

import { useWallet } from "@/components/wallet/WalletContext";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { TERMINAL_BOOT_LOGS } from "@/lib/constants";

const MATRIX_BG_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgzMCwgNDEsIDU5LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=";

const BOOT_SPEED_MS = 150;

function InteractiveTerminal() {
  const router = useRouter();
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
        setIsReady(true);
      }
    }, BOOT_SPEED_MS); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isReady) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          router.push('/marketplace');
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

/**
 * Landing page featuring an interactive terminal hero section for devs,
 * and a simplified AI consumer interface for MiniPay users.
 */
export default function Home() {
  const router = useRouter();
  const { isMiniPay } = useWallet();

  const handleEnterMarketplace = () => router.push('/marketplace');

  if (isMiniPay) {
    return (
      <main className="flex flex-col w-full min-h-screen items-center py-12 px-4">
        <title>AI Assistant - Pay as you go</title>
        <meta name="description" content="Your personal AI assistant, paid per question in digital dollars." />
        
        <div className="text-center mb-10 mt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-yellow/10 mb-4 border border-brand-yellow/20">
            <span className="text-3xl" role="img" aria-label="Robot">🤖</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Your Personal AI</h1>
          <p className="text-[#94A3B8] text-sm max-w-xs mx-auto">
            Get instant answers and images. Pay per question in digital dollars. No subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
          <Link href="/chat" aria-label="Open AI Chat" className="bg-[#111] border border-[#222] p-5 rounded-2xl hover:border-brand-yellow/50 transition-all flex items-center space-x-4 active:scale-95">
            <div className="text-3xl bg-brand-yellow/10 p-3 rounded-xl border border-brand-yellow/20">💬</div>
            <div className="text-left">
              <h2 className="text-lg font-bold text-white">Ask AI</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">Answers, translation, and summaries</p>
            </div>
          </Link>
          
          <Link href="/image" className="bg-[#111] border border-[#222] p-5 rounded-2xl hover:border-brand-green/50 transition-all flex items-center space-x-4 active:scale-95">
            <div className="text-3xl bg-brand-green/10 p-3 rounded-xl border border-brand-green/20">🎨</div>
            <div className="text-left">
              <h2 className="text-lg font-bold text-white">Create Image</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">Generate art from imagination</p>
            </div>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full">
      <title>PayForAPI - Celo Web3 API Monetization</title>
      <meta name="description" content="Monetize your AI endpoints instantly on Celo via x402 micropayments." />
      {/* Terminal Hero Section */}
      <section className="pt-20 pb-24 px-4 max-w-5xl mx-auto w-full text-center">
        <div 
          onClick={handleEnterMarketplace}
          aria-label="Interactive Terminal"
          role="button"
          tabIndex={0}
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
              <span aria-label="Root User">root@celo</span>
              <span aria-hidden="true">~</span>
              <span>pay-for-api</span>
            </div>
          </div>
          
          {/* Terminal Body */}
          <div className="p-8 md:p-12 text-left font-mono min-h-[350px] flex flex-col justify-center items-center relative overflow-hidden">
            {/* Background Matrix/Grid effect */}
            <div aria-hidden="true" className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url('${MATRIX_BG_URL}')` }}></div>

            <InteractiveTerminal />
          </div>
        </div>

        <div className="mt-12 flex justify-center opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards]">
          <Link prefetch href="/marketplace" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black transition-all duration-300 bg-brand-yellow rounded-xl hover:bg-brand-yellow/90 hover:scale-105 hover:shadow-[0_0_30px_rgba(245,197,24,0.4)] overflow-hidden">
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative flex items-center gap-2 text-lg">
              Explore API Marketplace
              <svg aria-hidden="true" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </span>
          </Link>
        </div>
      </section>

    </main>
  );
}
