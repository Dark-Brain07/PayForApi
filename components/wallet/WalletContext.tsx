"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useMiniPay } from "@/hooks/useMiniPay";
import { EthereumProvider } from "@/hooks/useAuth";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  isMiniPay: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { isMiniPay, address: miniPayAddress } = useMiniPay();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (miniPayAddress) {
      setAddress(miniPayAddress);
    }
  }, [miniPayAddress]);

  const connect = async (): Promise<void> => {
    if (typeof window !== "undefined" && (window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum) {
      try {
        const accounts = await (window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum!.request({
          method: "eth_requestAccounts",
        });
        const accountsList = accounts as string[];
        if (accountsList && accountsList.length > 0) {
          setAddress(accountsList[0]);
        }
      } catch (error: any) {
        if (error?.code === 4001) {
          console.warn("User rejected connection request");
        } else {
          console.error("Failed to connect wallet", error);
        }
      }
    } else {
      console.error("Please install MetaMask or use MiniPay!");
    }
  };

  const disconnect = () => {
    setAddress(null);
  };

  return (
    <WalletContext.Provider value={{ address, isConnected: !!address, connect, disconnect, isMiniPay }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
