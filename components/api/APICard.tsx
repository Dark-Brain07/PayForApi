"use client";
import { useState } from "react";
import { StablecoinKey, CELO_STABLECOINS } from "@/lib/stablecoins";

interface APICardProps {
  id: number;
  name: string;
  icon: string;
  priceUsd: string;
  description: string;
  totalCalls: string;
  onTryIt: (id: number, name: string) => void;
}

export default function APICard({ id, name, icon, priceUsd, description, totalCalls, onTryIt }: APICardProps) {
  return (
    <div className="card p-6 flex flex-col h-full group hover:border-brand-yellow/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-lg font-bold text-white group-hover:text-brand-yellow transition-colors">{name}</h3>
        </div>
        <span className="badge">{priceUsd} cUSD</span>
      </div>
      
      <p className="text-text-secondary mb-6 flex-grow">{description}</p>
      
      <div className="flex justify-between items-center pt-4 border-t border-brand-border">
        <div className="text-xs text-text-muted">
          Calls: <span className="text-brand-green font-mono">{totalCalls}</span>
        </div>
        <button 
          onClick={() => onTryIt(id, name)}
          className="btn-secondary text-sm py-1"
        >
          Try it
        </button>
      </div>
    </div>
  );
}
