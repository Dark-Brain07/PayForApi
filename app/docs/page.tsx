"use client";
import React, { useState } from 'react';

export default function Docs() {
  const [activeTab, setActiveTab] = useState("intro");

  const CodeBlock = ({ code, language = "json" }: { code: string, language?: string }) => (
    <div className="relative group rounded-xl overflow-hidden bg-[#050505] border border-[#1E293B] shadow-inner my-6">
      <div className="flex justify-between items-center px-4 py-2 bg-[#0F141C] border-b border-[#1E293B]">
        <span className="text-xs font-mono text-[#94A3B8]">{language.toUpperCase()}</span>
        <button className="text-xs text-[#94A3B8] hover:text-white transition-colors">Copy</button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-[#E2E8F0] whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-[90vh]">
      {/* Docs Hero */}
      <div className="border-b border-[#1E293B] bg-[#0A0D12] pt-20 pb-16 px-4 md:px-16 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-yellow/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-yellow/10 border border-brand-yellow/30 rounded-full mb-6 shadow-[0_0_15px_rgba(245,197,24,0.1)]">
            <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse"></span>
            <span className="text-brand-yellow text-[10px] font-black uppercase tracking-widest">Protocol v1.0.0</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-200">Documentation</span></h1>
          <p className="text-[#94A3B8] text-lg md:text-xl max-w-3xl leading-relaxed font-medium">
            Integrate the world's first fully decentralized, subscriptionless API gateway. 
            Pay For API utilizes the x402 protocol and Celo micropayments to enable frictionless machine-to-machine and human-to-machine data access.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 md:px-16 py-12 gap-12 relative flex-grow">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 border-r border-[#1E293B] pr-6 sticky top-24 h-fit hidden md:block">
          <h3 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-4">Core Concepts</h3>
          <ul className="space-y-3 mb-10">
            <li><button onClick={() => setActiveTab("intro")} className={`text-sm font-bold transition-all text-left w-full ${activeTab === "intro" ? "text-brand-yellow translate-x-1" : "text-[#94A3B8] hover:text-white hover:translate-x-1"}`}>Introduction</button></li>
          </ul>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className="md:hidden mb-8">
          <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full bg-[#0F141C] border border-[#1E293B] text-white text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-brand-yellow appearance-none"
          >
            <optgroup label="Core Concepts">
              <option value="intro">Introduction</option>
            </optgroup>
          </select>
        </div>

        {/* Content Area */}
        <div className="flex-grow max-w-3xl w-full">
          {activeTab === "intro" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-white mb-6 border-b border-[#1E293B] pb-4">Introduction to Pay For API</h2>
              <p className="text-[#94A3B8] text-lg leading-relaxed mb-6">
                Accessing premium Web2 data and advanced AI models is fundamentally broken in the era of autonomous agents. Developers and everyday users are forced to manage expensive subscriptions, credit cards, and complex API key infrastructure.
              </p>
              <p className="text-[#94A3B8] text-lg leading-relaxed mb-6">
                <strong>Pay For API</strong> solves this by turning every API call into a trustless, cryptographically verified micro-transaction. By leveraging the extreme low fees of the Celo blockchain and stablecoins (cUSD, cEUR, cREAL), we provide a seamless "Pay As You Go" gateway. No API keys. No sign-ups. Absolute freedom for humans and AI agents.
              </p>
              <div className="bg-[#0A0D12] border border-[#1E293B] rounded-2xl p-6 mt-8 shadow-xl">
                <h4 className="text-brand-yellow font-black uppercase tracking-widest mb-4 text-xs">Key Protocol Benefits</h4>
                <ul className="list-none space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-[#00E676] mt-0.5">✓</span>
                    <div><strong className="text-white block mb-1">Zero Subscriptions</strong> <span className="text-[#94A3B8] text-sm">Pay exact fractions of a cent per request directly from your wallet.</span></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00E676] mt-0.5">✓</span>
                    <div><strong className="text-white block mb-1">Agent-Ready Design</strong> <span className="text-[#94A3B8] text-sm">AI agents can natively hold their own Celo wallets and pay for their own data streams autonomously.</span></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00E676] mt-0.5">✓</span>
                    <div><strong className="text-white block mb-1">Instant Settlement</strong> <span className="text-[#94A3B8] text-sm">Powered by Celo's sub-second block times for synchronous data delivery.</span></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00E676] mt-0.5">✓</span>
                    <div><strong className="text-white block mb-1">Privacy First</strong> <span className="text-[#94A3B8] text-sm">No PII or KYC required. Your cryptographic address is your sole identity.</span></div>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
