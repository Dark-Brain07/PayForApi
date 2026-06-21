export const TERMINAL_BOOT_LOGS = [
  "> Initialize Celo Network...",
  "> Loading ERC-8004 Agent...",
  "> Loading MiniPay x x402 for payment...",
  "> Authenticating node connection...",
  "> Loading currencies: [cUSD, cEUR, cKES, cBRL, cGHS, cCOP, PUSO] ... OK",
  "> Checking API Integrations... OK",
  "> SUCCESS: All systems operational."
] as const;

export const BLOCKS_TO_QUERY = 2000000;

export const CACHE_KEYS = {
  DELETED_ENDPOINTS: "deleted_endpoints_global"
} as const;
