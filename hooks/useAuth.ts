"use client";
import { useState, useCallback, useEffect } from "react";

export interface EthereumProvider {
  isMiniPay?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

export interface AuthState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  isMiniPay: boolean;
  isConnecting: boolean;
  error: string | null;
}

const CELO_CHAIN_ID = 42220;
const CELO_CHAIN_HEX = `0x${CELO_CHAIN_ID.toString(16)}`;

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
      const eth = window.ethereum as EthereumProvider;
      const accounts = (await eth.request({
        method: "eth_requestAccounts",
      })) as string[];
      const chainHex = (await eth.request({
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
    } catch (err: unknown) {
      const errorObj = err as { code?: number };
      setState((s) => ({
        ...s,
        error: errorObj?.code === 4001 ? "User rejected connection" : (err instanceof Error ? err.message : String(err)),
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
    try {
      const eth = window.ethereum as EthereumProvider;
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CELO_CHAIN_HEX }],
      });
    } catch (err) {
      setState((s) => ({ ...s, error: "Failed to switch to Celo network" }));
    }
  }, []);

  return { ...state, connect, disconnect, switchToCelo };
}

export default useAuth;
