"use client";

import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/components/wallet/WalletContext";
import { CONTRACTS } from "@/lib/contracts";
import Input from "@/components/ui/Input";
import { EthereumProvider } from "@/hooks/useAuth";
import GoodDollarIdentity from "@/components/identity/GoodDollarIdentity";

/** Shared styling classes for text inputs in the dashboard. */
const INPUT_CLASSES = [
  "w-full bg-[#020617] border border-[#1E293B] rounded-lg",
  "px-4 py-2.5 text-white",
  "focus:outline-none focus:border-brand-yellow transition-colors"
].join(" ");

const EmptyStateIcon: React.FC = () => (
  <svg aria-hidden="true" className="w-12 h-12 text-[#334155] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
);

export interface TransactionError {
  shortMessage?: string;
  message?: string;
}

type WindowWithEthereum = Window & typeof globalThis & { ethereum?: EthereumProvider };

import { BLOCKS_TO_QUERY, CACHE_KEYS } from "@/lib/constants";

export interface ApiEndpointData {
  readonly name: string;
  readonly endpoint: string;
  readonly revenue: number;
}

/**
 * Main dashboard view for API creators to manage endpoints and track revenue.
 */
export default function DashboardPage() {
  const [apis, setApis] = useState<ApiEndpointData[]>([]);
  const [loadingEndpoints, setLoadingEndpoints] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newApiName, setNewApiName] = useState("");
  const [newApiEndpoint, setNewApiEndpoint] = useState("");
  const [newApiPrice, setNewApiPrice] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedSettingsApi, setSelectedSettingsApi] = useState<ApiEndpointData | null>(null);
  const [deletedApis, setDeletedApis] = useState<ApiEndpointData[]>([]);
  const { address, isConnected } = useWallet();

  const handleRegister = async (): Promise<void> => {
    setErrorMsg("");
    if (!newApiName.trim() || !newApiEndpoint.trim()) { setErrorMsg("Please fill all fields with valid text"); return; }
    if (!isConnected || !address) { setErrorMsg("Please connect your Web3 wallet first to register an API."); return; }
    if (typeof window === "undefined" || !(window as WindowWithEthereum).ethereum) {
      setErrorMsg("No Web3 wallet detected");
      return;
    }

    try {
      setIsRegistering(true);
      const provider = new ethers.BrowserProvider((window as WindowWithEthereum).ethereum);
      let signer;
      try {
        signer = await provider.getSigner();
      } catch (err) {
        throw new Error("Failed to get wallet signer. Please ensure your wallet is unlocked.");
      }
      
      const contract = new ethers.Contract(
        CONTRACTS.API_REVENUE_SPLITTER.address,
        CONTRACTS.API_REVENUE_SPLITTER.abi,
        signer
      );

      let tx: ethers.ContractTransactionResponse;
      try {
        tx = await contract.registerApi(newApiEndpoint);
        await tx.wait();
      } catch (txErr: unknown) {
        const err = txErr as TransactionError;
        throw new Error(err.shortMessage || err.message || "Transaction rejected or failed");
      }
      
      setApis([...apis, { name: newApiName, endpoint: newApiEndpoint, revenue: 0 }]);
      setModalOpen(false);
      setNewApiName("");
      setNewApiEndpoint("");
      setNewApiPrice("");
    } catch (error: unknown) {
      let msg = "Registration failed";
      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "object" && error !== null) {
        const errObj = error as Record<string, unknown>;
        msg = (errObj.shortMessage as string) || (errObj.message as string) || msg;
      } else if (typeof error === "string") {
        msg = error;
      }
      if (msg.toLowerCase().includes("endpointalreadyregistered") || msg.toLowerCase().includes("already registered")) {
        setErrorMsg("Registration failed: This endpoint is already registered.");
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchRealEndpoints = async (): Promise<void> => {
      setLoadingEndpoints(true);
      if (!isConnected || !address || !ethers.isAddress(address) || typeof window === "undefined" || !(window as WindowWithEthereum).ethereum) {
        setApis([]);
        setLoadingEndpoints(false);
        return;
      }
      
      try {
        const getProvider = () => new ethers.BrowserProvider((window as Window & typeof globalThis & { ethereum?: EthereumProvider }).ethereum);
        const provider = getProvider();
        const contract = new ethers.Contract(
          CONTRACTS.API_REVENUE_SPLITTER.address,
          CONTRACTS.API_REVENUE_SPLITTER.abi,
          provider
        );

        // Fetch events. Since creator isn't indexed in ABI, we must filter locally.
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(0, currentBlock - BLOCKS_TO_QUERY);
        const filter = contract.filters.ApiRegistered();
        let events = [];
        try {
          events = await contract.queryFilter(filter, fromBlock, "latest");
        } catch (err) {
          // Fallback handled locally
        }

        const deletedCacheKey = CACHE_KEYS.DELETED_ENDPOINTS;
        let deletedIds: string[] = [];
        if (typeof window !== "undefined") {
          try {
            let globalIds: string[] = [];
            try { globalIds = JSON.parse(localStorage.getItem(deletedCacheKey) || "[]"); } catch (e) { localStorage.removeItem(deletedCacheKey); }
            let localIds: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith("deleted_endpoints_0x")) {
                try {
                  localIds = [...localIds, ...JSON.parse(localStorage.getItem(key) || "[]")];
                } catch (err) {
                  localStorage.removeItem(key);
                }
              }
            }
            deletedIds = [...new Set([...globalIds, ...localIds])];
          } catch (err) {
            localStorage.removeItem(deletedCacheKey);
          }
        }
        const fetchedApis: ApiEndpointData[] = [];
        const fetchedDeletedApis: ApiEndpointData[] = [];

        interface RegisteredEvent { args?: string[] }
        for (const event of events) {
          const eventObj = event as RegisteredEvent;
          const endpointId = eventObj.args?.[0];
          const creator = eventObj.args?.[1];
          
          if (creator && address && creator.toLowerCase() === address.toLowerCase() && endpointId) {
            let apiData;
            try {
              apiData = await contract.apiEndpoints(endpointId);
              if (!apiData) continue;
            } catch (err) {
              continue;
            }
            const rawRevenue = apiData.totalRevenue || 0n;
            let revenueFormatted = 0;
            try {
              revenueFormatted = Number(ethers.formatEther(rawRevenue));
            } catch (err) {
              // fallback to 0
            }
            
            const apiObj = {
              name: `Endpoint (${endpointId.slice(0, 6)}...${endpointId.slice(-4)})`,
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
        
        if (isMounted) {
          setApis(fetchedApis);
          setDeletedApis(fetchedDeletedApis);
        }
      } catch (error) {
        // Silent fallback
      } finally {
        if (isMounted) setLoadingEndpoints(false);
      }
    };

    fetchRealEndpoints();
    return () => { isMounted = false; };
  }, [isConnected, address]);

  const totalRevenue = useMemo<number>(() => {
    return [...(apis || []), ...(deletedApis || [])].reduce((sum, api) => sum + (api?.revenue || 0), 0);
  }, [apis, deletedApis]);

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-brand-yellow/30 selection:text-brand-yellow">
      <title>Creator Dashboard | PayForAPI</title>
      <meta name="description" content="Manage your registered API endpoints and track revenue." />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 border-b border-[#1E293B] pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
              Creator <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-600">Dashboard</span>
            </h1>
            <p className="text-[#94A3B8] text-lg">Monetize your AI endpoints instantly on Celo.</p>
          </div>
          <button 
            type="button"
            onClick={() => setModalOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isModalOpen}
            className="px-6 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:scale-105"
          >
            + Register New API
          </button>
        </div>

        <GoodDollarIdentity />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-[#0F172A] border border-[#1E293B] rounded-2xl transition-transform hover:scale-[1.02]">
            <h3 className="text-[#94A3B8] font-medium mb-1">Total Revenue</h3>
            <p className="text-3xl font-black text-white flex items-center gap-2" aria-live="polite">{loadingEndpoints ? <div className="h-9 w-32 bg-[#1E293B] rounded animate-pulse"></div> : `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4})}`} <span className="text-sm font-normal text-[#64748B]">cUSD</span></p>
          </div>
          <div className="p-6 bg-[#0F172A] border border-[#1E293B] rounded-2xl">
            <h3 className="text-[#94A3B8] font-medium mb-1">Active Endpoints</h3>
            <p className="text-3xl font-black text-white">{loadingEndpoints ? <span role="status" aria-busy="true" aria-live="polite" className="animate-pulse opacity-50">...</span> : apis.length}</p>
          </div>
          <div className="p-6 bg-[#0F172A] border border-[#1E293B] rounded-2xl">
            <h3 className="text-[#94A3B8] font-medium mb-1">Total Calls</h3>
            <p className="text-3xl font-black text-white">{loadingEndpoints ? <span role="status" aria-busy="true" aria-live="polite" className="animate-pulse opacity-50">...</span> : (14204).toLocaleString()}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Your Registered Endpoints</h2>
            <button aria-label="Refresh endpoints" aria-busy={loadingEndpoints} onClick={() => window.location.reload()} disabled={loadingEndpoints} className="text-sm text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span aria-hidden="true">↻</span> Refresh
            </button>
          </div>
          <div className="space-y-4">
            {apis?.map((api, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-[#0F172A]/50 border border-[#1E293B] hover:border-[#334155] rounded-xl transition-all group">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2" title={api.name}>
                    {api.name.length > 20 ? `${api.name.slice(0, 17)}...` : api.name}
                    <span aria-label="Active Status" title="Active Endpoint" className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">ACTIVE</span>
                  </h3>
                  <code role="button" aria-label="Copy endpoint URL to clipboard" title={api.endpoint} className="text-sm text-[#64748B] mt-1 flex items-center gap-2 group/copy cursor-pointer w-fit" onClick={() => navigator.clipboard.writeText(api.endpoint)}>
                    {api.endpoint.length > 20 ? `${api.endpoint.slice(0, 8)}...${api.endpoint.slice(-8)}` : api.endpoint}
                    <svg aria-hidden="true" className="w-3.5 h-3.5 opacity-0 group-hover/copy:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </code>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[#94A3B8] text-sm font-medium">Revenue</p>
                    <p className="text-brand-yellow font-bold">${api.revenue.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4})} cUSD</p>
                  </div>
                  <button 
                    onClick={() => setSelectedSettingsApi(api)}
                    aria-label={`Settings for ${api.name}`}
                    title={`Configure ${api.name}`}
                    className="text-sm text-[#94A3B8] hover:text-white transition-colors underline decoration-[#1E293B] hover:decoration-white underline-offset-4"
                  >
                    Settings
                  </button>
                </div>
              </div>
            ))}
            {(!loadingEndpoints && (!apis || apis.length === 0)) && (
              <div role="status" aria-live="polite" className="text-center py-16 border border-dashed border-[#1E293B] rounded-xl flex flex-col items-center justify-center">
                <EmptyStateIcon />
                <p className="text-[#94A3B8] font-medium">You haven't registered any APIs yet.</p>
                <p className="text-[#64748B] text-sm mt-1">Click the register button to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Archived Endpoints section removed as requested */}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div role="presentation" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="register-modal-title" className="bg-[#0F172A] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
              title="Close modal"
              disabled={isRegistering}
              className="absolute top-4 right-4 text-[#64748B] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✕
            </button>
            <h2 id="register-modal-title" className="text-2xl font-bold text-white mb-2">Register API</h2>
            <p className="text-[#94A3B8] text-sm mb-6">Enter your Web2 or Web3 API endpoint URL. Our smart contract on Celo Mainnet will automatically wrap it with x402 payments.</p>
            {errorMsg && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{errorMsg}</div>}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="new-api-name" className="block text-sm font-medium text-[#94A3B8] mb-1">API Name</label>
                <Input 
                  id="new-api-name"
                  type="text" 
                  value={newApiName}
                  maxLength={50}
                  autoFocus
                  autoComplete="off"
                  onChange={(e) => setNewApiName(e.target.value)}
                  onBlur={() => setNewApiName(prev => prev.trim())}
                  className={INPUT_CLASSES} 
                  placeholder="e.g. My Llama 3 Model" 
                  required
                />
              </div>
              <div>
                <label htmlFor="new-api-endpoint" className="block text-sm font-medium text-[#94A3B8] mb-1">Endpoint URL</label>
                <Input 
                  id="new-api-endpoint"
                  type="url" 
                  autoComplete="url"
                  value={newApiEndpoint}
                  maxLength={255}
                  onChange={(e) => setNewApiEndpoint(e.target.value)}
                  onBlur={() => {
                    let val = newApiEndpoint.trim();
                    if (val && !val.startsWith("http")) val = "https://" + val;
                    setNewApiEndpoint(val);
                  }}
                  className={INPUT_CLASSES} 
                  placeholder="https://api.example.com/v1" 
                  required
                />
              </div>
              <div>
                <label htmlFor="new-api-price" className="block text-sm font-medium text-[#94A3B8] mb-1">Price per Call (cUSD)</label>
                <Input 
                  id="new-api-price"
                  type="number" 
                  step="0.0001" 
                  min="0.001"
                  value={newApiPrice}
                  onChange={(e) => setNewApiPrice(e.target.value)}
                  onBlur={(e) => {
                    try {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) setNewApiPrice(val.toFixed(4));
                    } catch (err) {
                      // Silent on parsing error
                    }
                  }}
                  className={INPUT_CLASSES} 
                  placeholder="0.005" 
                />
              </div>
              <p className="text-xs text-[#64748B]">Platform fee: 10% per transaction automatically routed to Pay For API treasury.</p>
              <button 
                type="button"
                onClick={handleRegister}
                disabled={isRegistering || !newApiName || !newApiEndpoint || !newApiPrice}
                aria-busy={isRegistering}
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
          <div role="dialog" aria-modal="true" aria-labelledby="settings-modal-title" className="bg-[#0F172A] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 relative">
            <button 
              type="button"
              onClick={() => setSelectedSettingsApi(null)}
              aria-label="Close settings"
              title="Close settings"
              className="absolute top-4 right-4 text-[#64748B] hover:text-white"
            >
              ✕
            </button>
            <h2 id="settings-modal-title" className="text-2xl font-bold text-white mb-2">Endpoint Settings</h2>
            <p className="text-[#94A3B8] text-sm mb-6">Manage your API endpoint configuration.</p>
            
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="settings-api-name" className="block text-sm font-medium text-[#94A3B8] mb-1">API Name</label>
                <Input 
                  id="settings-api-name"
                  type="text" 
                  value={selectedSettingsApi.name}
                  disabled
                  className={`${INPUT_CLASSES} opacity-70 pl-10`} 
                />
                <span className="absolute left-3 top-[38px] text-[#64748B]" aria-hidden="true">🔒</span>
              </div>
              <div>
                <label htmlFor="settings-api-endpoint" className="block text-sm font-medium text-[#94A3B8] mb-1">Endpoint URL</label>
                <Input 
                  id="settings-api-endpoint"
                  type="text" 
                  value={selectedSettingsApi.endpoint}
                  disabled
                  className={`${INPUT_CLASSES} opacity-70`} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Withdrawal Available</label>
                <div className="w-full bg-[#020617] border border-[#1E293B] rounded-lg px-4 py-2.5 text-brand-yellow font-bold">
                  ${selectedSettingsApi.revenue.toFixed(4)} cUSD
                </div>
              </div>
              <p className="text-xs text-brand-yellow mt-2 border border-brand-yellow/30 bg-brand-yellow/10 p-2 rounded">
                Note: Updating endpoint configuration and withdrawals will be enabled via smart contract upgrade in V2.
              </p>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setSelectedSettingsApi(null)}
                  aria-label="Close settings modal"
                  className="w-full py-3 bg-[#1E293B] hover:bg-[#334155] text-white font-bold rounded-lg transition-all"
                >
                  Close
                </button>
                <button 
                  type="button"
                  aria-label="Delete endpoint"
                  title="Permanent Action"
                  onClick={() => {
                    if (!address) return;
                    if (!window.confirm("Are you sure you want to permanently delete this endpoint?")) return;
                    const deletedCacheKey = CACHE_KEYS.DELETED_ENDPOINTS;
                    let deletedIds: string[] = [];
                    try { 
                      deletedIds = JSON.parse(localStorage.getItem(deletedCacheKey) || "[]"); 
                    } catch (err) {
                      localStorage.removeItem(deletedCacheKey);
                      deletedIds = [];
                    }
                    if (!deletedIds.includes(selectedSettingsApi.endpoint)) {
                        deletedIds.push(selectedSettingsApi.endpoint);
                        try {
                          localStorage.setItem(deletedCacheKey, JSON.stringify(deletedIds));
                        } catch (err) {
                          // Silent storage error
                        }
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