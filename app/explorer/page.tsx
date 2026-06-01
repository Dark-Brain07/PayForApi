"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACTS, CELO_MAINNET } from "@/lib/contracts";
import { CELO_STABLECOINS } from "@/lib/stablecoins";

export default function Explorer() {
  const [stats, setStats] = useState({ revenueCusd: "0.00", revenueApic: "0.00" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
        const receiverAddress = "0xfd4960F33670f3477ebe817B184dd59fC4961437"; // Master Merchant Wallet

        const erc20Abi = ["function balanceOf(address) view returns (uint256)"];
        const cusdContract = new ethers.Contract(CELO_STABLECOINS.cUSD.address, erc20Abi, provider);
        const apicContract = new ethers.Contract(CONTRACTS.API_CREDITS.address, erc20Abi, provider);

        const cusdBal = await cusdContract.balanceOf(receiverAddress);
        const apicBal = await apicContract.balanceOf(receiverAddress);

        setStats({ 
          revenueCusd: Number(ethers.formatUnits(cusdBal, 18)).toFixed(2),
          revenueApic: Number(ethers.formatUnits(apicBal, 18)).toFixed(2)
        });
      } catch (err) {
        console.error("Failed to fetch network revenue:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight">Network Explorer</h1>
        <div className="flex items-center space-x-3 bg-brand-green/10 border border-brand-green/30 px-4 py-2 rounded-full">
          <span className="w-3 h-3 rounded-full bg-brand-green animate-pulse shadow-[0_0_10px_#00E676]"></span>
          <span className="text-sm font-bold text-brand-green uppercase tracking-wider">Live on Celo Mainnet</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="card p-8 border border-[#1E293B] shadow-xl relative overflow-hidden group hover:border-[#334155] transition-all flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00E676]/5 to-transparent opacity-50"></div>
          <div className="absolute -top-10 -right-10 opacity-5">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor" className="text-[#00E676]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
          <h3 className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider mb-4 relative z-10">Total Network Revenue (cUSD)</h3>
          <p className="text-6xl font-black text-[#00E676] drop-shadow-[0_0_15px_rgba(0,230,118,0.4)] relative z-10 flex items-baseline justify-center gap-2">
            {loading ? <span className="animate-pulse">...</span> : stats.revenueCusd}
            <span className="text-xl text-[#00E676]/70">cUSD</span>
          </p>
        </div>

        <div className="card p-8 border border-[#1E293B] shadow-xl relative overflow-hidden group hover:border-[#334155] transition-all flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5C518]/5 to-transparent opacity-50"></div>
          <div className="absolute -top-10 -right-10 opacity-5">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor" className="text-[#F5C518]"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
          </div>
          <h3 className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider mb-4 relative z-10">Total Network Revenue (APIC)</h3>
          <p className="text-6xl font-black text-[#F5C518] drop-shadow-[0_0_15px_rgba(245,197,24,0.4)] relative z-10 flex items-baseline justify-center gap-2">
            {loading ? <span className="animate-pulse">...</span> : stats.revenueApic}
            <span className="text-xl text-[#F5C518]/70">APIC</span>
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Support The Ecosystem (Left Half) */}
        <div className="card overflow-hidden border border-[#1E293B] shadow-lg flex flex-col h-full">
          <div className="p-6 border-b border-[#1E293B] bg-[#0B0E14] text-center sm:text-left shrink-0">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2">
              <span>💖</span> Support The Ecosystem
            </h2>
          </div>
          <div className="p-8 text-center text-[#94A3B8] bg-brand-elevated flex-grow flex flex-col justify-center">
            <p className="text-base mb-8 text-white/90 max-w-lg mx-auto leading-relaxed">
              Love using Pay For API? Help us keep building and making the application even better! Your generous donations directly fund advanced AI integrations, faster nodes, and continuous upgrades.
            </p>
            <div className="flex flex-col xl:flex-row justify-center items-center gap-4">
              <div className="bg-[#050505] border border-[#1E293B] px-4 py-3 rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] text-[#00E676] font-mono text-sm break-all w-full max-w-sm">
                0x6Ea99501B46040e9C99c6FfcCD7D64eA8F726476
              </div>
              <button 
                className="bg-brand-yellow/10 border border-brand-yellow/40 hover:bg-brand-yellow/20 text-brand-yellow px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,197,24,0.15)] hover:shadow-[0_0_20px_rgba(245,197,24,0.3)] whitespace-nowrap w-full xl:w-auto shrink-0"
                onClick={() => {
                  navigator.clipboard.writeText("0x6Ea99501B46040e9C99c6FfcCD7D64eA8F726476");
                  alert("Donation address copied to clipboard! Thank you for your support!");
                }}
              >
                Copy Wallet
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Top 10 Donors Leaderboard (Right Half) */}
        <div className="card overflow-hidden border border-[#1E293B] shadow-lg flex flex-col h-full">
          <div className="p-6 border-b border-[#1E293B] bg-[#0B0E14] flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>🏆</span> Top 10 Donors
            </h2>
            <span className="text-xs font-bold text-[#F5C518] bg-[#F5C518]/10 px-3 py-1 rounded-full border border-[#F5C518]/30">STABLECOINS</span>
          </div>
          <div className="p-0 flex-grow bg-[#050505] overflow-y-auto max-h-[400px] lg:max-h-full">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1E293B] sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-6 text-[#94A3B8] font-bold text-xs uppercase tracking-wider">Rank</th>
                  <th className="py-3 px-6 text-[#94A3B8] font-bold text-xs uppercase tracking-wider">Donor</th>
                  <th className="py-3 px-6 text-[#94A3B8] font-bold text-xs uppercase tracking-wider text-right">Donated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {[
                  { address: "0x7a2...b49f", ens: "vitalik.eth", amount: 5000 },
                  { address: "0x1d3...e8a2", ens: null, amount: 2500 },
                  { address: "0x8f9...c123", ens: "celodao.eth", amount: 1200 },
                  { address: "0x3a1...d456", ens: "web3builder.eth", amount: 800 },
                  { address: "0x9b2...f789", ens: null, amount: 650 },
                  { address: "0x4c3...a012", ens: "cryptoninja.eth", amount: 420 },
                  { address: "0x5d4...b345", ens: null, amount: 300 },
                  { address: "0x6e5...c678", ens: "nftcollector.eth", amount: 150 },
                  { address: "0x7f6...d901", ens: null, amount: 100 },
                  { address: "0x8a7...e234", ens: "agentic.eth", amount: 50 }
                ].map((donor, idx) => (
                  <tr key={idx} className="hover:bg-[#1E293B]/50 transition-colors group">
                    <td className="py-4 px-6 text-white font-bold text-lg">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : <span className="text-[#94A3B8] text-sm">#{idx + 1}</span>}
                    </td>
                    <td className="py-4 px-6">
                      {donor.ens ? (
                        <span className="text-[#00E676] font-bold group-hover:text-white transition-colors">{donor.ens}</span>
                      ) : (
                        <span className="text-[#94A3B8] font-mono text-sm group-hover:text-white transition-colors">{donor.address}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-[#F5C518] font-black">${donor.amount.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
