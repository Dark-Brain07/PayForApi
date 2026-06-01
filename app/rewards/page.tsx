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
  const [lastClaimTime, setLastClaimTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  
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

      const lastClaim = await creditsContract.lastClaimTime(address);
      setLastClaimTime(Number(lastClaim));

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

  useEffect(() => {
    if (!lastClaimTime) {
      setTimeRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const targetTime = lastClaimTime + 86400; // 24 hours in seconds

      if (now >= targetTime) {
        setTimeRemaining(null);
      } else {
        const diff = targetTime - now;
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setTimeRemaining(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
    
    // Initial call to avoid 1s delay
    const now = Math.floor(Date.now() / 1000);
    const targetTime = lastClaimTime + 86400;
    if (now < targetTime) {
      const diff = targetTime - now;
      setTimeRemaining(`${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m ${diff % 60}s`);
    } else {
      setTimeRemaining(null);
    }

    return () => clearInterval(interval);
  }, [lastClaimTime]);

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

        <div className="mb-12 max-w-4xl mx-auto bg-gradient-to-r from-[#F5C518]/20 via-[#F5C518]/5 to-transparent border border-[#F5C518]/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(245,197,24,0.1)]">
          <div className="absolute -top-10 -right-10 opacity-10">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor" className="text-[#F5C518]"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0 bg-[#F5C518]/20 p-5 rounded-full border border-[#F5C518]/50 shadow-[0_0_20px_rgba(245,197,24,0.3)]">
              <span className="text-5xl font-black text-[#F5C518] drop-shadow-md">7</span>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black text-white mb-2 tracking-tight">The 1,000 APIC Mega Bonus!</h3>
              <p className="text-[#F5C518]/90 text-lg font-medium leading-relaxed">
                Build your ultimate streak! Maintain a <strong className="text-[#F5C518] font-bold border-b border-[#F5C518]/40">7-day consecutive streak</strong> of BOTH claiming from the Faucet AND minting a Community NFT to automatically unlock a massive <strong className="text-[#F5C518] text-xl font-black">1,000 APIC</strong> bonus instantly dropped into your wallet on day 7!
              </p>
            </div>
          </div>
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
              disabled={isClaiming || !isConnected || timeRemaining !== null}
              className={`w-full py-4 text-lg font-bold rounded-xl transition-all ${
                timeRemaining !== null 
                ? "bg-[#1E293B] text-gray-400 border border-[#334155] cursor-not-allowed" 
                : "btn-primary"
              }`}
            >
              {isClaiming ? "Claiming..." : timeRemaining ? `Claim in ${timeRemaining}` : "Claim Daily Credits"}
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
