"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FOOTER_TAGLINE = "Decentralized, subscriptionless Web3 API Gateway." as const;
const LOGO_SIZE = 60;

/** Site footer component */
export default function Footer(): React.ReactNode {
  const pathname = usePathname();
  
  if (pathname === "/chat" || pathname === "/image") {
    return null;
  }

  return (
    <footer aria-label="Site Footer" className="border-t border-brand-border bg-brand-black mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Link href="/" role="link" prefetch={false} aria-label="Pay For API Home" title="Pay For API Home" rel="noopener noreferrer" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
            <img role="img" aria-hidden="true" src="/logo.png" alt="Pay For API Logo" width={LOGO_SIZE} height={LOGO_SIZE} loading="lazy" className="w-16 h-16 object-contain drop-shadow-xl" />
            <span className="font-black text-2xl text-white tracking-tight">
              Pay For <span className="text-brand-yellow">API</span>
            </span>
          </Link>
          <p className="text-sm text-[#94A3B8] font-medium text-center">
            {FOOTER_TAGLINE}
            <br />Built for the Celo Ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
}
