"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "@/components/layout/Header";
import { useWallet } from "@/components/wallet/WalletContext";
import { CONTRACTS } from "@/lib/contracts";

export interface ApiEndpointData {
  name: string;
  endpoint: string;
  revenue: number;
}

export default function DashboardPage() {
  const [apis, setApis] = useState<ApiEndpointData[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newApiName, setNewApiName] = useState("");
  const [newApiEndpoint, setNewApiEndpoint] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedSettingsApi, setSelectedSettingsApi] = useState<ApiEndpointData | null>(null);
  const [deletedApis, setDeletedApis] = useState<ApiEndpointData[]>([]);
  const { address, isConnected } = useWallet();

  const handleRegister = async () => {
    if (!newApiName || !newApiEndpoint) return alert("Please fill all fields");
    if (!isConnected || !address) return alert("Please connect your wallet first");

    try {
      setIsRegistering(true);
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      
      const contract = new ethers.Contract(
        CONTRACTS.API_REVENUE_SPLITTER.address,
        CONTRACTS.API_REVENUE_SPLITTER.abi,
        signer
      );

      // We use the endpoint as the unique ID
      const tx = await contract.registerApi(newApiEndpoint);
      await tx.wait();
      
      setApis([...apis, { name: newApiName, endpoint: newApiEndpoint, revenue: 0 }]);
      setModalOpen(false);
      setNewApiName("");
      setNewApiEndpoint("");
    } catch (error: unknown) {
      console.error(error);
      const err = error as Record<string, unknown>;
      alert((err?.shortMessage as string) || (err?.message as string) || "Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    const fetchRealEndpoints = async () => {
      if (!isConnected || !address || typeof window === "undefined" || !(window as any).ethereum) {
        setApis([]);
        return;
      }
      
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const contract = new ethers.Contract(
          CONTRACTS.API_REVENUE_SPLITTER.address,
          CONTRACTS.API_REVENUE_SPLITTER.abi,
          provider
        );

        // Fetch events. Since creator isn't indexed in ABI, we must filter locally.
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(0, currentBlock - 2000000);
        const filter = contract.filters.ApiRegistered();
        const events = await contract.queryFilter(filter, fromBlock, "latest");

        const deletedIds = JSON.parse(localStorage.getItem(`deleted_endpoints_${address}`) || "[]");
        const fetchedApis: ApiEndpointData[] = [];
        const fetchedDeletedApis: ApiEndpointData[] = [];

        for (const event of events) {
          const eventObj = event as any;
          const endpointId = eventObj.args?.[0];
          const creator = eventObj.args?.[1];
          
          if (creator && creator.toLowerCase() === address.toLowerCase() && endpointId) {
            const apiData = await contract.apiEndpoints(endpointId);
            const rawRevenue = apiData.totalRevenue;
            const revenueFormatted = Number(ethers.formatUnits(rawRevenue, 18));
            
            const apiObj = {
              name: `Endpoint (${endpointId.substring(0, 20)}...)`,
              endpoint: endpointId,
              revenue: revenueFormatted
            };
            
            if (deletedIds.includes(endpointId)) {
              if (!fetchedDeletedApis.find(a => a.endpoint === endpointId)) {
                fetchedDeletedApis.push(apiObj);
              }
            } else {
              if (!fetchedApis.find(a => a.endpoint === endpointId)) {
                fetchedApis.push(apiObj);
              }
            }
          }
        }
        
        setApis(fetchedApis);
        setDeletedApis(fetchedDeletedApis);
      } catch (error) {
        console.error("Error fetching endpoints:", error);
      }
    };

    fetchRealEndpoints();
  }, [isConnected, address]);

  const totalRevenue = [...apis, ...deletedApis].reduce((sum, api) => sum + api.revenue, 0);

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-brand-yellow/30 selection:text-brand-yellow">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16">
        <div className="flex justify-between items-end mb-8 border-b border-[#1E293B] pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
              Creator <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-600">Dashboard</span>
            </h1>
            <p className="text-[#94A3B8] text-lg">Monetize your AI endpoints instantly on Celo.</p>
          </div>
          <button 
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:scale-105"
          >
            + Register New API
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-[#0F172A] border border-[#1E293B] rounded-2xl">
            <h3 className="text-[#94A3B8] font-medium mb-1">Total Revenue</h3>
            <p className="text-3xl font-black text-white">${totalRevenue.toFixed(2)} <span className="text-sm font-normal text-[#64748B]">cUSD</span></p>
          </div>
          <div className="p-6 bg-[#0F172A] border border-[#1E293B] rounded-2xl">
            <h3 className="text-[#94A3B8] font-medium mb-1">Active Endpoints</h3>
            <p className="text-3xl font-black text-white">{apis.length}</p>
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
                    <span aria-label="Active Status" className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">ACTIVE</span>
                  </h3>
                  <code className="text-sm text-[#64748B] mt-1 block">{api.endpoint}</code>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[#94A3B8] text-sm font-medium">Revenue</p>
                    <p className="text-brand-yellow font-bold">${api.revenue.toFixed(2)} cUSD</p>
                  </div>
                  <button 
                    onClick={() => setSelectedSettingsApi(api)}
                    className="text-sm text-[#94A3B8] hover:text-white transition-colors underline decoration-[#1E293B] hover:decoration-white underline-offset-4"
                  >
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

        {deletedApis.filter(api => api.revenue > 0).length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#64748B] mb-6 flex items-center gap-2">
               Archived Endpoints (With Balance)
            </h2>
            <div className="space-y-4 opacity-75">
              {deletedApis.filter(api => api.revenue > 0).map((api, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-[#0F172A]/30 border border-[#1E293B] border-dashed rounded-xl group">
                  <div>
                    <h3 className="text-lg font-bold text-[#94A3B8] flex items-center gap-2">
                      {api.name}
                      <span aria-label="Deleted Status" className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1E293B] text-[#64748B] border border-[#334155]">DELETED</span>
                    </h3>
                    <code className="text-sm text-[#475569] mt-1 block">{api.endpoint}</code>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[#64748B] text-sm font-medium">Pending Withdrawal</p>
                      <p className="text-brand-yellow font-bold">${api.revenue.toFixed(2)} cUSD</p>
                    </div>
                    <button 
                      onClick={() => alert("Withdrawals will be enabled via smart contract upgrade in V2.")}
                      className="text-sm px-4 py-2 bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow/20 rounded-lg transition-colors font-bold border border-brand-yellow/30"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" className="bg-[#0F172A] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-[#64748B] hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">Register API</h2>
            <p className="text-[#94A3B8] text-sm mb-6">Enter your Web2 or Web3 API endpoint URL. Our smart contract will automatically wrap it with x402 payments.</p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="new-api-name" className="block text-sm font-medium text-[#94A3B8] mb-1">API Name</label>
                <input 
                  id="new-api-name"
                  type="text" 
                  value={newApiName}
                  onChange={(e) => setNewApiName(e.target.value)}
                  className="w-full bg-[#020617] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow transition-colors" 
                  placeholder="e.g. My Llama 3 Model" 
                />
              </div>
              <div>
                <label htmlFor="new-api-endpoint" className="block text-sm font-medium text-[#94A3B8] mb-1">Endpoint URL</label>
                <input 
                  id="new-api-endpoint"
                  type="text" 
                  value={newApiEndpoint}
                  onChange={(e) => setNewApiEndpoint(e.target.value)}
                  className="w-full bg-[#020617] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow transition-colors" 
                  placeholder="https://api.example.com/v1" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Price per Call (cUSD)</label>
                <input type="number" step="0.001" className="w-full bg-[#020617] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow transition-colors" placeholder="0.005" />
              </div>
              <p className="text-xs text-[#64748B]">Platform fee: 10% per transaction automatically routed to Pay For API treasury.</p>
              <button 
                onClick={handleRegister}
                disabled={isRegistering}
                className="w-full py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering ? "Registering on Celo..." : "Register & Get x402 Wrapper"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {selectedSettingsApi && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" className="bg-[#0F172A] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setSelectedSettingsApi(null)}
              aria-label="Close settings"
              className="absolute top-4 right-4 text-[#64748B] hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">Endpoint Settings</h2>
            <p className="text-[#94A3B8] text-sm mb-6">Manage your API endpoint configuration.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">API Name</label>
                <input 
                  type="text" 
                  value={selectedSettingsApi.name}
                  disabled
                  className="w-full bg-[#020617] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white opacity-70 cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Endpoint URL</label>
                <input 
                  type="text" 
                  value={selectedSettingsApi.endpoint}
                  disabled
                  className="w-full bg-[#020617] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white opacity-70 cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Withdrawal Available</label>
                <div className="w-full bg-[#020617] border border-[#1E293B] rounded-lg px-4 py-2.5 text-brand-yellow font-bold">
                  ${selectedSettingsApi.revenue.toFixed(2)} cUSD
                </div>
              </div>
              <p className="text-xs text-brand-yellow mt-2 border border-brand-yellow/30 bg-brand-yellow/10 p-2 rounded">
                Note: Updating endpoint configuration and withdrawals will be enabled via smart contract upgrade in V2.
              </p>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setSelectedSettingsApi(null)}
                  className="w-full py-3 bg-[#1E293B] hover:bg-[#334155] text-white font-bold rounded-lg transition-all"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    if (!address) return;
                    const deletedIds = JSON.parse(localStorage.getItem(`deleted_endpoints_${address}`) || "[]");
                    if (!deletedIds.includes(selectedSettingsApi.endpoint)) {
                        deletedIds.push(selectedSettingsApi.endpoint);
                        localStorage.setItem(`deleted_endpoints_${address}`, JSON.stringify(deletedIds));
                    }
                    setApis(apis.filter(a => a.endpoint !== selectedSettingsApi.endpoint));
                    setDeletedApis([...deletedApis, selectedSettingsApi]);
                    setSelectedSettingsApi(null);
                  }}
                  className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 font-bold rounded-lg transition-all"
                >
                  Delete Endpoint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
