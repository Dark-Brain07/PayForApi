"use client";
import { useEffect, useState } from "react";

export function useMiniPay() {
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum && (window as any).ethereum.isMiniPay) {
      setIsMiniPay(true);
      const autoConnect = async () => {
        try {
          const accounts = await (window as any).ethereum.request({
            method: "eth_requestAccounts",
          });
          if (accounts?.length > 0) setAddress(accounts[0]);
        } catch (err) {
          console.error("[MiniPay] Auto-connect failed:", err);
        }
      };
      autoConnect();
    }
  }, []);

  return { isMiniPay, address };
}
