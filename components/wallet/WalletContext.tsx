"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useMiniPay } from "@/hooks/useMiniPay";
import { EthereumProvider } from "@/hooks/useAuth";
import { useAccount, useDisconnect } from "wagmi";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  isMiniPay: boolean;
}

const INITIAL_STATE = undefined;
const WalletContext = createContext<WalletContextType | undefined>(INITIAL_STATE);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { isMiniPay, address: miniPayAddress } = useMiniPay();
  const [address, setAddress] = useState<string | null>(null);
  const { address: wagmiAddress } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  useEffect(() => {
    if (miniPayAddress) {
      setAddress(miniPayAddress);
    } else if (wagmiAddress) {
      setAddress(wagmiAddress);
    } else {
      setAddress(null);
    }
  }, [miniPayAddress, wagmiAddress]);

  const connect = async (): Promise<void> => {
    if (typeof window !== "undefined" && (window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum) {
      try {
        const REQUEST_ACCOUNTS_METHOD = "eth_requestAccounts";
        const accounts = await (window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum!.request({
          method: REQUEST_ACCOUNTS_METHOD,
        });
        const accountsList = accounts as string[];
        if (accountsList && accountsList.length > 0) {
          setAddress(accountsList[0]);
        }
      } catch (error: unknown) {
        const USER_REJECTED_CODE = 4001;
        if (error?.code === USER_REJECTED_CODE) {
          // User rejected, silent catch
        } else {
          // Silent catch for connect failure
        }
      }
    } else {
      // Silent catch
    }
  };

  const disconnect = () => {
    setAddress(null);
    try {
      wagmiDisconnect();
    } catch (e) {}
  };

  return (
    <WalletContext.Provider value={{ address, isConnected: !!address, connect, disconnect, isMiniPay }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
