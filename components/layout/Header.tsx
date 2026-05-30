"use client";
import Link from "next/link";
import { useWallet } from "@/components/wallet/WalletContext";

export default function Header() {
  const { address, isConnected, connect, disconnect, isMiniPay } = useWallet();

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="border-b border-brand-border bg-brand-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🚀</span>
              <span className="font-bold text-xl text-white">
                Pay For <span className="text-brand-yellow">API</span>
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
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
              <button 
                onClick={disconnect}
                className="btn-secondary flex items-center space-x-2"
              >
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                <span>{address ? truncateAddress(address) : "Connected"}</span>
              </button>
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
