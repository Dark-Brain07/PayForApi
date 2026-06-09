"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum?: {
      isMiniPay?: boolean;
      request: (args: { method: string }) => Promise<string[]>;
    };
  }
}

export function useMiniPay() {
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum && window.ethereum.isMiniPay) {
      setIsMiniPay(true);
      const autoConnect = async () => {
        try {
          const accounts = await window.ethereum!.request({
            method: "eth_requestAccounts",
          });
          if (accounts && accounts.length > 0) setAddress(accounts[0]);
        } catch (err) {
          console.error("[MiniPay] Auto-connect failed:", err);
        }
      };
      autoConnect();
    }
  }, []);

  return { isMiniPay, address };
}
