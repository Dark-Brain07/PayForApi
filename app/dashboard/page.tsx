"use client";
import Link from "next/link";
import { useWallet } from "@/components/wallet/WalletContext";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACTS } from "@/lib/contracts";
import { CELO_STABLECOINS } from "@/lib/stablecoins";

export default function Dashboard() {
  const { address, isConnected } = useWallet();
  const [stats, setStats] = useState({ calls: 0, spentCusd: "0.00", spentApic: "0" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!address || typeof window === "undefined" || !(window as any).ethereum) return;
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const receiverAddress = "0xfd4960F33670f3477ebe817B184dd59fC4961437";
        
        const erc20Abi = ["event Transfer(address indexed from, address indexed to, uint256 value)"];
        
        const cusdContract = new ethers.Contract(CELO_STABLECOINS.cUSD.address, erc20Abi, provider);
        const apicContract = new ethers.Contract(CONTRACTS.API_CREDITS.address, erc20Abi, provider);
        
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(0, currentBlock - 100000); // Check last ~2 days of blocks

        const filterCusd = cusdContract.filters.Transfer(address, receiverAddress);
        const filterApic = apicContract.filters.Transfer(address, receiverAddress);

        const cusdEvents = await cusdContract.queryFilter(filterCusd, fromBlock, "latest");
        const apicEvents = await apicContract.queryFilter(filterApic, fromBlock, "latest");

        const totalCalls = cusdEvents.length + apicEvents.length;
        
        let totalSpentCusd = BigInt(0);
        for(let event of cusdEvents) {
          totalSpentCusd += (event as any).args.value;
        }

        let totalSpentApic = BigInt(0);
        for(let event of apicEvents) {
          totalSpentApic += (event as any).args.value;
        }

        setStats({ 
          calls: totalCalls, 
          spentCusd: Number(ethers.formatUnits(totalSpentCusd, 18)).toFixed(4),
          spentApic: Number(ethers.formatUnits(totalSpentApic, 18)).toFixed(0)
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [address]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">Dashboard</h1>
          <p className="text-text-secondary">Please connect your wallet to view your API usage stats.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-8 text-white tracking-tight">Your API Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-6 border border-[#1E293B] shadow-lg relative overflow-hidden group hover:border-[#334155] transition-all flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-50"></div>
          <div className="mb-4">
            <h3 className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider mb-2 relative z-10">Connected Address</h3>
            <p className="font-mono text-white text-sm break-all relative z-10">{address}</p>
          </div>
          <Link href="/explorer" className="relative z-10 bg-brand-yellow/10 hover:bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 px-4 py-2.5 rounded-lg font-bold text-center transition-all flex items-center justify-center gap-2 mt-auto shadow-[0_0_10px_rgba(245,197,24,0.1)] hover:shadow-[0_0_15px_rgba(245,197,24,0.2)]">
            <span>💖</span> Donate Us
          </Link>
        </div>
        
        <div className="card p-6 border border-[#1E293B] shadow-lg relative overflow-hidden group hover:border-[#334155] transition-all flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-50"></div>
          <h3 className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider mb-2 relative z-10">Total API Calls</h3>
          <p className="text-5xl font-black text-white drop-shadow-md relative z-10">
            {loading ? <span className="animate-pulse">...</span> : stats.calls}
          </p>
        </div>
        
        <div className="card p-6 border border-[#1E293B] shadow-lg relative overflow-hidden group hover:border-[#334155] transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00E676]/5 to-transparent opacity-50"></div>
          <h3 className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider mb-4 relative z-10">Total API Spending</h3>
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-[#00E676]">{loading ? "..." : stats.spentCusd}</span>
              <span className="text-[#94A3B8] font-bold mb-1">cUSD</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-[#F5C518]">{loading ? "..." : stats.spentApic}</span>
              <span className="text-[#94A3B8] font-bold mb-1">APIC</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card p-8 border border-[#1E293B] shadow-xl bg-gradient-to-b from-[#0B0E14] to-transparent">
        <h2 className="text-2xl font-bold mb-4 text-white">Your Authentication Key</h2>
        <p className="text-[#94A3B8] mb-6 text-lg">
          In the Pay For API ecosystem, your wallet address is your unified API key. Pass it in your request headers alongside your transaction hash to authenticate.
        </p>
        <div className="bg-[#050505] border border-[#1E293B] p-5 rounded-xl flex justify-between items-center shadow-inner">
          <span className="font-mono text-[#00E676] text-lg">{address}</span>
          <button 
            className="btn-primary py-2 px-6 shadow-[0_0_15px_rgba(0,230,118,0.3)]" 
            onClick={() => {
              navigator.clipboard.writeText(address || "");
              alert("Address copied to clipboard!");
            }}
          >
            Copy Address
          </button>
        </div>
      </div>
    </div>
  );
}
