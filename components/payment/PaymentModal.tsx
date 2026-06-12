"use client";
import { useState, useEffect } from "react";
import TokenSelector from "./TokenSelector";
import { StablecoinKey, CELO_STABLECOINS, DEFAULT_TOKEN } from "@/lib/stablecoins";
import { useWallet } from "@/components/wallet/WalletContext";
import { ethers } from "ethers";
import { processPayment } from "@/lib/payment";

import { CONTRACTS } from "@/lib/contracts";
import { EthereumProvider } from "@/hooks/useAuth";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  priceCredits?: number;
  onSuccess: (txHash: string, token: string) => void;
}

export default function PaymentModal({ isOpen, onClose, productId, productName, priceCredits, onSuccess }: PaymentModalProps) {
  const { isMiniPay, address } = useWallet();
  const [selectedToken, setSelectedToken] = useState<StablecoinKey>(DEFAULT_TOKEN);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isMiniPay) {
      setSelectedToken("USDC"); // MiniPay natively supports USDC, USDT, USDm
    }
  }, [isMiniPay]);

  if (!isOpen) return null;

  const handlePay = async (): Promise<void> => {
    if (!address) {
      setError("Please connect your wallet first.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      if (typeof window !== "undefined" && (window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum) {
        const provider = new ethers.BrowserProvider((window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum!);
        const token = CELO_STABLECOINS[selectedToken];
        const requestId = ethers.id(Date.now().toString() + Math.random().toString());
        
        const receipt = await processPayment(
          provider,
          token.address,
          token.pricePerCall,
          productId,
          requestId,
          isMiniPay,
          token.decimals
        );
        
        onSuccess(receipt.hash, selectedToken);
      } else {
        throw new Error("No web3 wallet detected. Please install a wallet.");
      }
    } catch (error: unknown) {
      console.error(error);
      const err = error as Record<string, unknown>;
      let errorMessage = (err?.reason as string) || (err?.message as string) || "Payment failed. Please try again.";
      if (errorMessage.includes("transfer amount exceeds balance")) {
        errorMessage = "Transaction failed: Insufficient balance. Please top up your wallet.";
      }
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayCredits = async (): Promise<void> => {
    if (!address) {
      setError("Please connect your wallet first.");
      return;
    }
    if (!priceCredits) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      if (typeof window !== "undefined" && (window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum) {
        const provider = new ethers.BrowserProvider((window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum!);
        const requestId = ethers.id(Date.now().toString() + Math.random().toString());
        
        const receipt = await processPayment(
          provider,
          CONTRACTS.API_CREDITS.address,
          priceCredits.toString(),
          productId,
          requestId,
          isMiniPay,
          18 // APIC uses 18 decimals
        );
        
        onSuccess(receipt.hash, "APIC");
      } else {
        throw new Error("No web3 wallet detected. Please install a wallet.");
      }
    } catch (error: unknown) {
      console.error(error);
      const err = error as Record<string, unknown>;
      let errorMessage = (err?.reason as string) || (err?.message as string) || "Credit payment failed. Please try again.";
      if (errorMessage.includes("transfer amount exceeds balance")) {
        errorMessage = "Transaction failed: Insufficient APIC balance. Please top up your credits.";
      }
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby="payment-modal-title" className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-brand-border flex justify-between items-center shrink-0">
          <h2 id="payment-modal-title" className="text-xl font-bold text-white">Select Payment Method</h2>
          <button type="button" aria-label="Close modal" onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            ✕
          </button>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="mb-6 flex justify-between items-center bg-brand-elevated p-4 rounded-xl border border-brand-border text-sm">
            <span className="text-text-secondary">API Product:</span>
            <span className="font-bold text-white">{productName}</span>
          </div>
          
          <TokenSelector selectedToken={selectedToken} onSelect={setSelectedToken} />
          
          {error && (
            <div className="mt-4 p-3 bg-error/10 border border-error/20 text-error rounded-lg text-sm text-center">
              {error}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-brand-border bg-brand-elevated space-y-3 shrink-0">
          <button 
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full btn-primary py-4 text-lg flex justify-center items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                <span>Processing on Celo...</span>
              </>
            ) : (
              <span>Pay {CELO_STABLECOINS[selectedToken].pricePerCall} {CELO_STABLECOINS[selectedToken].symbol}</span>
            )}
          </button>
          
          {priceCredits && (
            <button 
              type="button"
              onClick={handlePayCredits}
              disabled={isProcessing}
              className="w-full bg-brand-yellow/10 border border-brand-yellow/30 hover:bg-brand-yellow/20 text-brand-yellow font-bold py-4 rounded-xl transition-colors text-lg flex justify-center items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-5 h-5 border-2 border-brand-yellow/20 border-t-brand-yellow rounded-full animate-spin"></span>
                  <span>Processing Credits...</span>
                </>
              ) : (
                <span>Pay with {priceCredits} APIC</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
