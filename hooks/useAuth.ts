"use client";
import { useState, useCallback, useEffect } from "react";

export interface EthereumProvider {
  isMiniPay?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

/**
 * Represents the current authentication state of the wallet session.
 */
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
      if (!accounts || accounts.length === 0) throw new Error("No accounts found");
      const chainHex = (await eth.request({
        method: "eth_chainId",
      })) as string;
      if (!chainHex) throw new Error("Invalid chain ID returned");
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
      const isProviderError = (e: unknown): e is { code: number } => typeof e === 'object' && e !== null && 'code' in e;
      setState((s) => ({
        ...s,
        error: isProviderError(err) && err.code === 4001 ? "User rejected connection" : (err instanceof Error ? err.message : String(err)),
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

  const switchToCelo = useCallback(async (): Promise<void> => {
    if (!window.ethereum) return;
    try {
      const eth = window.ethereum as EthereumProvider;
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CELO_CHAIN_HEX }],
      });
    } catch (err: unknown) {
      const isProviderError = (e: unknown): e is { code: number } => typeof e === 'object' && e !== null && 'code' in e;
      if (isProviderError(err) && err.code === 4902) {
        try {
          const eth = window.ethereum as EthereumProvider;
          await eth.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: CELO_CHAIN_HEX,
              chainName: "Celo Mainnet",
              rpcUrls: ["https://forno.celo.org"],
              nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
              blockExplorerUrls: ["https://celoscan.io/"]
            }]
          });
          return;
        } catch (addErr) {
          setState((s) => ({ ...s, error: "Failed to add Celo network" }));
          return;
        }
      }
      setState((s) => ({ ...s, error: "Failed to switch to Celo network" }));
    }
  }, []);

  return { ...state, connect, disconnect, switchToCelo };
}

export default useAuth;
