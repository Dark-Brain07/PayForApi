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
      
      <div className="card overflow-hidden border border-[#1E293B] shadow-lg">
        <div className="p-6 border-b border-[#1E293B] bg-[#0B0E14]">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Network Transparency</h2>
        </div>
        <div className="p-12 text-center text-[#94A3B8] bg-brand-elevated">
          <p className="text-lg">
            Pay For API operates via direct P2P smart contract transfers. 100% of the network revenue displayed above is verifiably backed on the Celo blockchain.
          </p>
          <div className="mt-6 flex justify-center">
            <a href={`https://celoscan.io/address/0xfd4960F33670f3477ebe817B184dd59fC4961437`} target="_blank" rel="noreferrer" className="bg-[#1E293B] hover:bg-[#334155] border border-[#475569] text-white px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2">
              View Merchant Wallet on CeloScan 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
