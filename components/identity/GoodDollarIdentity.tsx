"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/components/wallet/WalletContext";
import { ethers } from "ethers";
import { CONTRACTS } from "@/lib/contracts";

const DAILY_UBI_AMOUNT = 50;

export default function GoodDollarIdentity() {
  const { address, isConnected } = useWallet();
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [creditsClaimed, setCreditsClaimed] = useState(false);

  // Check local storage for verification status
  useEffect(() => {
    if (address) {
      const status = localStorage.getItem(`g$_verified_${address}`);
      if (status === "true") setIsVerified(true);
      
      const claimed = localStorage.getItem(`g$_claimed_${address}`);
      if (claimed === "true") setCreditsClaimed(true);
    } else {
      setIsVerified(false);
      setCreditsClaimed(false);
    }
  }, [address]);

  const handleVerify = async (): Promise<void> => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first.");
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate GoodDollar Identity SDK face-verification flow
    await Promise.resolve();
    setIsVerified(true);
    setIsVerifying(false);
    localStorage.setItem(`g$_verified_${address}`, "true");
  };

  const handleClaim = async (): Promise<void> => {
    if (!isVerified || !isConnected || !address) return;
    
    setIsClaiming(true);
    
    try {
      if (typeof window !== "undefined" && (window as { ethereum?: any }).ethereum) {
        const provider = new ethers.BrowserProvider((window as { ethereum?: any }).ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACTS.API_CREDITS.address,
          CONTRACTS.API_CREDITS.abi,
          signer
        );
        
        // Execute the on-chain claim transaction
        const tx = await contract.claim();
        await tx.wait();
        
        setCreditsClaimed(true);
        localStorage.setItem(`g$_claimed_${address}`, "true");
        alert(`Successfully claimed ${DAILY_UBI_AMOUNT} APIC daily UBI credits on-chain!`);
      } else {
        alert("Web3 wallet not detected.");
      }
    } catch (e: unknown) {
      const errObj = e as Record<string, any>;
      let errMsg = errObj.reason || errObj.message || "Unknown error";
      if (errMsg.includes("Wait 24 hours")) {
         errMsg = "You have already claimed your daily APIC UBI. Please wait 24 hours.";
         setCreditsClaimed(true);
         localStorage.setItem(`g$_claimed_${address}`, "true");
      }
      alert(`Claim failed: ${errMsg}`);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#0F172A] to-[#0B0E14] border border-[#1E293B] rounded-2xl mb-8 relative overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E676] opacity-5 rounded-full -mr-10 -mt-10 blur-3xl pointer-events-none"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2 mb-1">
            <span className="text-[#00E676]">G$</span> Identity Verification
          </h3>
          <p className="text-[#94A3B8] text-sm max-w-lg">
            Verify you are a unique human using GoodDollar's Sybil-resistant identity protocol. 
            Verified humans receive a daily "API UBI" of free APIC tokens.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
          {!isVerified ? (
            <button
              onClick={handleVerify}
              disabled={isVerifying || !isConnected}
              className="px-6 py-3 bg-[#00E676] hover:bg-[#00C853] text-black font-black rounded-lg transition-all shadow-[0_0_15px_rgba(0,230,118,0.3)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
            >
              {isVerifying ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                  Verifying...
                </>
              ) : (
                "Verify as Human"
              )}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="px-6 py-2 bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676] font-bold rounded-lg text-center flex items-center justify-center gap-2">
                <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                Verified Human
              </div>
              {!creditsClaimed ? (
                <button
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="px-6 py-2 bg-brand-yellow hover:bg-yellow-400 text-black font-black rounded-lg transition-all shadow-[0_0_15px_rgba(245,197,24,0.3)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm flex justify-center items-center gap-2"
                >
                  {isClaiming ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                      Claiming...
                    </>
                  ) : (
                    "Claim Daily UBI"
                  )}
                </button>
              ) : (
                <div className="px-6 py-2 bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-sm font-bold rounded-lg text-center">
                  Daily UBI Claimed
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
