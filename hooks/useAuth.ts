"use client";
import { useState, useCallback, useEffect } from "react";

export interface AuthState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  isMiniPay: boolean;
  isConnecting: boolean;
  error: string | null;
}

const CELO_CHAIN_ID = 42220;

/**
 * Generic EVM wallet auth hook. Auto-detects MiniPay.
 * For MiniPay-specific logic use useMiniPay.ts instead.
 */
export function useAuth(): AuthState & {
  connect: () => Promise<string | null>;
  disconnect: () => void;
  switchToCelo: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({
    address: null,
    isConnected: false,
    chainId: null,
    isMiniPay: false,
    isConnecting: false,
    error: null,
  });

  // Detect MiniPay on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum?.isMiniPay) {
      setState((s) => ({ ...s, isMiniPay: true }));
    }
  }, []);

  /** Prompt user to connect their EVM wallet */
  const connect = useCallback(async (): Promise<string | null> => {
    if (typeof window === "undefined" || !window.ethereum) {
      setState((s) => ({ ...s, error: "No wallet detected" }));
      return null;
    }
    setState((s) => ({ ...s, isConnecting: true, error: null }));
    try {
      const accounts = (await (window.ethereum as { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> }).request({
        method: "eth_requestAccounts",
      })) as string[];
      const chainHex = (await (window.ethereum as { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> }).request({
        method: "eth_chainId",
      })) as string;
      const chainId = parseInt(chainHex, 16);
      const address = accounts[0];
      setState((s) => ({
        ...s,
        address,
        isConnected: true,
        chainId,
        isConnecting: false,
      }));
      return address;
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : String(err),
        isConnecting: false,
      }));
      return null;
    }
  }, []);

  /** Clear current wallet session state */
  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      chainId: null,
      isMiniPay: typeof window !== "undefined" ? !!window.ethereum?.isMiniPay : false,
      isConnecting: false,
      error: null,
    });
  }, []);

  const switchToCelo = useCallback(async () => {
    if (!window.ethereum) return;
    await (window.ethereum as { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> }).request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${CELO_CHAIN_ID.toString(16)}` }],
    });
  }, []);

  return { ...state, connect, disconnect, switchToCelo };
}

export default useAuth;
