"use client";

import { useState } from "react";

interface APICardProps {
  id: number;
  name: string;
  priceUsd: string;
  priceCredits?: number;
  description: string;
  inputs: string[];
  onTryIt: (id: number, name: string, values: string[], priceCredits?: number) => void;
}

export default function APICard({ id, name, priceUsd, priceCredits, description, inputs, onTryIt }: APICardProps) {
  const [values, setValues] = useState<string[]>(Array(inputs.length).fill(""));

  const getIcon = () => {
    switch (name) {
      case "Weather Info": return "🌤️";
      case "Global News": return "🌍";
      case "Crypto Pulse": return "📈";
      case "AI Summary": return "🧠";
      case "AI Translate": return "🗣️";
      default: return "⚡";
    }
  };

  return (
    <div className="group relative bg-[#0B0E14] border border-[#1E293B] rounded-[24px] p-6 sm:p-8 flex flex-col h-fit hover:border-brand-yellow/40 transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(245,197,24,0.12)] overflow-hidden">
      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4 sm:gap-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F141C] border border-[#334155] flex items-center justify-center shadow-inner shrink-0 group-hover:border-brand-yellow/30 transition-colors duration-500">
             <span className="text-brand-yellow font-black text-xl group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(245,197,24,0.5)]">{getIcon()}</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{name}</h3>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
          <div className="bg-gradient-to-r from-[#00E676]/10 to-transparent border border-[#00E676]/30 text-[#00E676] px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-inner">
            {priceUsd}
          </div>
          {priceCredits && (
            <div className="bg-gradient-to-r from-[#F5C518]/10 to-transparent border border-[#F5C518]/30 text-brand-yellow px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-inner">
              {priceCredits} APIC/call
            </div>
          )}
        </div>
      </div>
      
      <p className="relative z-10 text-[#94A3B8] mb-8 text-base leading-relaxed flex-grow font-medium">{description}</p>
      
      <div className={`relative z-10 flex flex-col ${name === "AI Summary" || name === "AI Translate" ? '' : 'sm:flex-row'} items-stretch gap-3 mt-auto`}>
        {inputs.map((placeholder, idx) => {
          const isLongText = (name === "AI Summary" && idx === 0) || (name === "AI Translate" && idx === 0);
          return isLongText ? (
              <textarea
                key={idx}
                aria-label={`Input for ${placeholder}`}
                placeholder={placeholder}
                value={values[idx] || ""}
                onChange={(e) => {
                  const newVals = [...values];
                  newVals[idx] = e.target.value;
                  setValues(newVals);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                rows={3}
                className="w-full sm:flex-grow bg-[#050505] border border-[#1E293B] text-white placeholder-[#475569] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow/30 resize-none overflow-hidden transition-all shadow-inner"
              />
            ) : (
              <input 
                key={idx}
                type="text" 
                aria-label={`Input for ${placeholder}`}
                placeholder={placeholder}
                value={values[idx] || ""}
                onChange={(e) => {
                  const newVals = [...values];
                  newVals[idx] = e.target.value;
                  setValues(newVals);
                }}
                className="w-full sm:flex-grow bg-[#050505] border border-[#1E293B] text-white placeholder-[#475569] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow/30 transition-all shadow-inner"
              />
            );
        })}
        <button 
          onClick={() => onTryIt(id, name, values, priceCredits)}
          aria-haspopup="dialog"
          className="w-full sm:w-auto bg-gradient-to-b from-[#FDE047] to-[#F5C518] text-black font-black text-sm px-8 py-3 rounded-xl shadow-[0_0_15px_rgba(245,197,24,0.3)] hover:shadow-[0_0_25px_rgba(245,197,24,0.5)] hover:-translate-y-0.5 transition-all whitespace-nowrap flex items-center justify-center gap-2 shrink-0"
        >
          Call API <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
  );
}
