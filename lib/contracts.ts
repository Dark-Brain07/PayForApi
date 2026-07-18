const API_REVENUE_SPLITTER_ADDRESS = "0x5ac6de9FAe3f424C7f07C65283B8953108aa5C78";

const COMMUNITY_NFT_ADDRESS = "0x0D2238a8E6a2c5951E6cBeb8e03278f5d0C8FFB6";

/** Global smart contract configuration mapping */
export const CONTRACTS = {
  COMMUNITY_NFT: {
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS ?? COMMUNITY_NFT_ADDRESS,
    abi: [
      "function mint(uint256 amount) external",
      "function totalSupply() external view returns (uint256)",
      "function MAX_SUPPLY() external view returns (uint256)",
      "function consecutiveMintDays(address) external view returns (uint256)",
      "function lastMintTime(address) external view returns (uint256)"
    ],
  },
  API_CREDITS: {
    address: process.env.NEXT_PUBLIC_CREDITS_ADDRESS || "0x486776B119aAf9eEe3c215D0e42d9Aa426A76b80",
    abi: [
      "function claim() external",
      "function balanceOf(address account) external view returns (uint256)",
      "function consecutiveDays(address) external view returns (uint256)",
      "function lastClaimTime(address) external view returns (uint256)"
    ],
  },
  API_REVENUE_SPLITTER: {
    address: API_REVENUE_SPLITTER_ADDRESS,
    abi: [
      "function registerApi(string memory endpointId) external",
      "function payForApi(string memory endpointId, address tokenAddress, uint256 amount) external",
      "function apiEndpoints(string memory) external view returns (address creator, bool isActive, uint256 totalRevenue)",
      "event ApiRegistered(string endpointId, address creator)"
    ]
  }
} as const;

export const CELO_MAINNET_ID: number = 42220;

export const CELO_MAINNET = {
  chainId: CELO_MAINNET_ID,
  rpcUrl: "https://forno.celo.org",
  name: "Celo Mainnet",
  blockscout: "https://celo.blockscout.com",
} as const;

/** 
 * Master merchant wallet where the 10% platform protocol fee is routed. 
 * This address is hardcoded to receive all base payments.
 */
export const PROTOCOL_FEE_PERCENTAGE = 10;
export const MASTER_MERCHANT_WALLET = "0xfd4960F33670f3477ebe817B184dd59fC4961437";

/** 
 * Public treasury wallet used for accepting ecosystem donations.
 */
export const ECOSYSTEM_DONATION_WALLET = "0x6Ea99501B46040e9C99c6FfcCD7D64eA8F726476";
