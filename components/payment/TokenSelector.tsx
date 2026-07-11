"use client";
import { CELO_STABLECOINS, StablecoinKey } from "@/lib/stablecoins";

interface TokenSelectorProps {
  selectedToken: StablecoinKey;
  onSelect: (token: StablecoinKey) => void;
}

export default function TokenSelector({ selectedToken, onSelect }: TokenSelectorProps) {
  return (
    <div role="group" aria-label="Select Payment Token" className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {(Object.entries(CELO_STABLECOINS) as [StablecoinKey, typeof CELO_STABLECOINS[StablecoinKey]][]).map(([key, token]) => (
        <div 
          key={token.symbol}
          role="button"
          aria-label={`Select ${token.symbol}`}
          tabIndex={0}
          onClick={() => onSelect(key)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(key); } }}
          className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center space-y-2 transition-all focus:outline-none focus:ring-2 focus:ring-brand-yellow ${
            selectedToken === key 
              ? "border-brand-yellow bg-brand-yellow/5" 
              : "border-brand-border bg-brand-card hover:border-brand-border/80 hover:bg-brand-elevated"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{token.flag}</span>
            <span className="font-bold text-white">{token.symbol}</span>
          </div>
          <div className="text-xs text-text-secondary text-center">
            {token.pricePerCall} / call
          </div>
        </div>
      ))}
    </div>
  );
}
