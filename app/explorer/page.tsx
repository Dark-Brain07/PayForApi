"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACTS, CELO_MAINNET, MASTER_MERCHANT_WALLET, ECOSYSTEM_DONATION_WALLET } from "@/lib/contracts";
import { CELO_STABLECOINS } from "@/lib/stablecoins";

interface DonorInfo {
  address: string;
  amount: number;
}

const ERC20_BALANCE_ABI = ["function balanceOf(address) view returns (uint256)"] as const;

const STATS_POLL_INTERVAL_MS = 15000;
const BLOCKS_TO_QUERY = 2000000;

/**
 * Shortens an EVM address to the format 0x1234...abcd
 */
const truncateAddress = (addr: string): string => {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

/**
 * Network explorer view showing total ecosystem revenue and top donors.
 */
export default function Explorer() {
  const [stats, setStats] = useState({ revenueUsdm: "0.00", revenueApic: "0.00" });
  const [topDonors, setTopDonors] = useState<DonorInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchStats(): Promise<void> {
      try {
        const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
        const receiverAddress = MASTER_MERCHANT_WALLET;

        const erc20Abi = ERC20_BALANCE_ABI;
        const usdmContract = new ethers.Contract(CELO_STABLECOINS.USDm.address, erc20Abi, provider);
        const apicContract = new ethers.Contract(CONTRACTS.API_CREDITS.address, erc20Abi, provider);

        let usdmBal: bigint = 0n;
        let apicBal: bigint = 0n;
        try {
          usdmBal = await usdmContract.balanceOf(receiverAddress).catch(() => 0n);
          apicBal = await apicContract.balanceOf(receiverAddress).catch(() => 0n);
        } catch (e) {
          // Silent fallback
        }

        let revenueUsdmStr = "0.00";
        let revenueApicStr = "0.00";
        try {
          revenueUsdmStr = Number(ethers.formatUnits(usdmBal, 18)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
          revenueApicStr = Number(ethers.formatUnits(apicBal, 18)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        } catch (e) {
          // Silent catch
        }

        setStats({ 
          revenueUsdm: revenueUsdmStr,
          revenueApic: revenueApicStr
        });
      } catch (err) {
        setStats({ revenueUsdm: "Error", revenueApic: "Error" });
      } finally {
        setLoading(false);
      }
    }

    async function fetchLeaderboard(): Promise<void> {
      try {
        const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
        const donationWallet = ECOSYSTEM_DONATION_WALLET;
        
        const erc20Abi = ["event Transfer(address indexed from, address indexed to, uint256 value)"];
        const usdmContract = new ethers.Contract(CELO_STABLECOINS.USDm.address, erc20Abi, provider);
        
        // Query last ~2 million blocks (about 1 month of Celo blocks)
        const currentBlock = await provider.getBlockNumber().catch(() => 0);
        const fromBlock = Math.max(0, currentBlock - BLOCKS_TO_QUERY);
        
        const filter = usdmContract.filters.Transfer(null, donationWallet);
        const events = (await usdmContract.queryFilter(filter, fromBlock, "latest")) || [];
        
        const donations: Record<string, number> = {};
        
        interface TransferLog { args: { from: string; value: bigint } }
        events.forEach((event: unknown) => {
          const log = event as TransferLog;
          const from = log.args.from;
          const amount = Number(ethers.formatUnits(log.args.value, 18));
          
          if (donations[from]) {
            donations[from] += amount;
          } else {
            donations[from] = amount;
          }
        });
        
        const sortedDonors: DonorInfo[] = Object.keys(donations)
          .map((address: string): DonorInfo => ({ address, amount: donations[address] }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 10);
          
        setTopDonors(sortedDonors);
      } catch (error: unknown) {
        setLeaderboardError((error as Error)?.message?.includes("network") ? "Network error: Failed to connect to Celo" : "Failed to load leaderboard");
      } finally {
        setLeaderboardLoading(false);
      }
    }

    fetchStats();
    fetchLeaderboard();
    const interval = setInterval(fetchStats, STATS_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black py-12 flex flex-col pt-16"><div className="max-w-7xl mx-auto px-4 w-full">
      <title>Network Explorer | PayForAPI</title>
      <meta name="description" content="View global statistics and top donors for the PayForAPI network." />
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight">Network Explorer</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="card p-8 border border-[#1E293B] shadow-xl relative overflow-hidden group hover:border-[#334155] transition-all flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00E676]/5 to-transparent opacity-50"></div>
          <div className="absolute -top-10 -right-10 opacity-5">
            <svg aria-hidden="true" width="200" height="200" viewBox="0 0 24 24" fill="currentColor" className="text-[#00E676]"><title>Revenue Icon</title><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
          <h3 className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider mb-4 relative z-10">Total Network Revenue (USDm)</h3>
          <p aria-label="Total Celo USD Revenue" className="text-6xl font-black text-[#00E676] drop-shadow-[0_0_15px_rgba(0,230,118,0.4)] relative z-10 flex items-baseline justify-center gap-2">
            {loading ? <span aria-live="polite" className="animate-pulse">...</span> : stats.revenueUsdm}
            <span className="text-xl text-[#00E676]/70">USDm</span>
          </p>
        </div>

        <div className="card p-8 border border-[#1E293B] shadow-xl relative overflow-hidden group hover:border-[#334155] transition-all flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5C518]/5 to-transparent opacity-50"></div>
          <div className="absolute -top-10 -right-10 opacity-5">
            <svg aria-hidden="true" width="200" height="200" viewBox="0 0 24 24" fill="currentColor" className="text-[#F5C518]"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
          </div>
          <h3 className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider mb-4 relative z-10">Total Network Revenue (APIC)</h3>
          <p aria-label="Total APIC Revenue" className="text-6xl font-black text-[#F5C518] drop-shadow-[0_0_15px_rgba(245,197,24,0.4)] relative z-10 flex items-baseline justify-center gap-2">
            {loading ? <span aria-live="polite" className="animate-pulse">...</span> : stats.revenueApic}
            <span className="text-xl text-[#F5C518]/70">APIC</span>
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 items-start">
        {/* Support The Ecosystem (Left Half) */}
        <div className="card overflow-hidden border border-[#1E293B] shadow-lg flex flex-col">
          <div className="p-6 border-b border-[#1E293B] bg-[#0B0E14] text-center sm:text-left shrink-0">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2">
              <span role="img" aria-label="Support Heart">💖</span> Support The Ecosystem
            </h2>
          </div>
          <div className="p-8 text-center text-[#94A3B8] bg-brand-elevated flex-grow flex flex-col justify-center">
            <p className="text-base mb-8 text-white/90 max-w-lg mx-auto leading-relaxed">
              Love using Pay For API? Help us keep building and making the application even better! Your generous donations directly fund advanced AI integrations, faster nodes, and continuous upgrades.
            </p>
            <div className="flex flex-col xl:flex-row justify-center items-center gap-4 w-full">
              <div className="bg-[#050505] border border-[#1E293B] px-3 sm:px-4 py-3 rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] text-[#00E676] font-mono text-xs sm:text-sm truncate w-full max-w-sm text-center" title={MASTER_MERCHANT_WALLET}>
                {MASTER_MERCHANT_WALLET}
              </div>
              <button 
                type="button"
                aria-label="Copy Master Ecosystem Wallet Address"
                className="bg-brand-yellow/10 border border-brand-yellow/40 hover:bg-brand-yellow/20 text-brand-yellow px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,197,24,0.15)] hover:shadow-[0_0_20px_rgba(245,197,24,0.3)] whitespace-nowrap w-full xl:w-auto shrink-0"
                onClick={() => {
                  if (typeof window === "undefined" || !navigator?.clipboard) return;
                  try {
                    navigator.clipboard.writeText(MASTER_MERCHANT_WALLET);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch (e) {
                    // Silently fail
                  }
                }}
              >
                {copied ? "Copied!" : "Copy Wallet"}
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
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
            <div className="flex gap-3 items-center">
              <button type="button" title="Refresh leaderboard" onClick={() => window.location.reload()} disabled={leaderboardLoading} className="text-xs text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><span aria-hidden="true">↻</span> Refresh</button>
              <span className="text-xs font-bold text-[#F5C518] bg-[#F5C518]/10 px-3 py-1 rounded-full border border-[#F5C518]/30">STABLECOINS</span>
            </div>
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
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse" aria-hidden="true">
                      <td className="py-4 px-6"><div className="h-6 w-6 bg-gradient-to-r from-[#1E293B] to-[#334155] rounded"><span className="sr-only">Loading rank...</span></div></td>
                      <td className="py-4 px-6"><div className="h-4 w-32 bg-gradient-to-r from-[#1E293B] to-[#334155] rounded"><span className="sr-only">Loading address...</span></div></td>
                      <td className="py-4 px-6 flex justify-end"><div className="h-4 w-16 bg-gradient-to-r from-[#1E293B] to-[#334155] rounded"><span className="sr-only">Loading amount...</span></div></td>
                    </tr>
                  ))
                ) : leaderboardError ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-red-500">{leaderboardError}</td>
                  </tr>
                ) : !topDonors || topDonors.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <span className="text-4xl" role="img" aria-label="Star">🌟</span>
                        <p className="text-[#94A3B8] font-medium">Be the first to donate and claim the #1 spot!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  topDonors?.map((donor, idx) => (
                    <tr key={idx} className="hover:bg-[#1E293B]/50 transition-colors group">
                      <td className="py-4 px-6 text-white font-bold text-lg">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : <span className="text-[#94A3B8] text-sm font-mono">#{idx + 1}</span>}
                      </td>
                      <td className="py-4 px-6">
                        <a href={`https://celoscan.io/address/${donor.address}`} target="_blank" rel="noopener noreferrer" aria-label={`View donor address ${donor.address} on Celo explorer`} title={donor.address} className="text-[#94A3B8] font-mono text-sm group-hover:text-white transition-colors">
                          {truncateAddress(donor.address)}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-[#F5C518] font-black">${donor.amount.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4})}</span>
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
