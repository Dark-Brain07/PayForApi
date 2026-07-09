"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname === "/chat" || pathname === "/image") {
    return null;
  }

  return (
    <footer className="border-t border-brand-border bg-brand-black mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Link href="/" aria-label="Pay For API Home" title="Pay For API Home" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
            <img aria-hidden="true" src="/logo.png" alt="Pay For API Logo" width={60} height={60} loading="lazy" className="w-16 h-16 object-contain drop-shadow-xl" />
            <span className="font-black text-2xl text-white tracking-tight">
              Pay For <span className="text-brand-yellow">API</span>
            </span>
          </Link>
          <p className="text-sm text-[#94A3B8] font-medium text-center">
            Decentralized, subscriptionless Web3 API Gateway.
            <br />Built for the Celo Ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
}
