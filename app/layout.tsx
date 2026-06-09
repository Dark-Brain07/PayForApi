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
        <meta name="talentapp:project" content="pay-for-api" />
        <meta name="talentapp:project_verification" content="8ca17029f3adbb9b374a2fcf59ed89f4f55fdf34ad60a58706430a864dfb85470f83f22fc292305f1f4e3af294f3918e73cba502dac7bafdea4ae9f802d5401e" />
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
