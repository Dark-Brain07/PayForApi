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
