"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACTS, CELO_MAINNET } from "@/lib/contracts";
import { CELO_STABLECOINS } from "@/lib/stablecoins";

interface DonorInfo {
  address: string;
  amount: number;
}

export default function Explorer() {
  const [stats, setStats] = useState({ revenueCusd: "0.00", revenueApic: "0.00" });
  const [topDonors, setTopDonors] = useState<DonorInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
        const MASTER_MERCHANT_WALLET = "0xfd4960F33670f3477ebe817B184dd59fC4961437"; // Master Merchant Wallet
        const receiverAddress = MASTER_MERCHANT_WALLET;

        const ERC20_BALANCE_ABI = ["function balanceOf(address) view returns (uint256)"];
        const erc20Abi = ERC20_BALANCE_ABI;
        const cusdContract = new ethers.Contract(CELO_STABLECOINS.cUSD.address, erc20Abi, provider);
        const apicContract = new ethers.Contract(CONTRACTS.API_CREDITS.address, erc20Abi, provider);

        let cusdBal = 0n;
        let apicBal = 0n;
        try {
          cusdBal = await cusdContract.balanceOf(receiverAddress);
          apicBal = await apicContract.balanceOf(receiverAddress);
        } catch (e) {
          console.warn("Could not fetch balances, using 0");
        }

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

    async function fetchLeaderboard() {
      try {
        const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
        const ECOSYSTEM_DONATION_WALLET = "0x6Ea99501B46040e9C99c6FfcCD7D64eA8F726476";
        const donationWallet = ECOSYSTEM_DONATION_WALLET;
        
        const erc20Abi = ["event Transfer(address indexed from, address indexed to, uint256 value)"];
        const cusdContract = new ethers.Contract(CELO_STABLECOINS.cUSD.address, erc20Abi, provider);
        
        // Query last ~2 million blocks (about 1 month of Celo blocks)
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(0, currentBlock - 2000000);
        
        const filter = cusdContract.filters.Transfer(null, donationWallet);
        const events = (await cusdContract.queryFilter(filter, fromBlock, "latest")) || [];
        
        const donations: Record<string, number> = {};
        
        events.forEach((event: any) => {
          const from = event.args.from;
          const amount = Number(ethers.formatUnits(event.args.value, 18));
          
          if (donations[from]) {
            donations[from] += amount;
          } else {
            donations[from] = amount;
          }
        });
        
        const sortedDonors: DonorInfo[] = Object.keys(donations)
          .map(address => ({ address, amount: donations[address] }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 10);
          
        setTopDonors(sortedDonors);
      } catch (error) {
        console.error("Error fetching leaderboard from RPC", error);
        setLeaderboardError("Failed to load leaderboard");
      } finally {
        setLeaderboardLoading(false);
      }
    }

    fetchStats();
    fetchLeaderboard();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="w-full min-h-screen bg-black py-12 flex flex-col pt-16"><div className="max-w-7xl mx-auto px-4 w-full">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight">Network Explorer</h1>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 items-start">
        {/* Support The Ecosystem (Left Half) */}
        <div className="card overflow-hidden border border-[#1E293B] shadow-lg flex flex-col">
          <div className="p-6 border-b border-[#1E293B] bg-[#0B0E14] text-center sm:text-left shrink-0">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2">
              <span>💖</span> Support The Ecosystem
            </h2>
          </div>
          <div className="p-8 text-center text-[#94A3B8] bg-brand-elevated flex-grow flex flex-col justify-center">
            <p className="text-base mb-8 text-white/90 max-w-lg mx-auto leading-relaxed">
              Love using Pay For API? Help us keep building and making the application even better! Your generous donations directly fund advanced AI integrations, faster nodes, and continuous upgrades.
            </p>
            <div className="flex flex-col xl:flex-row justify-center items-center gap-4 w-full">
              <div className="bg-[#050505] border border-[#1E293B] px-3 sm:px-4 py-3 rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] text-[#00E676] font-mono text-xs sm:text-sm truncate w-full max-w-sm text-center">
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
        <div className="card overflow-hidden border border-[#1E293B] shadow-lg flex flex-col">
          <div className="p-6 border-b border-[#1E293B] bg-[#0B0E14] flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>🏆</span> Top 10 Donors
            </h2>
            <span className="text-xs font-bold text-[#F5C518] bg-[#F5C518]/10 px-3 py-1 rounded-full border border-[#F5C518]/30">STABLECOINS</span>
          </div>
          <div className="p-0 flex-grow bg-[#050505] overflow-y-auto overflow-x-auto max-h-[400px] lg:max-h-full">
            <div className="min-w-[400px]">
              <table className="w-full text-left border-collapse relative">
              <thead className="bg-[#1E293B] sticky top-0 z-10 shadow-md">
                <tr>
                  <th className="py-3 px-6 text-[#94A3B8] font-bold text-xs uppercase tracking-wider">Rank</th>
                  <th className="py-3 px-6 text-[#94A3B8] font-bold text-xs uppercase tracking-wider">Donor</th>
                  <th className="py-3 px-6 text-[#94A3B8] font-bold text-xs uppercase tracking-wider text-right">Donated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {leaderboardLoading ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-[#94A3B8]">
                      <span className="animate-pulse flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-green"></span> Loading real-time blockchain data...
                      </span>
                    </td>
                  </tr>
                ) : leaderboardError ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-red-500">{leaderboardError}</td>
                  </tr>
                ) : topDonors.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-[#94A3B8]">
                      Be the first to donate and claim the #1 spot!
                    </td>
                  </tr>
                ) : (
                  topDonors.map((donor, idx) => (
                    <tr key={idx} className="hover:bg-[#1E293B]/50 transition-colors group">
                      <td className="py-4 px-6 text-white font-bold text-lg">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : <span className="text-[#94A3B8] text-sm font-mono">#{idx + 1}</span>}
                      </td>
                      <td className="py-4 px-6">
                        <a href={`https://celoscan.io/address/${donor.address}`} target="_blank" rel="noreferrer" title={donor.address} className="text-[#94A3B8] font-mono text-sm group-hover:text-white transition-colors">
                          {truncateAddress(donor.address)}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-[#F5C518] font-black">${donor.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div></div>
  );
}
