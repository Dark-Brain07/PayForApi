"use client";
import { useState, useEffect } from "react";
import TokenSelector from "./TokenSelector";
import { StablecoinKey, CELO_STABLECOINS, DEFAULT_TOKEN } from "@/lib/stablecoins";
import { useWallet } from "@/components/wallet/WalletContext";
import { ethers } from "ethers";
import { processPayment } from "@/lib/payment";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  onSuccess: (txHash: string, token: StablecoinKey) => void;
}

export default function PaymentModal({ isOpen, onClose, productId, productName, onSuccess }: PaymentModalProps) {
  const { isMiniPay, address } = useWallet();
  const [selectedToken, setSelectedToken] = useState<StablecoinKey>(DEFAULT_TOKEN);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isMiniPay) {
      setSelectedToken("cUSD");
    }
  }, [isMiniPay]);

  if (!isOpen) return null;

  const handlePay = async () => {
    if (!address) {
      setError("Please connect your wallet first.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const token = CELO_STABLECOINS[selectedToken];
        const requestId = ethers.id(Date.now().toString() + Math.random().toString());
        
        const receipt = await processPayment(
          provider,
          token.address,
          token.pricePerCall,
          productId,
          requestId
        );
        
        onSuccess(receipt.hash, selectedToken);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-brand-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Select Payment Token</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
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
        
        <div className="p-6 border-t border-brand-border bg-brand-elevated">
          <button 
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
        </div>
      </div>
    </div>
  );
}
