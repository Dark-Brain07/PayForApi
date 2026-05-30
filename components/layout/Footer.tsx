import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-black mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-2xl">🚀</span>
            <span className="font-bold text-lg text-white">
              Pay For <span className="text-brand-yellow">API</span>
            </span>
          </div>
          <div className="flex space-x-6 text-sm text-text-secondary">
            <p>Built for the Celo Onchain Agents Hackathon</p>
            <Link href="https://celo.org" target="_blank" className="hover:text-brand-green transition-colors">
              Celo Network
            </Link>
            <Link href="https://docs.celo.org/developer/build-on-minipay/overview" target="_blank" className="hover:text-brand-yellow transition-colors">
              MiniPay Docs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
