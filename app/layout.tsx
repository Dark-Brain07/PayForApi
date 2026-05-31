import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/wallet/WalletContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Pay For API — AI APIs on Celo",
  description: "Pay-per-call AI APIs using Celo stablecoins. No subscriptions. Pay only what you use.",
  manifest: "/manifest.json",
  other: {
    "mini-pay": "true",
    "talentapp:project": "pay-for-api",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        <meta name="mini-pay" content="true" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-brand-black text-white font-mono antialiased">
        <WalletProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
