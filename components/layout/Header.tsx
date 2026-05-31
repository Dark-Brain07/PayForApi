"use client";
import Link from "next/link";
import { useWallet } from "@/components/wallet/WalletContext";

export default function Header() {
  const { address, isConnected, connect, disconnect, isMiniPay } = useWallet();

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

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
              <div className="flex items-center space-x-2">
                <div className="btn-secondary flex items-center space-x-2 cursor-default">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                  <span>{address ? truncateAddress(address) : "Connected"}</span>
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
