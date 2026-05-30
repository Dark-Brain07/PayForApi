export const CONTRACTS = {
  API_GATEWAY: {
    address: process.env.NEXT_PUBLIC_GATEWAY_ADDRESS || "0x0000000000000000000000000000000000000000",
    abi: [
      "function payForAPI(address token, uint256 amount, uint256 productId, bytes32 requestId) external",
      "function getProduct(uint256 productId) external view returns (tuple(string name, string description, uint256 priceUSD, bool active, uint256 totalCalls, uint256 totalRevenue))",
      "function getUserStats(address user) external view returns (uint256 calls, uint256 spent)",
      "function getRecentPayments(uint256 count) external view returns (tuple(address user, address token, uint256 amount, string apiProduct, uint256 timestamp, bytes32 requestId)[])",
      "function totalCalls() external view returns (uint256)",
      "function totalRevenue() external view returns (uint256)",
      "function productCount() external view returns (uint256)",
    ],
  },
  AGENT_REGISTRY: {
    address: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000",
    abi: [
      "function registerAgent(string name, string description, bytes32 pubKeyHash) external",
      "function getAgent(address wallet) external view returns (tuple(string name, string description, address wallet, bytes32 pubKeyHash, bool active, uint256 registeredAt, uint256 totalRequests))",
      "function registeredAgents(address) external view returns (bool)",
      "function getTotalAgents() external view returns (uint256)",
    ],
  },
} as const;

export const CELO_MAINNET = {
  chainId: 42220,
  rpcUrl: "https://forno.celo.org",
  name: "Celo Mainnet",
  blockscout: "https://celo.blockscout.com",
} as const;
