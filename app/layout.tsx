import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/wallet/WalletContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Pay For API — AI APIs on Celo",
  description: "Pay-per-call AI APIs using Celo stablecoins. No subscriptions. Pay only what you use.",
  keywords: ["Celo", "Web3", "API", "Pay-per-call", "Stablecoin", "AI"],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/**
 * Main application layout wrapping all routes with global providers
 */
export default function RootLayout({ children = null }: { children?: ReactNode }): React.ReactElement {
  return (
    <html lang="en-US" className={jetbrainsMono.variable}>
      <head>
        <meta name="mini-pay" content="true" />
        <meta name="talentapp:project" content="pay-for-api" />
        <meta name="talentapp:project_verification" content="8ca17029f3adbb9b374a2fcf59ed89f4f55fdf34ad60a58706430a864dfb85470f83f22fc292305f1f4e3af294f3918e73cba502dac7bafdea4ae9f802d5401e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-brand-black text-white font-mono antialiased">
        <Providers>
          <WalletProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main id="main-content" className="flex-grow relative" aria-label="Main Content">{children}</main>
              <Footer />
            </div>
          </WalletProvider>
        </Providers>
      </body>
    </html>
  );
}
