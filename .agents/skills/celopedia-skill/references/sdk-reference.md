# Celo SDK Quick Reference

> Sources: docs.celo.org/tooling/libraries-sdks/*, celo-org/agent-skills

---

## Viem (Recommended)

Viem has first-class Celo support with `feeCurrency` for CIP-64 transactions.

**Install**: `npm install viem`

### Celo-Specific Features

| Feature | Usage |
|---------|-------|
| Chain export | `import { celo, celoSepolia } from "viem/chains"` |
| Fee abstraction | `feeCurrency` field on `sendTransaction` |
| Gas estimation | Pass `feeCurrency` to `estimateGas` |
| Gas price in token | `eth_gasPrice` with fee currency param |
| CIP-64 tx type | Automatic when `feeCurrency` is set |

### Key Patterns

```typescript
import { createPublicClient, createWalletClient, http, custom } from "viem";
import { celo } from "viem/chains";

// Public client (read-only)
const publicClient = createPublicClient({
  chain: celo,
  transport: http(),
});

// Wallet client (browser)
const walletClient = createWalletClient({
  chain: celo,
  transport: custom(window.ethereum),
});

// Send with fee abstraction
await walletClient.sendTransaction({
  to: "0x...",
  value: 0n,
  feeCurrency: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
});

// Read contract
await publicClient.readContract({
  address: "0x...",
  abi: myAbi,
  functionName: "myFunction",
  args: [arg1, arg2],
});

// Write contract
await walletClient.writeContract({
  address: "0x...",
  abi: myAbi,
  functionName: "myFunction",
  args: [arg1, arg2],
  feeCurrency: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
});
```

**Docs**: https://docs.celo.org/tooling/libraries-sdks/viem/index

---

## Wagmi (React Hooks)

Wagmi provides React hooks for wallet connection, contract reads/writes, and transaction sending — all with Celo support.

**Install**: `npm install wagmi viem @tanstack/react-query`

### Key Hooks

| Hook | Purpose |
|------|---------|
| `useAccount` | Get connected address and chain |
| `useConnect` | Connect wallet |
| `useDisconnect` | Disconnect wallet |
| `useSendTransaction` | Send transaction (supports `feeCurrency`) |
| `useReadContract` | Read contract state |
| `useWriteContract` | Write to contract |
| `useWaitForTransactionReceipt` | Wait for tx confirmation |
| `useBalance` | Get native balance |

### Fee Abstraction with Wagmi

```tsx
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

function PayWithUSDm() {
  const { data: hash, sendTransaction } = useSendTransaction();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  return (
    <button onClick={() => sendTransaction({
      to: "0xRecipient",
      value: 0n,
      feeCurrency: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    })}>
      {isSuccess ? "Sent!" : "Send (gas in USDm)"}
    </button>
  );
}
```

**Docs**: https://docs.celo.org/tooling/libraries-sdks/wagmi (if available) or https://wagmi.sh

---

## ContractKit (Legacy)

ContractKit is Celo's original SDK. **Use viem instead for new projects.** ContractKit is only needed for:
- Legacy governance contract interactions
- ODIS phone number privacy (with **`@celo/identity`** for PnP: `getObfuscatedIdentifier`, quota, `getFederatedAttestations`)
- Old Celo-specific contracts not on the OP Stack

**ODIS / SocialConnect**: Use **`@celo/contractkit` + `@celo/identity`** together for **`WALLET_KEY`** auth and on-chain **`FederatedAttestations`** wrappers. Full flow, **OdisPayments** quota, **MiniPay issuer**, and **DEK** auth are documented in **`odis-socialconnect.md`**.

**Install**: `npm install @celo/contractkit @celo/identity`

```typescript
import { newKit } from "@celo/contractkit";

const kit = newKit("https://forno.celo.org");
const accounts = await kit.web3.eth.getAccounts();

// Governance interactions
const governance = await kit.contracts.getGovernance();
const proposals = await governance.getDequeue();

// Election voting
const election = await kit.contracts.getElection();
const validators = await election.getValidatorGroupsVotes();
```

**Docs**: https://docs.celo.org/tooling/libraries-sdks/contractkit/index

---

## Composer Kit (UI Components)

Pre-built React components themed for Celo dApps.

**Install**: Check https://docs.celo.org/tooling/libraries-sdks/composer-kit for latest install instructions.

**Docs**: https://docs.celo.org/tooling/libraries-sdks/composer-kit

---

## Thirdweb SDK

Full-stack Web3 SDK with 500+ wallet options, prebuilt UI, and one-click deploy.

**Install**: `npm install thirdweb`

```typescript
import { createThirdwebClient, getContract } from "thirdweb";
import { celo } from "thirdweb/chains";

const client = createThirdwebClient({ clientId: "YOUR_CLIENT_ID" });

const contract = getContract({
  client,
  chain: celo,
  address: "0xContractAddress",
});
```

**Docs**: https://docs.celo.org/tooling/libraries-sdks/thirdweb-sdk/index

---

## Ethers.js

Standard ethers.js works with Celo. No special configuration needed beyond the RPC URL.

**Install**: `npm install ethers`

```typescript
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://forno.celo.org");
const balance = await provider.getBalance("0xAddress");
```

Note: ethers.js does NOT have native `feeCurrency` support. Use viem for fee abstraction.

**Docs**: https://docs.celo.org/tooling/libraries-sdks/ethers/index

---

## Web3.js

Standard web3.js works with Celo.

**Install**: `npm install web3`

Note: Like ethers.js, web3.js does NOT have native `feeCurrency` support. Use viem for fee abstraction.

**Docs**: https://docs.celo.org/tooling/libraries-sdks/web3/index

---

## Wallet Integration Libraries

| Library | Use Case | Docs |
|---------|----------|------|
| Reown (WalletConnect) | Multi-wallet connection | https://docs.celo.org/tooling/libraries-sdks/reown/index |
| Dynamic | Embedded wallets + social login | https://docs.celo.org/tooling/libraries-sdks/dynamic/index |
| JAW | Wallet abstraction | https://docs.celo.org/tooling/libraries-sdks/jaw/index |
| Portal | Wallet infrastructure | https://docs.celo.org/tooling/libraries-sdks/portal/index |

---

## When to Use What

```
Need fee abstraction?
  └── Yes → Viem (only SDK with native feeCurrency support)
  └── No → Any SDK works

Building React dApp?
  └── Yes → Wagmi + RainbowKit (+ viem under the hood)
  └── No → Viem directly

Need embedded wallets / social login?
  └── Yes → Thirdweb or Dynamic
  └── No → Standard wallet connection

Interacting with old Celo governance?
  └── Yes → ContractKit
  └── No → Don't use ContractKit

Quick prototype?
  └── Yes → Thirdweb (prebuilt UI + dashboard)
  └── No → Viem + Wagmi for full control
```

---

## Building for MiniPay? Read This First

MiniPay is Celo's embedded stablecoin wallet with 14M+ users across 60+ countries. If you are building a Mini App for MiniPay, the SDK patterns above apply — but with **important constraints and required patterns** that differ from a standard Celo dApp.

### SDK choice for MiniPay

| Requirement | Recommendation |
|---|---|
| Wallet connection | **Viem with `custom(window.ethereum)`** or **Wagmi with `injected()` connector** only. Do not use RainbowKit in MiniPay — it renders a multi-wallet selection modal that is incompatible with MiniPay's injected wallet model. |
| Transactions | **Viem** — required for `feeCurrency` (CIP-64 fee abstraction). All transactions must pay network fees in a stablecoin, never in CELO. |
| React hooks | **Wagmi** works well — use `injected()` connector, not `metaMask()` or `walletConnect()`. |

### MiniPay detection and zero-click connect (required)

Inside MiniPay, the wallet is pre-injected. **Never show a "Connect Wallet" button.** Detect MiniPay and connect automatically on mount:

```typescript
import { useEffect } from "react";
import { useConnect, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";

function isMiniPay(): boolean {
  return typeof window !== "undefined" &&
    (window as { ethereum?: { isMiniPay?: boolean } }).ethereum?.isMiniPay === true;
}

// In your root component or layout:
export function AutoConnect() {
  const { connect } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isMiniPay() && !isConnected) {
      connect({ connector: injected() });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
```

Then in your UI, hide wallet-related buttons when inside MiniPay:

```tsx
{!isMiniPay() && <ConnectWalletButton />}
```

### Fee abstraction is mandatory in MiniPay

MiniPay hides CELO from users entirely. Every write transaction must include `feeCurrency` so the network fee is paid in a stablecoin automatically:

```typescript
// Pay network fee in USDm — user never needs to hold CELO
await walletClient.writeContract({
  address: CONTRACT_ADDRESS,
  abi: myAbi,
  functionName: "myFunction",
  args: [arg1, arg2],
  feeCurrency: "0x765DE816845861e75A25fCA122bb6898B8B1282a", // USDm
});
```

For USDC and USDT, use the **adapter address** (not the token address) in `feeCurrency` — see `builder-guide.md` → *Allowed Fee Currencies (Mainnet)* for the full table.

### MiniPay constraints summary

| Constraint | Detail |
|---|---|
| No `personal_sign` | MiniPay does not support `personal_sign` or `eth_signTypedData`. Design auth around wallet address only. |
| Legacy transactions only | Do not set `maxFeePerGas` or `maxPriorityFeePerGas`. Use `feeCurrency` instead. |
| No CELO in UI | Never display CELO balances or require CELO payments. Show USDm / USDT / USDC only. |
| Physical device required | MiniPay does not work in browser emulators. Test on a real Android or iOS device via ngrok. |
| 360 × 640 minimum | Design and test at this viewport. Use Chrome DevTools device mode before submission. |

### Full MiniPay documentation

For the complete integration guide, code templates, phone number resolution via ODIS, deeplinks, ngrok setup, and the official submission checklist:

- `minipay-guide.md` — detection, auto-connect, stablecoin transfers, fee abstraction, deeplinks
- `minipay-templates.md` — copy-paste code for 6 common Mini App patterns
- `minipay-scaffold-from-scratch.md` — minimal Next.js + viem setup without Celo Composer
- `minipay-requirements.md` — official submission checklist (PageSpeed, ToS/Privacy, copy rules, 24h SLA)
- `minipay-app-fit.md` — scorecard to evaluate whether your idea is a good fit for MiniPay before building
