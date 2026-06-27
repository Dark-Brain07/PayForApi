# Celo Builder Guide

> Sources: docs.celo.org, celo-org/agent-skills

Essential knowledge for building on Celo. Covers what's different from Ethereum, common gotchas, and Celo-specific patterns.

---

## Key Differences from Ethereum

| Feature | Ethereum | Celo |
|---------|----------|------|
| Block time | ~12 seconds | ~1 second |
| Gas fees | $1-50+ | ~$0.0005 |
| Fee currency | ETH only | CELO, USDC, USDT, USDm, EURm, and more |
| Native token | ETH | CELO (also available as ERC-20) |
| L2 type | — | OP Stack rollup (EigenDA + ZK fault proofs) |
| Chain ID | 1 | 42220 |
| Transaction types | EIP-1559, EIP-2930 | Same + CIP-64 (fee abstraction) |

---

## CELO Token Duality

On Celo, CELO is both the native gas token AND an ERC-20 token at address `0x471EcE3750Da237f93B8E339c536989b8978a438`.

This means:
- `address.balance` returns native CELO balance
- `IERC20(0x471EcE...).balanceOf(address)` returns the same balance
- Transfers work both ways: native `msg.value` or ERC-20 `transfer()`
- This is implemented via the `0xfd` precompile (not available on Foundry forks — see gotchas below)

---

## Fee Abstraction (CIP-64)

Users can pay gas fees with ERC-20 tokens instead of native CELO. This is Celo's killer feature for onboarding.

### How It Works

1. User specifies a `feeCurrency` address in the transaction
2. The FeeCurrencyDirectory contract (`0x15F344b9E6c3Cb6F0376A36A64928b13F62C6276`) maintains the allowlist
3. Gas cost is calculated in the specified token
4. Token is deducted from the user's balance for gas payment

### Allowed Fee Currencies (Mainnet)

**Important**: USDC and USDT use 6 decimals, so they require **adapter contracts** that normalize to 18 decimals. Use the adapter address (not the token address) in the `feeCurrency` field.

| Token | Decimals | Token Address | feeCurrency Address |
|-------|----------|---------------|---------------------|
| USDm (cUSD) | 18 | `0x765DE816845861e75A25fCA122bb6898B8B1282a` | `0x765DE816845861e75A25fCA122bb6898B8B1282a` (same) |
| EURm (cEUR) | 18 | `0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73` | `0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73` (same) |
| BRLm (cREAL) | 18 | `0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787` | `0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787` (same) |
| USDC | 6 | `0xcebA9300f2b948710d2653dD7B07f33A8B32118C` | `0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B` (adapter) |
| USDT | 6 | `0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e` | `0x0e2a3e05bc9a16f5292a6170456a710cb89c6f72` (adapter) |

The table above is the common subset. The **full allowlist is larger** — it also includes many Mento local-currency stablecoins (KESm, COPm, GHSm, NGNm, ZARm, GBPm, and more) plus a few other assets. Rather than hardcode the whole list, **fetch it live** with `getCurrencies()` (see below) — that's the canonical, always-current source. For MiniPay Mini Apps and consumer payments, **USDm, USDC, and USDT** are the fee currencies users actually hold, so default to those.

> **Wallet/SDK support:** fee abstraction works in Celo-native wallets (MiniPay, Valora) today, with **Ledger support coming soon**. On the SDK side, **viem** supports the `feeCurrency` field natively — **ethers.js and web3.js do not**.

The `FeeCurrencyDirectory` contract at `0x15F344b9E6c3Cb6F0376A36A64928b13F62C6276` governs the allowlist. Query it:

```typescript
const FEE_CURRENCY_DIRECTORY = "0x15F344b9E6c3Cb6F0376A36A64928b13F62C6276";
const currencies = await publicClient.readContract({
  address: FEE_CURRENCY_DIRECTORY,
  abi: [{ name: "getCurrencies", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "address[]" }] }],
  functionName: "getCurrencies",
});
```

### Viem Implementation

```typescript
import { createWalletClient, custom } from "viem";
import { celo } from "viem/chains";

const client = createWalletClient({
  chain: celo,
  transport: custom(window.ethereum),
});

// Send transaction with gas paid in USDm
const txHash = await client.sendTransaction({
  account: "0x...",
  to: "0x...",
  value: 0n,
  data: "0x...",
  feeCurrency: "0x765DE816845861e75A25fCA122bb6898B8B1282a", // USDm
});
```

### Gas Estimation with Fee Currency

```typescript
// Estimate gas in USDm
const gas = await publicClient.estimateGas({
  account: "0x...",
  to: "0x...",
  data: "0x...",
  feeCurrency: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
});

// Get gas price denominated in USDm
const gasPrice = await publicClient.request({
  method: "eth_gasPrice",
  params: ["0x765DE816845861e75A25fCA122bb6898B8B1282a"],
});
```

---

## Contract Verification

### Celoscan (Etherscan V2 unified API)

Celoscan no longer issues its own API keys. Etherscan unified all family explorers under one V2 API and one key. Use an Etherscan key (free at https://etherscan.io/myapikey) for Celoscan, Basescan, Arbiscan, Optimistic Etherscan, etc.

In `foundry.toml`:

```toml
[etherscan]
celo = { key = "${ETHERSCAN_API_KEY}", chain = 42220 }
alfajores = { key = "${ETHERSCAN_API_KEY}", chain = 44787 }
```

Then:

```bash
# Hardhat
npx hardhat verify --network celo <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>

# Foundry (no --verifier-url needed; foundry derives it from `chain`)
forge verify-contract <CONTRACT_ADDRESS> <CONTRACT_NAME> \
  --chain celo \
  --constructor-args $(cast abi-encode "constructor(...)" ...) \
  --watch
```

### Blockscout

```bash
forge verify-contract <CONTRACT_ADDRESS> <CONTRACT_NAME> \
  --chain-id 42220 \
  --verifier blockscout \
  --verifier-url https://celo.blockscout.com/api
```

---

## Celo Sepolia Testnet Setup

| Field | Value |
|-------|-------|
| Chain ID | `11142220` |
| RPC | `https://forno.celo-sepolia.celo-testnet.org` |
| Explorer | https://celo-sepolia.blockscout.com |
| Faucets | https://faucet.celo.org/celo-sepolia, https://cloud.google.com/application/web3/faucet/celo/sepolia |

---

## Sending CELO — common failure & fix

Because CELO has **both** a native path (like ETH) **and** an ERC-20 path at `0x471EcE3750Da237f93B8E339c536989b8978a438`, first-time builders often pick the wrong one and silently lose funds or revert.

**Failure modes:**

1. **Native path expected, ERC-20 used.** User sends CELO via `token.transfer(recipient, amount)`. Recipient contract's `receive()` / `fallback()` never fires. Any logic tied to native receipt (e.g. a staking deposit that checks `msg.value`) silently no-ops.
2. **ERC-20 path expected, native used.** User sends CELO via `{ value: amount, to: recipient }`. An ERC-20-expecting contract (checking `balanceOf` / `transferFrom`) sees nothing.

**Fix — pick the path that matches the recipient's ABI:**

```ts
import { createWalletClient, custom, parseEther, erc20Abi } from "viem";
import { celo } from "viem/chains";

const client = createWalletClient({ chain: celo, transport: custom(window.ethereum) });
const CELO_ERC20 = "0x471EcE3750Da237f93B8E339c536989b8978a438" as const;

// Sending to an EOA or a contract with receive()/fallback(): use NATIVE
await client.sendTransaction({
  to: recipient,
  value: parseEther("1"), // 1 CELO as native
  account,
});

// Sending to an ERC-20-aware contract (Uniswap router, Aave Pool, etc.): use ERC-20
await client.writeContract({
  address: CELO_ERC20,
  abi: erc20Abi,
  functionName: "transfer",
  args: [recipient, parseEther("1")],
  account,
});
```

> **Rule of thumb:** if the recipient's method signature takes `uint256 amount` and you've separately approved an allowance, use the ERC-20 path. If it's `payable` and reads `msg.value`, use the native path. When in doubt, read the target contract on Celoscan.

---

## Common Gotchas

### 1. Foundry Fork Testing & Token Duality

Foundry's EVM does NOT simulate Celo's `0xfd` precompile. On a fork test:
- `IERC20(CELO).transfer()` does NOT move native balance
- **Fix**: Use `vm.deal(address, amount)` to pre-fund contracts with native CELO
- **Fix**: Use `deal(CELO_ADDRESS, user, amount)` for ERC-20 balance (without `adjust_totalSupply=true` for stCELO)

### 2. stCELO/CELO Ratio is NOT 1:1

stCELO accrues value over time. Current rate is ~0.9 stCELO per 1 CELO. Always use the oracle price for conversions.

### 3. MiniPay Only Supports Legacy Transactions

Do not set `maxFeePerGas` or `maxPriorityFeePerGas` for MiniPay transactions. Use `feeCurrency` instead.

### 4. Token Decimal Mismatch

- USDm/EURm/BRLm: **18 decimals**
- USDC/USDT: **6 decimals**

Always check decimals before formatting amounts. Using `parseUnits("1", 18)` for USDC will send 1 trillion USDC.

### 5. Staking Gas Costs

Celo staking operations (via stCELO Manager) are expensive: ~800K-1M gas per operation due to deep governance call chains.

### 6. Small Staking Amounts Fail

`stCELO Manager.deposit()` can fail with `NotAbleToDistributeVotes()` for amounts less than ~0.5 CELO.

### 7. L2 Migration Context

Celo migrated from L1 to L2 on March 26, 2025 (block 31,056,500). Old tutorials referencing Celo as an L1 are outdated. The current stack is OP Stack + EigenDA + ZK fault proofs.

### 8. `eth_getLogs` — 50K Block Range Limit

Celo RPCs reject `eth_getLogs` spans > ~50,000 blocks with error `-32011 block range is too large`. Any indexer or event-history feature must paginate. See `network-info.md` → _RPC Limits & Gotchas_ for the chunked viem workaround.

### 9. viem strict EIP-55 checksum

viem 2.x rejects addresses whose mixed-case does NOT match the EIP-55 checksum exactly. You'll see:

```text
Address "0xa9aB7390f79b937C9c0A1FdFA1A40c2e145EAbd8" is invalid.
- Address must match its checksum counterpart.
```

The trap: Foundry's `forge script` prints deploy addresses in lowercase. If you copy-paste that into a `.env` file then manually re-case it (e.g. to make it "look prettier"), you can land on a mixed-case string that ISN'T the valid EIP-55 checksum, and viem will reject it everywhere. The failure is silent in fire-and-forget code paths and surfaces only in server logs.

Fix: either store the address all-lowercase (viem accepts that) or get the correct checksum first:

```bash
cast to-check-sum-address 0xa9ab7390f79b937c9c0a1fdfa1a40c2e145eabd8
# -> 0xa9ab7390f79B937C9c0a1FDFA1A40C2E145eAbd8
```

Apply that exact string everywhere (env vars in `.env`, Railway / Vercel env, hardcoded constants, docs). Sweep with grep before shipping; ESLint won't catch this.

---

## Recommended Development Flow

1. **Setup** — Choose Foundry (recommended) or Hardhat
2. **Configure** — Set up Celo Sepolia testnet in your config
3. **Fund** — Get testnet CELO from faucet
4. **Develop** — Write contracts (standard Solidity, nothing Celo-specific needed)
5. **Test** — Fork mainnet for integration tests: `forge test --fork-url https://forno.celo.org`
6. **Deploy** — Deploy to Celo Sepolia first, then mainnet
7. **Verify** — Verify on Celoscan and/or Blockscout
8. **Integrate** — Add fee abstraction for better UX

---

## Wallet Fee Abstraction Support

| Wallet | Fee Abstraction | Notes |
|--------|----------------|-------|
| MiniPay | Full | Built into Opera Mini, uses USDm by default |
| Valora | Full | Native Celo wallet, user-selectable fee currency |
| Celo Terminal | Full | Desktop wallet with Ledger support |
| MetaMask | No | Standard EIP-1559, gas paid in CELO only |
| Coinbase Wallet | No | Standard EVM format |

**Library support**: Only **viem** has native `feeCurrency` support. Ethers.js and web3.js do NOT.

Detect wallet capabilities:
```typescript
function detectWalletCapabilities() {
  const isMiniPay = window.ethereum?.isMiniPay === true;
  const isValora = window.ethereum?.isValora === true;
  const supportsFeeCurrency = isMiniPay || isValora;
  return { isMiniPay, isValora, supportsFeeCurrency };
}
```

---

## SDK Selection Guide

| Need | Use | Why |
|------|-----|-----|
| TypeScript + Celo-specific features | **Viem** | Native `feeCurrency` support, `celo` chain export |
| React dApp with wallets | **Wagmi + RainbowKit** | Best wallet connection UX |
| Quick prototyping | **Thirdweb** | Prebuilt UI, 500+ wallet options |
| Legacy governance/staking | **ContractKit** | Only needed for old Celo-specific contracts |
| UI components for Celo | **Composer Kit** | Pre-built Celo-themed components |
| Smart contract dev | **Foundry** (preferred) or **Hardhat** | Foundry is faster, Hardhat has more plugins |
