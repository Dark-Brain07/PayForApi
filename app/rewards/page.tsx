"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@/components/wallet/WalletContext";
import { ethers } from "ethers";
import { CONTRACTS } from "@/lib/contracts";

export default function Rewards() {
  const { address, isConnected } = useWallet();
  const [balance, setBalance] = useState<string>("0");
  const [nftsMinted, setNftsMinted] = useState<string>("0");
  const [isClaiming, setIsClaiming] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const MAX_SUPPLY = 100000;

  const fetchStats = async () => {
    if (!address || typeof window === "undefined" || !(window as any).ethereum) return;
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      
      const creditsContract = new ethers.Contract(
        CONTRACTS.API_CREDITS.address,
        CONTRACTS.API_CREDITS.abi,
        provider
      );
      
      const nftContract = new ethers.Contract(
        CONTRACTS.COMMUNITY_NFT.address,
        CONTRACTS.COMMUNITY_NFT.abi,
        provider
      );

      const bal = await creditsContract.balanceOf(address);
      setBalance(ethers.formatUnits(bal, 18));

      const minted = await nftContract.totalSupply();
      setNftsMinted(minted.toString());
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchStats();
      // Poll every 10 seconds
      const interval = setInterval(fetchStats, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected, address]);

  const handleClaim = async () => {
    if (!isConnected) return setError("Connect wallet first!");
    setError(null);
    setSuccess(null);
    setIsClaiming(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACTS.API_CREDITS.address,
        CONTRACTS.API_CREDITS.abi,
        signer
      );
      const tx = await contract.claim();
      await tx.wait();
      setSuccess("Successfully claimed your API credits!");
      fetchStats();
    } catch (err: any) {
      setError(err.reason || err.message || "Failed to claim credits.");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleMint = async () => {
    if (!isConnected) return setError("Connect wallet first!");
    setError(null);
    setSuccess(null);
    setIsMinting(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACTS.COMMUNITY_NFT.address,
        CONTRACTS.COMMUNITY_NFT.abi,
        signer
      );
      const tx = await contract.mint(1); // Minting 1 NFT
      await tx.wait();
      setSuccess("Successfully minted your Community NFT!");
      fetchStats();
    } catch (err: any) {
      setError(err.reason || err.message || "Failed to mint NFT.");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen pt-16">
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black mb-4 text-white font-sans tracking-tight">Rewards & Ecosystem</h1>
          <p className="text-text-secondary text-lg">Claim free API credits and mint community NFTs daily to earn massive streaks.</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-center font-medium max-w-2xl mx-auto">{error}</div>}
        {success && <div className="mb-6 p-4 bg-brand-green/10 border border-brand-green/50 text-brand-green rounded-xl text-center font-medium max-w-2xl mx-auto">{success}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Faucet Card */}
          <div className="card p-8 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/5 to-transparent pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity"></div>
            <h2 className="text-2xl font-bold text-white mb-2">API Credits Faucet</h2>
            <p className="text-text-secondary mb-8">Get 100 APIC on your first visit, and 50 APIC every 24 hours.</p>
            
            <div className="bg-brand-elevated border border-brand-border rounded-2xl p-6 w-full mb-8">
              <span className="block text-sm text-text-secondary mb-1">Your APIC Balance</span>
              <span className="text-4xl font-black text-brand-yellow">{isConnected ? Number(balance).toFixed(2) : "0.00"}</span>
            </div>

            <button 
              onClick={handleClaim} 
              disabled={isClaiming || !isConnected}
              className="w-full btn-primary py-4 text-lg"
            >
              {isClaiming ? "Claiming..." : "Claim Daily Credits"}
            </button>
          </div>

          {/* NFT Card */}
          <div className="card p-8 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-transparent pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Community NFT</h2>
            <p className="text-text-secondary mb-8">Mint unlimited NFTs. Keep a 7-day streak for a 1,000 APIC bonus.</p>
            
            <div className="bg-brand-elevated border border-brand-border rounded-2xl p-6 w-full mb-8">
              <span className="block text-sm text-text-secondary mb-1">NFTs Remaining</span>
              <span className="text-4xl font-black text-brand-green">{isConnected ? (MAX_SUPPLY - parseInt(nftsMinted)).toLocaleString() : MAX_SUPPLY.toLocaleString()}</span>
            </div>

            <button 
              onClick={handleMint} 
              disabled={isMinting || !isConnected}
              className="w-full bg-brand-green/10 border border-brand-green text-brand-green hover:bg-brand-green/20 font-bold px-4 py-4 rounded-lg transition-colors disabled:opacity-50 text-lg"
            >
              {isMinting ? "Minting..." : "Mint 1 NFT"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
