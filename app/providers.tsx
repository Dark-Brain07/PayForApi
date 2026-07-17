"use client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmiConfig";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

/** Main providers wrapper */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div aria-live="polite" className="sr-only"></div>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
