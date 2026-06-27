# Celo Network Information

> Source: https://docs.celo.org/build-on-celo/network-overview

## Celo Mainnet

| Field | Value |
|-------|-------|
| Chain ID | `42220` |
| Network Name | Celo Mainnet |
| Currency Symbol | CELO |
| Public RPC | `https://forno.celo.org` (rate-limited) |
| Block Explorer (primary) | https://celoscan.io |
| Block Explorer (alt) | https://celo.blockscout.com |
| Block Time | ~1 second |
| Average Gas Fee | ~$0.0005 |
| Native Bridge | https://superbridge.app/celo |
| L2 Stack | OP Stack (Optimism rollup) |
| Data Availability | EigenDA v2 |
| Fault Proofs | ZK via Succinct SP1 (Jello hardfork) |
| L1 → L2 Migration | March 26, 2025 (block 31,056,500) |

### Fee-Accepted Tokens (Gas Abstraction)

Users can pay gas fees with these ERC-20 tokens instead of native CELO. The address below is what you pass in the `feeCurrency` transaction field — **for USDC/USDT this is the 6→18 decimal adapter, NOT the token address**. Passing the token address will cause the transaction to fail.

| Token | `feeCurrency` address | Notes |
|-------|-----------------------|-------|
| USDm (cUSD) | `0x765DE816845861e75A25fCA122bb6898B8B1282a` | 18 decimals — token == adapter |
| EURm (cEUR) | `0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73` | 18 decimals — token == adapter |
| USDC | `0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B` | **adapter** — token is `0xcebA9300f2b948710d2653dD7B07f33A8B32118C` |
| USDT | `0x0e2a3e05bc9a16f5292a6170456a710cb89c6f72` | **adapter** — token is `0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e` |

Canonical table with full mechanics: `builder-guide.md` → _Allowed Fee Currencies (Mainnet)_.

The `FeeCurrencyDirectory` contract at `0x15F344b9E6c3Cb6F0376A36A64928b13F62C6276` governs the allowlist.

> **Bridged-token caveat:** the decimals and addresses above are for the **canonical** USDC/USDT on Celo. Bridged variants from other chains (via third-party bridges) may have different decimals or different contract addresses. Always verify against the token's contract on Celoscan before integrating.

## Celo Sepolia Testnet

| Field | Value |
|-------|-------|
| Chain ID | `11142220` |
| Network Name | Celo Sepolia |
| Currency Symbol | CELO |
| Public RPC | `https://forno.celo-sepolia.celo-testnet.org` |
| OP-Node RPC | `https://op.celo-sepolia.celo-testnet.org` |
| Block Explorer | https://celo-sepolia.blockscout.com |
| Bridge | https://testnets.superbridge.app |

### Testnet Faucets

- Google Cloud: https://cloud.google.com/application/web3/faucet/celo/sepolia
- Celo Faucet: https://faucet.celo.org/celo-sepolia

## RPC Providers

| Provider | Notes |
|----------|-------|
| Forno (Celo-native) | `https://forno.celo.org` — free, rate-limited |
| Alchemy | Enhanced APIs, webhooks, analytics |
| QuickNode | Global edge network, Streams |
| Infura (Consensys) | Standard Ethereum-style RPC |
| Ankr | All-in-one Web3 hub |
| Lava | Decentralized RPC network |
| OnFinality | Multi-chain RPC |
| Dwellir | Nordic-hosted nodes |

## Block Explorers

| Explorer | URL | Notes |
|----------|-----|-------|
| Celoscan | https://celoscan.io | Primary, Etherscan-family |
| Blockscout | https://celo.blockscout.com | Open-source, full-featured (explorer.celo.org redirects here) |

### Celoscan vs Blockscout — which to use

| Task | Recommended | Why |
|------|-------------|-----|
| Verifying a contract (UI) | Celoscan | Better Solidity compiler version matching, clearer error messages |
| Reading ERC-20 token transfers / holders | Blockscout | More complete ERC-20 indexing, better token-specific UX |
| Programmatic event log access | Blockscout | REST API (`/api?module=logs`) avoids `eth_getLogs` block-range limits |
| General transaction inspection | Either | Feature parity for basic tx/block views |

Both explorers are authoritative for chain state. Pick based on the specific task.

## RPC Limits & Gotchas

### `eth_getLogs` — 50,000 block range limit

Celo's public RPC endpoints (and most managed providers) reject `eth_getLogs` requests spanning more than ~50,000 blocks with:

```json
{"code": -32011, "message": "block range is too large"}
```

At ~1s block time this is only ~14 hours of history per request. Any indexer, analytics page, or event-history feature must paginate.

**TypeScript workaround (viem):**

```ts
import { createPublicClient, http, parseAbiItem } from "viem";
import { celo } from "viem/chains";

const client = createPublicClient({ chain: celo, transport: http() });
const CHUNK = 45_000n; // under the 50k limit with headroom

async function getLogsChunked(params: {
  address: `0x${string}`;
  event: ReturnType<typeof parseAbiItem>;
  fromBlock: bigint;
  toBlock: bigint;
}) {
  const all = [];
  for (let from = params.fromBlock; from <= params.toBlock; from += CHUNK + 1n) {
    const to = from + CHUNK > params.toBlock ? params.toBlock : from + CHUNK;
    const logs = await client.getLogs({
      address: params.address,
      event: params.event,
      fromBlock: from,
      toBlock: to,
    });
    all.push(...logs);
  }
  return all;
}
```

For very deep history, prefer a subgraph or Blockscout's `/api?module=logs` endpoint (see comparison above) over chunked `eth_getLogs`.
