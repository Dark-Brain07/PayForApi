"use client";
import { useWallet } from "@/components/wallet/WalletContext";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACTS, CELO_MAINNET } from "@/lib/contracts";

export default function Dashboard() {
  const { address, isConnected } = useWallet();
  const [stats, setStats] = useState({ calls: BigInt(0), spent: BigInt(0) });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!address || typeof window === "undefined" || !(window as any).ethereum) return;
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const gateway = new ethers.Contract(CONTRACTS.API_GATEWAY.address, CONTRACTS.API_GATEWAY.abi, provider);
        const [calls, spent] = await gateway.getUserStats(address);
        setStats({ calls, spent });
      } catch (err) {
        console.error(err);
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
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-text-secondary">Please connect your wallet to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-6">
          <h3 className="text-text-secondary mb-2">Connected Address</h3>
          <p className="font-mono text-white text-sm break-all">{address}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-text-secondary mb-2">Total API Calls</h3>
          <p className="text-3xl font-bold text-brand-yellow">
            {loading ? "..." : stats.calls.toString()}
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-text-secondary mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-brand-green">
            {loading ? "..." : ethers.formatUnits(stats.spent, 18)} <span className="text-sm text-text-secondary">cUSD eq</span>
          </p>
        </div>
      </div>
      
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-6">Your API Key</h2>
        <p className="text-text-secondary mb-4">
          With Pay For API, your wallet address is your API key. Just pass it in the headers along with the transaction hash of your payment.
        </p>
        <div className="bg-brand-input border border-brand-border p-4 rounded-lg flex justify-between items-center">
          <span className="font-mono text-brand-green">{address}</span>
          <button className="btn-secondary py-1" onClick={() => navigator.clipboard.writeText(address || "")}>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
