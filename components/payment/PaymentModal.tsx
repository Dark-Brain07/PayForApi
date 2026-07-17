"use client";
import React, { useState, useEffect } from "react";
import TokenSelector from "./TokenSelector";
import { StablecoinKey, CELO_STABLECOINS, DEFAULT_TOKEN } from "@/lib/stablecoins";
import { useWallet } from "@/components/wallet/WalletContext";
import { ethers } from "ethers";
import { processPayment } from "@/lib/payment";

import { CONTRACTS } from "@/lib/contracts";
import { EthereumProvider } from "@/hooks/useAuth";

const MODAL_CONTAINER_CLASSES = "bg-brand-card border border-brand-border rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]";
const SPINNER_CLASSES = "w-5 h-5 border-2 rounded-full animate-spin";

/** Props for the PaymentModal component handling x402 transactions */
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  priceCredits?: number;
  onSuccess: (txHash: string, token: string) => void;
}

/** Modal component for handling crypto token payments */
export default function PaymentModal({ isOpen, onClose, productId, productName, priceCredits, onSuccess }: PaymentModalProps): React.JSX.Element | null {
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
    const ZERO_ADDRESS = ethers.ZeroAddress;
    if (!address || address === ZERO_ADDRESS) {
      setError("Please connect a valid wallet first.");
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
      const err = error as Record<string, unknown>;
      let errorMessage = (err?.reason as string) || (err?.message as string) || "Payment failed. Please try again.";
      if (typeof errorMessage === "string" && errorMessage.includes("transfer amount exceeds balance")) {
        errorMessage = "Transaction failed: Insufficient balance. Please top up your wallet.";
      }
      setError(String(errorMessage));
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayCredits = async (): Promise<void> => {
    if (!address || address === "0x0000000000000000000000000000000000000000") {
      setError("Please connect a valid wallet first.");
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
      const err = error as Record<string, unknown>;
      let errorMessage = (err?.reason as string) || (err?.message as string) || "Credit payment failed. Please try again.";
      if (typeof errorMessage === "string" && errorMessage.includes("transfer amount exceeds balance")) {
        errorMessage = "Transaction failed: Insufficient APIC balance. Please top up your credits.";
      }
      setError(String(errorMessage));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby="payment-modal-title" className={MODAL_CONTAINER_CLASSES}>
        <div className="p-6 border-b border-brand-border flex justify-between items-center shrink-0">
          <h2 id="payment-modal-title" className="text-xl font-bold text-white">Select Payment Method</h2>
          <button type="button" aria-label="Close Payment Modal" title="Close" onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="mb-6 flex justify-between items-center bg-brand-elevated p-4 rounded-xl border border-brand-border text-sm">
            <span className="text-text-secondary">API Product:</span>
            <span className="font-bold text-white" title={productName}>{productName}</span>
          </div>
          
          <TokenSelector selectedToken={selectedToken} onSelect={setSelectedToken} />
          
          {error && (
            <div role="alert" className="mt-4 p-3 bg-error/10 border border-error/20 text-error rounded-lg text-sm text-center">
              {error}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-brand-border bg-brand-elevated space-y-3 shrink-0">
          <button aria-label="Confirm Payment"
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            aria-label="Confirm Payment"
            className="w-full btn-primary py-4 text-lg flex justify-center items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <span aria-hidden="true" className={`${SPINNER_CLASSES} border-black/20 border-t-black`}></span>
                <span aria-live="polite" role="status">Processing on Celo...</span>
              </>
            ) : (
              <span>Pay {CELO_STABLECOINS[selectedToken].pricePerCall} {CELO_STABLECOINS[selectedToken].symbol}</span>
            )}
          </button>
          
          {priceCredits && (
            <button 
              type="button"
              aria-label="Confirm Credit Payment"
              onClick={handlePayCredits}
              disabled={isProcessing}
              className="w-full bg-brand-yellow/10 border border-brand-yellow/30 hover:bg-brand-yellow/20 text-brand-yellow font-bold py-4 rounded-xl transition-colors text-lg flex justify-center items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <span className={`${SPINNER_CLASSES} border-brand-yellow/20 border-t-brand-yellow`}></span>
                  <span aria-live="polite" role="status">Processing Credits...</span>
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
