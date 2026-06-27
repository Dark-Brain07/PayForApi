# MiniPay Code Templates

Ready-to-use code for common Mini App patterns. Canonical reference docs: https://docs.minipay.xyz/ — full per-page index in `minipay-docs-map.md`.

## Contents

| # | Template | What it does | Drop into |
|---|----------|--------------|-----------|
| 1 | Next.js MiniPay Starter Page | Full starter: detection, auto-connect, balance, transfer | `app/page.tsx` |
| 2 | `useMiniPay` React Hook | Reusable hook for wallet state inside MiniPay | `hooks/useMiniPay.ts` |
| 3 | Stablecoin Payment Flow | Pay-with-stablecoin UX (approve + transfer + feeCurrency) | `components/PayButton.tsx` |
| 4 | Bill Payment Pattern | Recurring / bill-style payment component | `components/BillPayment.tsx` |
| 5 | Multi-Token Balance Display | Show USDm/USDC/USDT balances with correct decimals | `components/Balances.tsx` |
| 6 | Preferred Stablecoin Selection | Pick the user's highest-balance stablecoin (+ low-balance deeplink + graceful degradation) | `lib/stablecoins.ts` |

Each template is standalone and copy-paste ready. USDC/USDT `feeCurrency` uses adapter addresses — see `builder-guide.md` → _Allowed Fee Currencies (Mainnet)_.

---

## 1. Next.js MiniPay Starter Page

_Drop this into: `app/page.tsx`_

```tsx
"use client";

import { useEffect, useState } from "react";
import { createWalletClient, createPublicClient, custom, http, formatUnits } from "viem";
import { celo } from "viem/chains";

// Token addresses — use for balances, transfers, approvals
const USDM_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as const;
const USDC_ADDRESS = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C" as const;
const USDT_ADDRESS = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e" as const;

// feeCurrency addresses — use ONLY in the `feeCurrency` transaction field (pay network fee in stablecoin).
// USDm is 18-decimal so token==adapter. USDC/USDT are 6-decimal and require adapter contracts —
// passing the token address in `feeCurrency` will make the transaction fail.
// Canonical table: builder-guide.md → Allowed Fee Currencies (Mainnet).
const USDM_FEE_CURRENCY = USDM_ADDRESS;
const USDC_FEE_CURRENCY = "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B" as const;
const USDT_FEE_CURRENCY = "0x0e2a3e05bc9a16f5292a6170456a710cb89c6f72" as const;

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export default function MiniPayApp() {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isMiniPay, setIsMiniPay] = useState(false);

  const publicClient = createPublicClient({
    chain: celo,
    transport: http(),
  });

  useEffect(() => {
    async function connect() {
      if (typeof window === "undefined" || !window.ethereum) return;

      const mp = window.ethereum.isMiniPay === true;
      setIsMiniPay(mp);

      if (mp) {
        const client = createWalletClient({
          chain: celo,
          transport: custom(window.ethereum),
        });
        const [addr] = await client.getAddresses();
        setAddress(addr);

        // Fetch USDm balance
        const bal = await publicClient.readContract({
          address: USDM_ADDRESS,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [addr],
        });
        setBalance(formatUnits(bal, 18));
      }
    }
    connect();
  }, []);

  if (!isMiniPay) {
    return <div>Please open this app in MiniPay</div>;
  }

  return (
    <div>
      <p>Connected: {address}</p>
      <p>USDm Balance: ${balance}</p>
    </div>
  );
}
```

---

## 2. useMiniPay React Hook

_Drop this into: `hooks/useMiniPay.ts`_

```typescript
import { useEffect, useState, useCallback } from "react";
import { createWalletClient, createPublicClient, custom, http, formatUnits } from "viem";
import { celo } from "viem/chains";

const USDM_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as const;

const BALANCE_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export function useMiniPay() {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const publicClient = createPublicClient({
    chain: celo,
    transport: http(),
  });

  const refreshBalance = useCallback(async () => {
    if (!address) return;
    const bal = await publicClient.readContract({
      address: USDM_ADDRESS,
      abi: BALANCE_ABI,
      functionName: "balanceOf",
      args: [address],
    });
    setBalance(formatUnits(bal, 18));
  }, [address]);

  useEffect(() => {
    async function init() {
      if (typeof window === "undefined" || !window.ethereum) {
        setIsLoading(false);
        return;
      }

      const mp = window.ethereum.isMiniPay === true;
      setIsMiniPay(mp);

      if (mp) {
        const client = createWalletClient({
          chain: celo,
          transport: custom(window.ethereum),
        });
        const [addr] = await client.getAddresses();
        setAddress(addr);
      }
      setIsLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (address) refreshBalance();
  }, [address, refreshBalance]);

  return { address, balance, isMiniPay, isLoading, refreshBalance };
}
```

---

## 3. Stablecoin Payment Flow

_Drop this into: `components/PayButton.tsx`_

```typescript
import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  encodeFunctionData,
  parseUnits,
  formatUnits,
} from "viem";
import { celo } from "viem/chains";

const USDM_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as const;

const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

async function sendPayment(
  recipientAddress: `0x${string}`,
  amountUsd: string, // e.g., "5.00"
) {
  const walletClient = createWalletClient({
    chain: celo,
    transport: custom(window.ethereum),
  });

  const publicClient = createPublicClient({
    chain: celo,
    transport: http(),
  });

  const [senderAddress] = await walletClient.getAddresses();
  const amount = parseUnits(amountUsd, 18);

  // Check balance first
  const balance = await publicClient.readContract({
    address: USDM_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [senderAddress],
  });

  if (balance < amount) {
    throw new Error(
      `Insufficient balance: ${formatUnits(balance, 18)} USDm, need ${amountUsd}`
    );
  }

  // Encode transfer call
  const data = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [recipientAddress, amount],
  });

  // Send with fee abstraction (network fee paid in USDm)
  const txHash = await walletClient.sendTransaction({
    account: senderAddress,
    to: USDM_ADDRESS,
    data,
    feeCurrency: USDM_ADDRESS,
  });

  // Wait for confirmation
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  return {
    txHash,
    success: receipt.status === "success",
    blockNumber: receipt.blockNumber,
  };
}
```

---

## 4. Bill Payment Pattern

_Drop this into: `components/BillPayment.tsx`_

Common Mini App pattern: user enters an amount, selects a service, and pays.

```tsx
"use client";

import { useState } from "react";
import { useMiniPay } from "./useMiniPay";
import { createWalletClient, custom, encodeFunctionData, parseUnits } from "viem";
import { celo } from "viem/chains";

const USDM_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as const;
const MERCHANT_ADDRESS = "0x..."; // Your merchant wallet

const TRANSFER_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export default function BillPayment() {
  const { address, balance, isMiniPay, isLoading } = useMiniPay();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  async function handlePay() {
    if (!address || !amount) return;
    setStatus("pending");

    try {
      const client = createWalletClient({
        chain: celo,
        transport: custom(window.ethereum),
      });

      const data = encodeFunctionData({
        abi: TRANSFER_ABI,
        functionName: "transfer",
        args: [MERCHANT_ADDRESS, parseUnits(amount, 18)],
      });

      await client.sendTransaction({
        account: address,
        to: USDM_ADDRESS,
        data,
        feeCurrency: USDM_ADDRESS,
      });

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (!isMiniPay) return <p>Open in MiniPay</p>;

  return (
    <div>
      <h1>Pay Bill</h1>
      <p>Balance: ${balance} USDm</p>
      <input
        type="number"
        placeholder="Amount in USD"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePay} disabled={status === "pending"}>
        {status === "pending" ? "Processing..." : "Pay"}
      </button>
      {status === "success" && <p>Payment successful!</p>}
      {status === "error" && <p>Payment failed. Try again.</p>}
    </div>
  );
}
```

---

## 5. Multi-Token Balance Display

_Drop this into: `components/Balances.tsx`_

```tsx
import { createPublicClient, http, formatUnits } from "viem";
import { celo } from "viem/chains";

// Token addresses for balance reads. For `feeCurrency` (network fee) payments,
// USDC/USDT need their adapter addresses instead — see builder-guide.md.
const TOKENS = [
  { symbol: "USDm", address: "0x765DE816845861e75A25fCA122bb6898B8B1282a", decimals: 18 },
  { symbol: "USDC", address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C", decimals: 6 },
  { symbol: "USDT", address: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e", decimals: 6 },
] as const;

const BALANCE_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

async function getAllBalances(userAddress: `0x${string}`) {
  const client = createPublicClient({ chain: celo, transport: http() });

  const balances = await Promise.all(
    TOKENS.map(async (token) => {
      const raw = await client.readContract({
        address: token.address,
        abi: BALANCE_ABI,
        functionName: "balanceOf",
        args: [userAddress],
      });
      return {
        symbol: token.symbol,
        balance: formatUnits(raw, token.decimals),
      };
    })
  );

  return balances;
}
```

---

## 6. Preferred Stablecoin Selection (dynamic adaptation)

_Drop this into: `lib/stablecoins.ts`_

MiniPay requires apps to adapt to the user's preferred stablecoin — the one they hold the most of. Use this helper before any payment flow.

```ts
import { createPublicClient, http, erc20Abi, formatUnits } from "viem";
import { celo } from "viem/chains";

const STABLES = [
  { symbol: "USDm", address: "0x765DE816845861e75A25fCA122bb6898B8B1282a", decimals: 18 },
  { symbol: "USDC", address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C", decimals: 6  },
  { symbol: "USDT", address: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e", decimals: 6  },
] as const;

export type Preferred = {
  symbol: string;
  address: `0x${string}`;
  decimals: number;
  balance: bigint;
  human: number;
};

export async function getPreferredStablecoin(
  user: `0x${string}`
): Promise<Preferred | null> {
  const client = createPublicClient({ chain: celo, transport: http() });
  const balances = await Promise.all(
    STABLES.map(async (t) => {
      const raw = await client.readContract({
        address: t.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [user],
      });
      return {
        ...t,
        balance: raw,
        human: Number(formatUnits(raw, t.decimals)),
      };
    })
  );
  const withFunds = balances.filter((b) => b.balance > 0n);
  if (withFunds.length === 0) return null; // trigger low-balance deeplink
  withFunds.sort((a, b) => b.human - a.human);
  return withFunds[0] as Preferred;
}
```

### Pair with the low-balance deeplink

When the user has zero balance in all three tokens, redirect to MiniPay's Deposit view rather than showing an error:

```ts
import { getPreferredStablecoin } from "@/lib/stablecoins";

async function startPayment(userAddress: `0x${string}`) {
  const preferred = await getPreferredStablecoin(userAddress);
  if (!preferred) {
    // Low balance — redirect to MiniPay Add Cash (see minipay-requirements.md §6)
    // Canonical: https://docs.minipay.xyz/technical-references/deeplinks.html
    window.location.href = "https://link.minipay.xyz/add_cash";
    return;
  }
  // Proceed with preferred.address + preferred.decimals as the charge token.
}
```

### Graceful degradation — single-token apps

If your app only supports one stablecoin, show a clear explainer instead of a broken UI (required by MiniPay submission rules):

```tsx
export function SingleTokenNotice() {
  return (
    <div className="rounded-md border p-3 text-sm">
      This app accepts <strong>USDC</strong> only. If your MiniPay balance is
      in USDm or USDT, tap{" "}
      <a href="https://minipay.opera.com/add_cash" className="underline">
        Deposit in MiniPay
      </a>{" "}
      to swap or top up first.
    </div>
  );
}
```
