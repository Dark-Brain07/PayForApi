/** Terminal boot sequences */
export const TERMINAL_BOOT_LOGS = [
  "> Initialize Celo Network...",
  "> Loading ERC-8004 Agent...",
  "> Loading MiniPay x x402 for payment...",
  "> Authenticating node connection...",
  "> Loading currencies: [USDm, EURm, KESm, BRLm, GHSm, COPm, PUSO] ... OK",
  "> Checking API Integrations... OK",
  "> SUCCESS: All systems operational."
] as const;

export const getTerminalLogs = (): readonly string[] => TERMINAL_BOOT_LOGS;

/** Formats and sanitizes terminal log messages */
export const formatLogMessage = (msg: string): string => (msg || '').trim();

/** Celo Mainnet Chain ID */
export const CELO_MAINNET_CHAIN_ID: number = 42220;
export const BLOCKS_TO_QUERY: number = 2000000;

/** Local storage cache keys */
export const CACHE_KEYS = {
  DELETED_ENDPOINTS: "deleted_endpoints_global"
} as const;
