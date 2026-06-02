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
  return (
    <div className="bg-[#0B0E14] border border-[#1E293B] rounded-2xl p-6 flex flex-col h-full hover:border-[#334155] transition-colors shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <div className="flex flex-col items-end gap-1">
          <div className="bg-[#002A1A] border border-[#00E676]/30 text-[#00E676] px-3 py-1 rounded-full text-xs font-semibold">
            {priceUsd}
          </div>
          {priceCredits && (
            <div className="bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow px-3 py-1 rounded-full text-xs font-semibold">
              {priceCredits} APIC/call
            </div>
          )}
        </div>
      </div>
      
      <p className="text-[#94A3B8] mb-8 text-sm flex-grow">{description}</p>
      
      <div className={`flex flex-col ${name === "AI Summary" || name === "AI Translate" ? '' : 'sm:flex-row'} items-stretch gap-3 mt-auto`}>
        {inputs.map((placeholder, idx) => {
          const isLongText = (name === "AI Summary" && idx === 0) || (name === "AI Translate" && idx === 0);
          return isLongText ? (
            <textarea
              key={idx}
              placeholder={placeholder}
              value={values[idx] || ""}
              onChange={(e) => {
                const newVals = [...values];
                newVals[idx] = e.target.value;
                setValues(newVals);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              rows={1}
              className="w-full sm:flex-grow bg-[#050505] border border-[#1E293B] text-white placeholder-[#475569] text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-[#3B82F6] resize-none overflow-hidden"
              style={{ minHeight: "38px" }}
            />
          ) : (
            <input 
              key={idx}
              type="text" 
              placeholder={placeholder}
              value={values[idx] || ""}
              onChange={(e) => {
                const newVals = [...values];
                newVals[idx] = e.target.value;
                setValues(newVals);
              }}
              className="w-full sm:flex-grow bg-[#050505] border border-[#1E293B] text-white placeholder-[#475569] text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-[#3B82F6]"
            />
          );
        })}
        <button 
          onClick={() => onTryIt(id, name, values, priceCredits)}
          className="w-full sm:w-auto bg-gradient-to-b from-[#FDE047] to-[#F5C518] text-black font-bold text-sm px-6 py-2 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_4px_10px_rgba(245,197,24,0.3)] hover:brightness-110 transition-all whitespace-nowrap"
        >
          Call API &rarr;
        </button>
      </div>
    </div>
  );
}
