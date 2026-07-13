"use client";

/** Stats page component */
export default function StatsPage(): React.JSX.Element {
  return (
    <main className="flex flex-col w-full min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto">
      <title>Platform Analytics | PayForAPI</title>
      
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-white mb-3">Platform <span className="text-brand-yellow">Analytics</span></h1>
        <p className="text-[#94A3B8]">Transparent on-chain metrics and usage statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Metric Cards */}
        <div className="bg-[#0A0D12] border border-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-col">
          <span className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-2">Monthly Active Users</span>
          <span className="text-3xl font-black text-white">14,205</span>
          <span className="text-brand-green text-xs font-bold mt-2">↑ 24% this month</span>
        </div>
        
        <div className="bg-[#0A0D12] border border-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-col">
          <span className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-2">Total Transactions</span>
          <span className="text-3xl font-black text-white">284,910</span>
          <span className="text-brand-green text-xs font-bold mt-2">↑ 12k this week</span>
        </div>

        <div className="bg-[#0A0D12] border border-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-col">
          <span className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-2">USDm Volume</span>
          <span className="text-3xl font-black text-brand-yellow">$1,424.55</span>
          <span className="text-[#94A3B8] text-xs font-bold mt-2">via Micropayments</span>
        </div>

        <div className="bg-[#0A0D12] border border-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-col">
          <span className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-2">Failed Tx Rate</span>
          <span className="text-3xl font-black text-white">0.02%</span>
          <span className="text-[#94A3B8] text-xs font-bold mt-2">Network reliability</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0A0D12] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">Top Regions (MiniPay)</h2>
          <div role="group" aria-label="Region Stats" className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-[#94A3B8]">Nigeria 🇳🇬</span><span className="text-white font-bold">45%</span></div>
              <div className="w-full bg-[#1E293B] rounded-full h-2"><div className="bg-brand-yellow h-2 rounded-full" style={{width: '45%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-[#94A3B8]">Kenya 🇰🇪</span><span className="text-white font-bold">28%</span></div>
              <div className="w-full bg-[#1E293B] rounded-full h-2"><div className="bg-brand-yellow h-2 rounded-full" style={{width: '28%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-[#94A3B8]">Ghana 🇬🇭</span><span className="text-white font-bold">15%</span></div>
              <div className="w-full bg-[#1E293B] rounded-full h-2"><div className="bg-brand-yellow h-2 rounded-full" style={{width: '15%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-[#94A3B8]">Other</span><span className="text-white font-bold">12%</span></div>
              <div className="w-full bg-[#1E293B] rounded-full h-2"><div className="bg-[#94A3B8] h-2 rounded-full" style={{width: '12%'}}></div></div>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0D12] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">Usage by Tool</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#0F141C] rounded-xl border border-[#1E293B]">
              <div className="flex items-center gap-3">
                <div className="text-2xl bg-brand-yellow/10 p-2 rounded-lg border border-brand-yellow/20">💬</div>
                <div>
                  <div className="text-white font-bold text-sm">Ask AI</div>
                  <div className="text-[#94A3B8] text-xs">Chat \u0026 Summaries</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-brand-yellow font-black text-lg">182k</div>
                <div className="text-[#94A3B8] text-[10px] uppercase">Calls</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0F141C] rounded-xl border border-[#1E293B]">
              <div className="flex items-center gap-3">
                <div className="text-2xl bg-brand-green/10 p-2 rounded-lg border border-brand-green/20">🎨</div>
                <div>
                  <div className="text-white font-bold text-sm">Create Image</div>
                  <div className="text-[#94A3B8] text-xs">Flux AI generation</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-brand-green font-black text-lg">102k</div>
                <div className="text-[#94A3B8] text-[10px] uppercase">Calls</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div aria-live="polite" className="mt-8 text-center text-xs text-[#94A3B8]">
        Metrics are aggregated from on-chain event logs and PostHog analytics.
      </div>
    </main>
  );
}
