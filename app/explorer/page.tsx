"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACTS, CELO_MAINNET } from "@/lib/contracts";

export default function Explorer() {
  const [stats, setStats] = useState({ totalCalls: BigInt(0), totalRevenue: BigInt(0) });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const provider = new ethers.JsonRpcProvider(CELO_MAINNET.rpcUrl);
        const gateway = new ethers.Contract(CONTRACTS.API_GATEWAY.address, CONTRACTS.API_GATEWAY.abi, provider);
        
        // This will only work if the contract is deployed. Wrapping in try/catch.
        try {
          const totalCalls = await gateway.totalCalls();
          const totalRevenue = await gateway.totalRevenue();
          setStats({ totalCalls, totalRevenue });
        } catch (e) {
          console.log("Contract not deployed yet or error fetching stats", e);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Network Explorer</h1>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
          <span className="text-sm text-brand-green">Live on Celo Mainnet</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="card p-6">
          <h3 className="text-text-secondary mb-2">Total Network Calls</h3>
          <p className="text-4xl font-bold text-white">
            {loading ? "..." : stats.totalCalls.toString()}
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-text-secondary mb-2">Total Network Revenue</h3>
          <p className="text-4xl font-bold text-brand-green">
            {loading ? "..." : ethers.formatUnits(stats.totalRevenue, 18)} <span className="text-sm text-text-secondary">cUSD eq</span>
          </p>
        </div>
      </div>
      
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-brand-border">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
        </div>
        <div className="p-12 text-center text-text-secondary">
          {loading ? (
            <p>Loading transactions...</p>
          ) : (
            <p>Connect your wallet and make a transaction to see it appear here!</p>
          )}
        </div>
      </div>
    </div>
  );
}
