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
            <li><button onClick={() => setActiveTab("architecture")} className={`text-sm font-bold transition-all text-left w-full ${activeTab === "architecture" ? "text-brand-yellow translate-x-1" : "text-[#94A3B8] hover:text-white hover:translate-x-1"}`}>System Architecture</button></li>
            <li><button onClick={() => setActiveTab("x402")} className={`text-sm font-bold transition-all text-left w-full ${activeTab === "x402" ? "text-brand-yellow translate-x-1" : "text-[#94A3B8] hover:text-white hover:translate-x-1"}`}>x402 Authentication</button></li>
            <li><button onClick={() => setActiveTab("erc8004")} className={`text-sm font-bold transition-all text-left w-full ${activeTab === "erc8004" ? "text-brand-yellow translate-x-1" : "text-[#94A3B8] hover:text-white hover:translate-x-1"}`}>ERC-8004 Standard</button></li>
          </ul>

          <h3 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-4">REST Endpoints</h3>
          <ul className="space-y-3 mb-8 border-l border-[#1E293B] pl-4">
            <li><button onClick={() => setActiveTab("api-chat")} className={`text-sm font-bold transition-all text-left w-full ${activeTab === "api-chat" ? "text-white translate-x-1" : "text-[#64748B] hover:text-white hover:translate-x-1"}`}>Agentic Chat</button></li>
            <li><button onClick={() => setActiveTab("api-weather")} className={`text-sm font-bold transition-all text-left w-full ${activeTab === "api-weather" ? "text-white translate-x-1" : "text-[#64748B] hover:text-white hover:translate-x-1"}`}>Weather Info</button></li>
            <li><button onClick={() => setActiveTab("api-news")} className={`text-sm font-bold transition-all text-left w-full ${activeTab === "api-news" ? "text-white translate-x-1" : "text-[#64748B] hover:text-white hover:translate-x-1"}`}>Global News</button></li>
            <li><button onClick={() => setActiveTab("api-crypto")} className={`text-sm font-bold transition-all text-left w-full ${activeTab === "api-crypto" ? "text-white translate-x-1" : "text-[#64748B] hover:text-white hover:translate-x-1"}`}>Crypto Pulse</button></li>
            <li><button onClick={() => setActiveTab("api-summary")} className={`text-sm font-bold transition-all text-left w-full ${activeTab === "api-summary" ? "text-white translate-x-1" : "text-[#64748B] hover:text-white hover:translate-x-1"}`}>AI Summary</button></li>
            <li><button onClick={() => setActiveTab("api-translate")} className={`text-sm font-bold transition-all text-left w-full ${activeTab === "api-translate" ? "text-white translate-x-1" : "text-[#64748B] hover:text-white hover:translate-x-1"}`}>AI Translate</button></li>
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
              <option value="architecture">System Architecture</option>
              <option value="x402">x402 Authentication</option>
              <option value="erc8004">ERC-8004 Standard</option>
            </optgroup>
            <optgroup label="REST Endpoints">
              <option value="api-chat">Agentic Chat API</option>
              <option value="api-weather">Weather Info API</option>
              <option value="api-news">Global News API</option>
              <option value="api-crypto">Crypto Pulse API</option>
              <option value="api-summary">AI Summary API</option>
              <option value="api-translate">AI Translate API</option>
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

          {activeTab === "architecture" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-hidden">
              <h2 className="text-3xl font-black text-white mb-6 border-b border-[#1E293B] pb-4">System Architecture</h2>
              <p className="text-[#94A3B8] text-lg leading-relaxed mb-8">
                The protocol operates through a 4-step trustless verification loop. Our decentralized gateway ensures that data is only dispensed once cryptographically secure payment settlement is confirmed on the Celo network.
              </p>
              
              {/* Architecture Diagram */}
              <div className="relative w-full bg-[#050505] border border-[#1E293B] rounded-[32px] p-8 mb-12 shadow-2xl flex flex-col items-center gap-8 overflow-x-auto custom-scrollbar">
                <div className="w-[600px] sm:w-full flex justify-between items-center relative z-10 shrink-0">
                  <div className="bg-[#0F141C] border border-[#334155] rounded-2xl p-5 w-1/4 text-center z-20 shadow-lg">
                    <div className="text-brand-yellow text-3xl mb-3 drop-shadow-[0_0_8px_rgba(245,197,24,0.5)]">📱</div>
                    <div className="text-white font-black text-sm">Client Agent</div>
                  </div>
                  
                  <div className="h-[2px] bg-gradient-to-r from-[#334155] via-brand-yellow to-[#334155] flex-grow mx-2 relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-brand-yellow font-black uppercase tracking-widest bg-[#050505] px-3 py-1 rounded-full border border-brand-yellow/30">1. Sign Tx</div>
                  </div>
                  
                  <div className="bg-[#002A1A] border border-[#00E676] rounded-2xl p-5 w-1/4 text-center z-20 shadow-[0_0_20px_rgba(0,230,118,0.15)]">
                    <div className="text-[#00E676] text-3xl mb-3 drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]">⛓️</div>
                    <div className="text-white font-black text-sm">Celo Network</div>
                  </div>
                </div>

                <div className="w-[600px] sm:w-full flex justify-between items-center relative z-10 shrink-0">
                  <div className="bg-[#0F141C] border border-brand-yellow/50 rounded-2xl p-5 w-1/4 text-center z-20 shadow-[0_0_20px_rgba(245,197,24,0.15)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-yellow/5 animate-pulse"></div>
                    <div className="text-brand-yellow text-3xl mb-3 drop-shadow-[0_0_8px_rgba(245,197,24,0.5)] relative z-10">⚡</div>
                    <div className="text-white font-black text-sm relative z-10">Gateway Node</div>
                  </div>
                  
                  <div className="h-[2px] bg-gradient-to-r from-brand-yellow via-[#334155] to-[#334155] flex-grow mx-2 relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-[#94A3B8] font-black uppercase tracking-widest bg-[#050505] px-3 py-1 rounded-full border border-[#334155]">4. Return Data</div>
                  </div>
                  
                  <div className="bg-[#1E1B4B] border border-[#818CF8] rounded-2xl p-5 w-1/4 text-center z-20 shadow-[0_0_20px_rgba(129,140,248,0.15)]">
                    <div className="text-[#818CF8] text-3xl mb-3 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">🌐</div>
                    <div className="text-white font-black text-sm">Premium Data</div>
                  </div>
                </div>

                {/* Vertical connecting lines */}
                <div className="absolute left-[12.5%] top-[100px] bottom-[100px] w-[2px] bg-[#334155] z-0 hidden sm:block shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 text-[9px] text-[#94A3B8] font-black uppercase tracking-widest bg-[#050505] px-1 py-3 border border-[#334155] rounded-full whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>2. HTTP POST</div>
                </div>
                <div className="absolute right-[12.5%] top-[100px] bottom-[100px] w-[2px] bg-[#334155] z-0 hidden sm:block shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                   <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 text-[9px] text-[#94A3B8] font-black uppercase tracking-widest bg-[#050505] px-1 py-3 border border-[#334155] rounded-full whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>3. Verify Tx</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "x402" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-white mb-6 border-b border-[#1E293B] pb-4">x402 Protocol Implementation</h2>
              <p className="text-[#94A3B8] text-lg leading-relaxed mb-6">
                The traditional HTTP 402 "Payment Required" status code was standardized decades ago but rarely utilized due to the lack of native internet money. Pay For API modernizes this into the <strong className="text-brand-yellow">x402 standard</strong> for Web3 ecosystems.
              </p>
              
              <h3 className="text-xl font-black text-white mt-8 mb-4">Authentication Workflow</h3>
              <div className="bg-[#0B0E14] border border-[#1E293B] rounded-2xl p-6 mb-8">
                <ol className="list-decimal pl-5 text-[#94A3B8] space-y-4">
                  <li><strong className="text-white">Transaction:</strong> The Client makes a request to a provider smart contract on Celo, paying the exact required cUSD fee.</li>
                  <li><strong className="text-white">Receipt:</strong> The Client receives a Transaction Hash (<code className="bg-[#1E293B] text-white px-2 py-0.5 rounded text-xs font-mono">txHash</code>).</li>
                  <li><strong className="text-white">Execution:</strong> The Client executes a standard REST HTTP POST to the PayForAPI Gateway, embedding the <code className="bg-[#1E293B] text-white px-2 py-0.5 rounded text-xs font-mono">txHash</code> and Wallet Address in the payload.</li>
                  <li><strong className="text-white">Verification:</strong> The Gateway utilizes an RPC node to independently verify the transaction details (value, recipient, timestamp) instantly.</li>
                  <li><strong className="text-white">Fulfillment:</strong> If verified, the Gateway fulfills the request. If not, it returns a strict <code className="text-red-400 font-mono text-sm bg-red-400/10 px-2 py-0.5 rounded">HTTP 402 Payment Required</code>.</li>
                </ol>
              </div>

              <CodeBlock 
                language="http"
                code={`POST /api/chat HTTP/1.1
Host: api.payforapi.com
Content-Type: application/json

{
  "message": "Hello AI",
  "walletAddress": "0xYourWalletAddress...",
  "txHash": "0xTheTransactionHash..."
}`} 
              />
            </div>
          )}

          {activeTab === "erc8004" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-white mb-6 border-b border-[#1E293B] pb-4">ERC-8004 Standard Integration</h2>
              <p className="text-[#94A3B8] text-lg leading-relaxed mb-6">
                Pay For API implements the cutting-edge <strong className="text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded-md">ERC-8004 Asset-Bound Intelligence</strong> standard natively on the Celo blockchain. This architecture allows smart contracts to not just handle basic payments, but to strictly define the capabilities, prices, and computational limits of the autonomous agents hooked into them.
              </p>
              <div className="bg-gradient-to-br from-[#002A1A] to-[#0A0D12] border border-[#00E676]/30 rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E676]/10 rounded-bl-full blur-2xl"></div>
                <h4 className="text-[#00E676] font-black text-xl mb-3 relative z-10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                  Smart Contract Registry
                </h4>
                <p className="text-base text-[#94A3B8] mb-6 relative z-10 leading-relaxed">Our immutable core registry contract stores all available API endpoints, their dynamic cUSD/APIC prices, and their required schemas completely on-chain, creating a trustless source of truth for all agents.</p>
                <div className="bg-[#050505] border border-[#1E293B] rounded-xl p-4 flex items-center justify-between relative z-10">
                  <div>
                    <div className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-1">Mainnet Contract Address</div>
                    <code className="text-sm font-mono text-white">0x51E2b4B89ab2dAC4Aca64DccB3BAebF6B846eF52</code>
                  </div>
                  <a href="https://celoscan.io/address/0x51E2b4B89ab2dAC4Aca64DccB3BAebF6B846eF52" target="_blank" rel="noreferrer" className="text-[#00E676] text-sm font-bold hover:underline">View on Explorer ↗</a>
                </div>
              </div>
            </div>
          )}

          {/* Endpoints */}
          {activeTab.startsWith("api-") && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#1E293B] pb-4 mb-8 gap-4">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {activeTab === "api-chat" && "Agentic AI Chat API"}
                  {activeTab === "api-weather" && "Real-Time Weather API"}
                  {activeTab === "api-news" && "Global News API"}
                  {activeTab === "api-crypto" && "Crypto Pulse API"}
                  {activeTab === "api-summary" && "AI Document Summary API"}
                  {activeTab === "api-translate" && "AI Universal Translate API"}
                </h2>
                <div className="px-3 py-1.5 bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30 font-mono font-bold rounded-lg text-xs tracking-wider shadow-[0_0_10px_rgba(0,230,118,0.1)] shrink-0">
                  POST /api/{activeTab.replace("api-", "")}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="bg-[#0F141C] border border-[#1E293B] rounded-2xl p-5 flex-1 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Execution Cost</span>
                    <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse"></span>
                  </div>
                  <div className="text-3xl font-black text-white">
                    {activeTab === "api-chat" || activeTab === "api-summary" ? "$0.005" : 
                     activeTab === "api-translate" ? "$0.003" : 
                     activeTab === "api-news" ? "$0.002" : "$0.001"} 
                    <span className="text-sm font-bold text-[#00E676] ml-2">cUSD</span>
                  </div>
                </div>
                <div className="bg-[#0F141C] border border-[#1E293B] rounded-2xl p-5 flex-1 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Compute Engine</span>
                    <span className="w-2 h-2 rounded-full bg-[#818CF8] animate-pulse"></span>
                  </div>
                  <div className="text-2xl font-black text-white mt-1">
                    {activeTab.includes("api-chat") || activeTab.includes("summary") || activeTab.includes("translate") ? "Gemini 2.5 Flash" : "Web2 Enterprise Oracle"}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-white mb-3 flex items-center gap-2">
                <span className="text-[#3B82F6]">{"{"}</span> Request Schema <span className="text-[#3B82F6]">{"}"}</span>
              </h3>
              <p className="text-base text-[#94A3B8] mb-4">Standard JSON payload requiring payment verification parameters.</p>
              
              <CodeBlock 
                language="json"
                code={`{
  "walletAddress": "0xYourCeloWalletAddress...",
  "txHash": "0xTheTransactionHashConfirmingPayment...",
${
  activeTab === "api-chat" ? '  "message": "Analyze the systemic risks of DeFi protocols."' :
  activeTab === "api-weather" ? '  "city": "London"' :
  activeTab === "api-news" ? '  "category": "technology"' :
  activeTab === "api-crypto" ? '  "ids": "celo,bitcoin,ethereum"' :
  activeTab === "api-summary" ? '  "text": "Extensive text block of documentation to be summarized into key points..."' :
  '  "text": "Hello world, the future is decentralized and agentic.",\n  "language": "French"'
}
}`}
              />

              <h3 className="text-xl font-black text-white mt-10 mb-3 flex items-center gap-2">
                <span className="text-[#00E676]">{"{"}</span> Successful Response <span className="text-[#00E676]">{"}"}</span>
              </h3>
              <CodeBlock 
                language="json"
                code={`{
  "success": true,
  "data": {
    // Expected requested payload data returned instantly
  },
  "txVerified": true,
  "timestamp": "2026-06-05T00:00:00Z"
}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
