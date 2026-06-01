"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWallet } from "@/components/wallet/WalletContext";
import { ethers } from "ethers";
import { CONTRACTS } from "@/lib/contracts";
import { CELO_STABLECOINS } from "@/lib/stablecoins";

export default function Header() {
  const { address, isConnected, connect, disconnect, isMiniPay } = useWallet();

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const [cusdBalance, setCusdBalance] = useState<string>("0.00");
  const [apicBalance, setApicBalance] = useState<string>("0.00");

  useEffect(() => {
    const fetchBalances = async () => {
      if (isConnected && address && typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          
          const cusdContract = new ethers.Contract(
            CELO_STABLECOINS.cUSD.address,
            ["function balanceOf(address) view returns (uint256)"],
            provider
          );
          
          const apicContract = new ethers.Contract(
            CONTRACTS.API_CREDITS.address,
            CONTRACTS.API_CREDITS.abi,
            provider
          );

          const cusdBal = await cusdContract.balanceOf(address);
          const apicBal = await apicContract.balanceOf(address);

          setCusdBalance(Number(ethers.formatUnits(cusdBal, 18)).toFixed(2));
          setApicBalance(Number(ethers.formatUnits(apicBal, 18)).toFixed(2));
        } catch (error) {
          console.error("Failed to fetch balances", error);
        }
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 10000);
    return () => clearInterval(interval);
  }, [isConnected, address]);

  return (
    <header className="bg-brand-black sticky top-0 z-50">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="Pay For API Logo" className="w-20 h-20 object-contain drop-shadow-xl" />
              <span className="font-bold text-xl text-white">
                Pay For <span className="text-brand-yellow">API</span>
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/marketplace" className="text-text-secondary hover:text-brand-yellow transition-colors">
              Marketplace
            </Link>
            <Link href="/rewards" className="text-text-secondary hover:text-brand-yellow transition-colors">
              Rewards
            </Link>
            <Link href="/docs" className="text-text-secondary hover:text-brand-yellow transition-colors">
              Docs
            </Link>
            <Link href="/explorer" className="text-text-secondary hover:text-brand-yellow transition-colors">
              Explorer
            </Link>
            {isConnected && (
              <Link href="/dashboard" className="text-text-secondary hover:text-brand-yellow transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isMiniPay && (
              <span className="hidden md:inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20">
                MiniPay
              </span>
            )}
            
            {isConnected ? (
              <div className="flex items-center space-x-3">
                {/* Balances & Donate Display */}
                <div className="hidden lg:flex flex-col items-center gap-1.5">
                  <div className="flex items-center space-x-2 bg-[#0B0E14] border border-[#1E293B] rounded-xl p-1 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center px-2 py-1 bg-gradient-to-r from-[#00E676]/10 to-transparent rounded-lg border border-[#00E676]/20 transition-all hover:border-[#00E676]/40">
                      <span className="text-[#00E676] font-black text-xs mr-1 drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]">{cusdBalance}</span>
                      <span className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider">cUSD</span>
                    </div>
                    <div className="flex items-center px-2 py-1 bg-gradient-to-r from-[#F5C518]/10 to-transparent rounded-lg border border-[#F5C518]/20 transition-all hover:border-[#F5C518]/40">
                      <span className="text-[#F5C518] font-black text-xs mr-1 drop-shadow-[0_0_8px_rgba(245,197,24,0.5)]">{apicBalance}</span>
                      <span className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider">APIC</span>
                    </div>
                  </div>
                  <Link href="/explorer" className="w-full text-center py-1 bg-brand-yellow/10 hover:bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 rounded-lg text-[11px] font-bold transition-all shadow-[0_0_5px_rgba(245,197,24,0.1)] hover:shadow-[0_0_10px_rgba(245,197,24,0.2)]">
                    💖 Donate Us
                  </Link>
                </div>

                <div className="btn-secondary flex items-center space-x-2 cursor-default">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse shadow-[0_0_10px_#00E676]"></span>
                  <span className="font-medium">{address ? truncateAddress(address) : "Connected"}</span>
                </div>
                {!isMiniPay && (
                  <button 
                    onClick={disconnect}
                    className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 px-3 py-2 rounded-lg transition-colors text-sm font-bold"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            ) : (
              <button 
                onClick={connect}
                className="btn-primary"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
