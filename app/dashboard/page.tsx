"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";

export default function DashboardPage() {
  const [apis, setApis] = useState<{name: string, endpoint: string, revenue: number}[]>([
    { name: "My Custom Weather Model", endpoint: "api.myweather.com/v1", revenue: 42.50 },
    { name: "DeFi Sentiment Analyzer", endpoint: "defi-sense.io/analyze", revenue: 128.00 }
  ]);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-brand-yellow/30 selection:text-brand-yellow">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <div className="flex justify-between items-end mb-8 border-b border-[#1E293B] pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
              Creator <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-600">Dashboard</span>
            </h1>
            <p className="text-[#94A3B8] text-lg">Monetize your AI endpoints instantly on Celo.</p>
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:scale-105"
          >
            + Register New API
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-[#0F172A] border border-[#1E293B] rounded-2xl">
            <h3 className="text-[#94A3B8] font-medium mb-1">Total Revenue</h3>
            <p className="text-3xl font-black text-white">$170.50 <span className="text-sm font-normal text-[#64748B]">cUSD</span></p>
          </div>
          <div className="p-6 bg-[#0F172A] border border-[#1E293B] rounded-2xl">
            <h3 className="text-[#94A3B8] font-medium mb-1">Active Endpoints</h3>
            <p className="text-3xl font-black text-white">2</p>
          </div>
          <div className="p-6 bg-[#0F172A] border border-[#1E293B] rounded-2xl">
            <h3 className="text-[#94A3B8] font-medium mb-1">Total Calls</h3>
            <p className="text-3xl font-black text-white">14,204</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Registered Endpoints</h2>
          <div className="space-y-4">
            {apis.map((api, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-[#0F172A]/50 border border-[#1E293B] hover:border-[#334155] rounded-xl transition-all group">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {api.name}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">ACTIVE</span>
                  </h3>
                  <code className="text-sm text-[#64748B] mt-1 block">{api.endpoint}</code>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[#94A3B8] text-sm font-medium">Revenue</p>
                    <p className="text-brand-yellow font-bold">${api.revenue.toFixed(2)} cUSD</p>
                  </div>
                  <button className="text-sm text-[#94A3B8] hover:text-white transition-colors underline decoration-[#1E293B] hover:decoration-white underline-offset-4">
                    Settings
                  </button>
                </div>
              </div>
            ))}
            {apis.length === 0 && (
              <div className="text-center py-12 border border-dashed border-[#1E293B] rounded-xl">
                <p className="text-[#94A3B8]">You haven't registered any APIs yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#64748B] hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">Register API</h2>
            <p className="text-[#94A3B8] text-sm mb-6">Enter your Web2 or Web3 API endpoint URL. Our smart contract will automatically wrap it with x402 payments.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">API Name</label>
                <input type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow transition-colors" placeholder="e.g. My Llama 3 Model" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Endpoint URL</label>
                <input type="text" className="w-full bg-[#020617] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow transition-colors" placeholder="https://api.example.com/v1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Price per Call (cUSD)</label>
                <input type="number" step="0.001" className="w-full bg-[#020617] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow transition-colors" placeholder="0.005" />
              </div>
