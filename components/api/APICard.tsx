"use client";

import { useState } from "react";

interface APICardProps {
  id: number;
  name: string;
  priceUsd: string;
  description: string;
  inputs: string[];
  onTryIt: (id: number, name: string, values: string[]) => void;
}

export default function APICard({ id, name, priceUsd, description, inputs, onTryIt }: APICardProps) {
  const [values, setValues] = useState<string[]>(Array(inputs.length).fill(""));
  return (
    <div className="bg-[#0B0E14] border border-[#1E293B] rounded-2xl p-6 flex flex-col h-full hover:border-[#334155] transition-colors shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <div className="bg-[#002A1A] border border-[#00E676]/30 text-[#00E676] px-3 py-1 rounded-full text-xs font-semibold">
          {priceUsd}
        </div>
      </div>
      
      <p className="text-[#94A3B8] mb-8 text-sm flex-grow">{description}</p>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto">
        {inputs.map((placeholder, idx) => (
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
        ))}
        <button 
          onClick={() => onTryIt(id, name, values)}
          className="w-full sm:w-auto bg-gradient-to-b from-[#FDE047] to-[#F5C518] text-black font-bold text-sm px-6 py-2 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_4px_10px_rgba(245,197,24,0.3)] hover:brightness-110 transition-all whitespace-nowrap"
        >
          Call API &rarr;
        </button>
      </div>
    </div>
  );
}
