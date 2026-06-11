"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWallet } from "@/components/wallet/WalletContext";
import { ethers } from "ethers";
import { CONTRACTS } from "@/lib/contracts";
import { CELO_STABLECOINS } from "@/lib/stablecoins";

const truncateAddress = (addr: string) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

export default function Header() {
  const { address, isConnected, connect, disconnect, isMiniPay } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          try {
            const cusdBal = await cusdContract.balanceOf(address);
            setCusdBalance(Number(ethers.formatUnits(cusdBal, 18)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
          } catch (e) { console.warn("Failed cusd"); }

          try {
            const apicBal = await apicContract.balanceOf(address);
            setApicBalance(Number(ethers.formatUnits(apicBal, 18)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
          } catch (e) { console.warn("Failed apic"); }
        } catch (error) {
          // Silent catch for background fetching
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
              <img src="/logo.png" alt="Pay For API Logo" width={80} height={80} className="w-20 h-20 object-contain drop-shadow-xl" />
              <span className="font-bold text-xl text-white">
                Pay For <span className="text-brand-yellow">API</span>
              </span>
            </Link>
          </div>
          
          <nav aria-label="Main Navigation" className="hidden md:flex space-x-8 items-center">
            <Link href="/marketplace" className="text-text-secondary hover:text-brand-yellow hover:-translate-y-1 hover:scale-110 transition-all duration-300 inline-block">
              Marketplace
            </Link>
            <Link href="/chat" className="text-text-secondary hover:text-brand-yellow hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-2 font-semibold">
              <span>AI Chat</span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-brand-yellow to-[#FDE047] text-black text-[9px] font-black uppercase tracking-wider rounded-md shadow-[0_0_12px_rgba(245,197,24,0.6)]">New Released</span>
            </Link>
            <Link href="/rewards" className="text-brand-yellow/90 hover:text-brand-yellow hover:-translate-y-1 hover:scale-110 transition-all duration-300 inline-block font-bold drop-shadow-[0_0_8px_rgba(245,197,24,0.5)]">
              Rewards
            </Link>
            <Link href="/docs" className="text-text-secondary hover:text-brand-yellow hover:-translate-y-1 hover:scale-110 transition-all duration-300 inline-block">
              Docs
            </Link>
            <Link href="/explorer" className="text-text-secondary hover:text-brand-yellow hover:-translate-y-1 hover:scale-110 transition-all duration-300 inline-block">
              Explorer
            </Link>
            {isConnected && (
              <Link href="/dashboard" className="text-text-secondary hover:text-brand-yellow hover:-translate-y-1 hover:scale-110 transition-all duration-300 inline-block">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {isMiniPay && (
              <span title="MiniPay Wallet" className="hidden md:inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20">
                MiniPay
              </span>
            )}
            
            {isConnected ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
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
                  <Link href="/explorer" aria-label="Donate to Pay For API" className="w-full text-center py-1 bg-brand-yellow/10 hover:bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 rounded-lg text-[11px] font-bold transition-all shadow-[0_0_5px_rgba(245,197,24,0.1)] hover:shadow-[0_0_10px_rgba(245,197,24,0.2)]">
                    💖 Donate Us
                  </Link>
                </div>

                <div title={address || undefined} className="btn-secondary flex items-center space-x-1.5 sm:space-x-2 cursor-default px-2 sm:px-4 text-xs sm:text-base">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse shadow-[0_0_10px_#00E676]"></span>
                  <span className="font-medium">{address ? truncateAddress(address) : "Connected"}</span>
                </div>
                {!isMiniPay && (
                  <button 
                    type="button"
                    onClick={disconnect}
                    className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 px-2 py-2 sm:px-3 rounded-lg transition-colors text-xs sm:text-sm font-bold"
                  >
                    <span className="hidden sm:inline">Disconnect</span>
                    <span className="sm:hidden">Exit</span>
                  </button>
                )}
              </div>
            ) : (
              <button 
                type="button"
                aria-label="Connect Wallet"
                onClick={connect}
                className="btn-primary px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
              >
                Connect Wallet
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button 
              type="button"
              aria-label="Mobile Menu"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden text-[#94A3B8] hover:text-white transition-colors ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg aria-hidden="true" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#1E293B] py-4 pb-6 absolute left-0 right-0 bg-brand-black shadow-2xl px-4 z-40">
            <nav className="flex flex-col space-y-4">
              <Link href="/marketplace" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-brand-yellow hover:translate-x-2 transition-all duration-300 font-bold text-lg p-2 rounded-lg hover:bg-white/5 block">
                Marketplace
              </Link>
              <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-brand-yellow hover:translate-x-2 transition-all duration-300 font-semibold text-lg p-2 rounded-lg hover:bg-white/5 flex items-center justify-between">
                <span>AI Chat</span>
                <span className="px-2 py-1 bg-gradient-to-r from-brand-yellow/20 to-transparent text-brand-yellow text-[10px] font-black uppercase tracking-wider rounded border border-brand-yellow/30 shadow-[0_0_8px_rgba(245,197,24,0.3)]">New Released</span>
              </Link>
              <Link href="/rewards" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-yellow hover:text-brand-yellow hover:translate-x-2 transition-all duration-300 font-bold text-lg p-2 rounded-lg hover:bg-white/5 block drop-shadow-[0_0_8px_rgba(245,197,24,0.5)]">
                Rewards
              </Link>
              <Link href="/docs" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-brand-yellow hover:translate-x-2 transition-all duration-300 font-bold text-lg p-2 rounded-lg hover:bg-white/5 block">
                Docs
              </Link>
              <Link href="/explorer" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-brand-yellow hover:translate-x-2 transition-all duration-300 font-bold text-lg p-2 rounded-lg hover:bg-white/5 block">
                Explorer
              </Link>
              {isConnected && (
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-yellow font-black text-lg p-2 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20 hover:scale-[1.02] transition-transform duration-300 block">
                  Dashboard
                </Link>
              )}
            </nav>
            {isConnected && (
              <div className="mt-6 pt-6 border-t border-[#1E293B]">
                <div className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-3">Wallet Balances</div>
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center space-x-2">
                     <span className="text-[#00E676] font-black text-lg">{cusdBalance}</span>
                     <span className="text-[#94A3B8] font-bold text-sm">cUSD</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <span className="text-[#F5C518] font-black text-lg">{apicBalance}</span>
                     <span className="text-[#94A3B8] font-bold text-sm">APIC</span>
                   </div>
                </div>
                <Link href="/explorer" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/30 rounded-xl font-black shadow-[0_0_15px_rgba(245,197,24,0.15)] flex items-center justify-center gap-2">
                  <span>💖</span> Donate Us
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
