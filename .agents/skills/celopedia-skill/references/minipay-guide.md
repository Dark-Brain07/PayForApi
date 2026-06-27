# MiniPay Development Guide

> **Single source of truth:** https://docs.minipay.xyz/ — all implementation details in this file are derived from and cross-checked against the official MiniPay developer docs.
> - docs.celo.org mirror: https://docs.celo.org/build-on-celo/build-on-minipay/*
>
> For the full page-by-page index of `docs.minipay.xyz`, see `minipay-docs-map.md`.

MiniPay is a non-custodial stablecoin wallet integrated into Opera Mini and available as a standalone app on Android and iOS. It's the fastest growing wallet in the Global South with 16M+ total wallet activations, 470M+ transactions processed, 400M+ Mini App transactions to date, 50+ Mini Apps live, available in 66+ countries.

> Stats sourced from the official MiniPay Q1 2026 report: https://forum.celo.org/t/minipay-update-q1-2026/13273

> Wallet counts are updated by the MiniPay team via the MiniPay site and Celo blog. If a precise current number is needed, prefer fetching from those sources over the number above.

- Android: https://play.google.com/store/apps/details?id=com.opera.minipay
- iOS: https://apps.apple.com/de/app/minipay-easy-global-wallet/id6504087257

### Live Mini Apps in discovery (for builders)

To see **what is already shipping** in MiniPay (categories, publishers, deep links) and how **country targeting** works, use the skill reference **`minipay-live-apps.md`**. It is a **snapshot** from the discovery export, **not** a live API — and **not every app is available in every country**; the reference documents whitelist/blacklist hints from the export.

---

## Quickstart

### Scaffold a Mini App

```bash
npx @celo/celo-composer@latest create -t minipay
```

> **Prefer a raw Next.js setup without Composer?** See `minipay-scaffold-from-scratch.md` for a minimal `create-next-app` + viem + ngrok path — useful for integrating MiniPay into an existing Next.js project or skipping Composer's monorepo/Hardhat scaffolding.

### Requirements

- TypeScript v5+
- Viem v2+
- Physical Android or iOS device (emulators do NOT work)
- ngrok for local testing

### Install Dependencies

```bash
npm install viem@2 @celo/abis @celo/identity
```

---

## MiniPay Detection

Check if your dApp is running inside MiniPay:

```typescript
function isMiniPay(): boolean {
  return typeof window !== "undefined"
    && window.ethereum !== undefined
    && window.ethereum.isMiniPay === true;
}
```

---

## Wallet Connection

### Without Any Library (simplest)

```typescript
import { createWalletClient, custom } from "viem";
import { celo, celoSepolia } from "viem/chains";

const client = createWalletClient({
  chain: celo,
  transport: custom(window.ethereum),
});

const [address] = await client.getAddresses();
```

### With Wagmi (React)

```typescript
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

// Auto-connect in MiniPay (no connect button needed)
useEffect(() => {
  if (window.ethereum?.isMiniPay) {
    connect({ connector: injected({ target: "metaMask" }) });
  }
}, []);
```

### Conditional Connect Button

```tsx
const [hideConnectBtn, setHideConnectBtn] = useState(false);

useEffect(() => {
  if (window.ethereum?.isMiniPay) {
    setHideConnectBtn(true);
    connect({ connector: injected({ target: "metaMask" }) });
  }
}, []);

// Only show connect button outside MiniPay
{!hideConnectBtn && <ConnectButton />}
```

---

## Supported Stablecoins

| Token | Symbol | Token Address | Decimals | `feeCurrency` (for gas) |
|-------|--------|---------------|----------|-------------------------|
| Mento Dollar | USDm (cUSD) | `0x765DE816845861e75A25fCA122bb6898B8B1282a` | 18 | `0x765DE816845861e75A25fCA122bb6898B8B1282a` (same) |
| USDC | USDC | `0xcebA9300f2b948710d2653dD7B07f33A8B32118C` | 6 | `0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B` (**adapter**) |
| USDT | USDT | `0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e` | 6 | `0x0e2a3e05bc9a16f5292a6170456a710cb89c6f72` (**adapter**) |

**Important — two separate things**:

1. **Decimals**: USDm has 18 decimals; USDC/USDT have 6. Always check decimals before displaying amounts.
2. **Fee abstraction**: For **balances, transfers, and approvals**, use the **Token Address** column. For the **`feeCurrency` transaction field** (paying gas in stablecoins), use the **`feeCurrency` adapter address** — USDC/USDT transactions will **fail** if you pass the token address instead of the adapter. See `builder-guide.md` → _Allowed Fee Currencies (Mainnet)_ for the canonical table and underlying mechanics (CIP-64, FeeCurrencyDirectory).

> **Bridged-token caveat:** the decimals above are for the **canonical** USDC/USDT on Celo. Bridged variants from other chains may have different decimals or different contract addresses. Always verify against the token's contract on Celoscan before integrating.

---

## Check Token Balance

```typescript
import { createPublicClient, http, formatUnits } from "viem";
import { celo } from "viem/chains";

const USDM_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const publicClient = createPublicClient({
  chain: celo,
  transport: http(),
});

const balance = await publicClient.readContract({
  address: USDM_ADDRESS,
  abi: ERC20_ABI,
  functionName: "balanceOf",
  args: [userAddress],
});

const formatted = formatUnits(balance, 18); // "12.50"
```

---

## Send Stablecoin Payment

```typescript
import { createWalletClient, custom, encodeFunctionData, parseUnits } from "viem";
import { celo } from "viem/chains";

const USDM_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

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
] as const;

const walletClient = createWalletClient({
  chain: celo,
  transport: custom(window.ethereum),
});

const [address] = await walletClient.getAddresses();

const data = encodeFunctionData({
  abi: ERC20_ABI,
  functionName: "transfer",
  args: [recipientAddress, parseUnits("1.00", 18)], // Send 1 USDm
});

const txHash = await walletClient.sendTransaction({
  account: address,
  to: USDM_ADDRESS,
  data,
  // Pay network fee with USDm (fee abstraction)
  feeCurrency: USDM_ADDRESS,
});
```

---

## Network Fee Estimation with Fee Currency

MiniPay users pay the network fee in stablecoins. Estimate the network fee in USDm:

```typescript
// Estimate gas units (internal — UI copy should say "network fee")
const gasEstimate = await publicClient.estimateGas({
  account: address,
  to: USDM_ADDRESS,
  data,
  feeCurrency: USDM_ADDRESS,
});

// Get gas price in USDm (per-unit fee rate)
const gasPrice = await publicClient.request({
  method: "eth_gasPrice",
  params: [USDM_ADDRESS], // Pass fee currency address
});

// Calculate total fee
const totalFee = gasEstimate * BigInt(gasPrice);
const feeFormatted = formatUnits(totalFee, 18); // e.g., "0.0001"
```

---

## Phone Number → Address Resolution

Resolve **E.164** numbers (e.g. `+14155552671`) to wallet addresses using **ODIS (PnP)** + **FederatedAttestations**. MiniPay mappings are attested under issuer **`0x7888612486844Bb9BE598668081c59A9f7367FBc`** (pass this as a **trusted issuer**, not as the ODIS quota account).

- **Quota**: Mainnet PnP queries need **non-zero `remainingQuota`**. A **USDm/cUSD balance alone is not enough** — you usually must **`payInCUSD`** on **OdisPayments** after **`increaseAllowance`** on the stable token. See **`odis-socialconnect.md`** for the full quota flow and contract addresses (`contracts.md`).

**Pattern** (ContractKit + `@celo/identity`; typical for **backend** signers — use **DEK / wallet signing** appropriately in Mini Apps):

```typescript
import { newKit } from "@celo/contractkit";
import { OdisUtils } from "@celo/identity";
import type { AuthSigner } from "@celo/identity/lib/odis/query";

const MINIPAY_ISSUER = "0x7888612486844Bb9BE598668081c59A9f7367FBc";

const kit = newKit("https://forno.celo.org");
kit.addAccount(walletPrivateKey); // 0x-prefixed hex
const locals = kit.connection.getLocalAccounts();
kit.defaultAccount = locals[0];
const quotaAccount = locals[0];

const serviceContext = OdisUtils.Query.getServiceContext(
  OdisUtils.Query.OdisContextName.MAINNET,
  OdisUtils.Query.OdisAPI.PNP,
);

const authSigner: AuthSigner = {
  authenticationMethod: OdisUtils.Query.AuthenticationMethod.WALLET_KEY,
  contractKit: kit,
};

const { obfuscatedIdentifier } =
  await OdisUtils.Identifier.getObfuscatedIdentifier(
    phoneE164,
    OdisUtils.Identifier.IdentifierPrefix.PHONE_NUMBER,
    quotaAccount,
    authSigner,
    serviceContext,
  );

const federated = await kit.contracts.getFederatedAttestations();
const { accounts } = await federated.lookupAttestations(obfuscatedIdentifier, [
  MINIPAY_ISSUER,
]);
// accounts[0] is the resolved address when an attestation exists
```

**Install**: `npm install @celo/contractkit @celo/identity`

See **`references/odis-socialconnect.md`** for troubleshooting, **DEK (`ENCRYPTION_KEY`)** auth, viem alternatives, and doc links.

### UI rule: never display raw addresses

MiniPay requires that apps identify users by **phone number**, not `0x…` hex addresses. When you need to show "who paid you" or "send to", prefer in order:

1. The phone number resolved via FederatedAttestations (when available).
2. An app-specific alias / username the user has set.
3. A truncated `0x123…abc` only as a secondary hint — never as the primary identifier.

This is part of MiniPay's submission requirements — see `minipay-requirements.md` §1.

---

## Custom Methods (MiniPay-native RPC)

> Canonical docs: https://docs.minipay.xyz/technical-references/custom-methods/custom-methods.html

MiniPay exposes three custom JSON-RPC methods via `window.ethereum`. They require a Viem custom client built from a typed schema.

### Setup — `useMiniPayClient` hook

```typescript
import { createWalletClient, custom } from "viem";
import { celo } from "viem/chains";

// Define the custom RPC schema once, import the hook wherever you need it
export function useMiniPayClient() {
  if (typeof window === "undefined" || !window.ethereum) return null;
  return createWalletClient({
    chain: celo,
    transport: custom(window.ethereum),
  });
}
```

---

### `minipay_getExchangeRate` — real-time FX rate

> Docs: https://docs.minipay.xyz/technical-references/custom-methods/get-exchange-rate.html

```typescript
import { useState, useCallback } from "react";
import { useMiniPayClient } from "./useMiniPayClient";

export function useGetExchangeRate() {
  const client = useMiniPayClient();
  const [rate, setRate] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getExchangeRate = useCallback(
    async ({ from, to }: { from: string; to: string }) => {
      if (!client) return;
      setIsPending(true);
      setError(null);
      try {
        const result = await client.request({
          method: "minipay_getExchangeRate" as any,
          params: [{ from, to }],
        });
        setRate(result as string);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsPending(false);
      }
    },
    [client],
  );

  return { getExchangeRate, rate, isPending, error };
}

// Usage — get USDT → NGN rate:
// const { getExchangeRate, rate } = useGetExchangeRate();
// await getExchangeRate({ from: "USDT", to: "NGN" });
```

---

### `minipay_scanQrCode` — native QR scanner

> Docs: https://docs.minipay.xyz/technical-references/custom-methods/scan-qr-code.html

```typescript
import { useState, useCallback } from "react";
import { useMiniPayClient } from "./useMiniPayClient";

export function useScanQrCode() {
  const client = useMiniPayClient();
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scanQrCode = useCallback(async () => {
    if (!client) return;
    setIsPending(true);
    setError(null);
    try {
      const result = await client.request({
        method: "minipay_scanQrCode" as any,
        params: [],
      });
      setScannedValue(result as string);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsPending(false);
    }
  }, [client]);

  return { scanQrCode, scannedValue, isPending, error };
}

// Usage:
// const { scanQrCode, scannedValue } = useScanQrCode();
// <button onClick={scanQrCode}>Scan QR</button>
```

---

### `minipay_requestContact` — native contact picker

> Docs: https://docs.minipay.xyz/technical-references/custom-methods/request-contact.html

Returns `{ name: string; address: string }` — the contact's name and their MiniPay wallet address.

```typescript
import { useState, useCallback } from "react";
import { useMiniPayClient } from "./useMiniPayClient";

interface MiniPayContact {
  name: string;
  address: string;
}

export function useRequestContact() {
  const client = useMiniPayClient();
  const [contact, setContact] = useState<MiniPayContact | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const requestContact = useCallback(async () => {
    if (!client) return;
    setIsPending(true);
    setError(null);
    try {
      const result = await client.request({
        method: "minipay_requestContact" as any,
        params: [],
      });
      setContact(result as MiniPayContact);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsPending(false);
    }
  }, [client]);

  return { requestContact, contact, isPending, error };
}

// Usage — pick a contact and pre-fill the recipient address:
// const { requestContact, contact } = useRequestContact();
// contact?.address → pre-fill send form
// contact?.name   → display "Send to João"
```

---

## Deeplinks

Host: `link.minipay.xyz`. Full table with all current deeplinks is in `minipay-docs-map.md` → _Deeplinks_.

| Deeplink | URL | Purpose |
|----------|-----|---------|
| Add Cash | `https://link.minipay.xyz/add_cash` (optionally `?tokens=USDm,USDC,USDT`) | Redirect users with low balance to top up |
| Open Mini App | `https://link.minipay.xyz/browse?url=xxx` | Deep-link into an approved Mini App |
| MiniApps tab | `https://link.minipay.xyz/discover` | Jump to the discovery tab |
| Transaction receipt | `https://link.minipay.xyz/receipt?tx=xxx[&celebrate]` | Show a receipt screen for a tx hash |

> **Canonical list:** https://docs.minipay.xyz/technical-references/deeplinks.html — fetch before shipping; MiniPay publishes new deeplinks periodically.
>
> **UI copy:** label this action **Deposit** in buttons/messages — not "Add Cash", "Onramp", or "Buy". See `minipay-requirements.md` §3.

---

## Testing with ngrok

MiniPay cannot access localhost. Use ngrok to expose your dev server:

```bash
# Start your dev server
npm run dev  # e.g., port 3000

# In another terminal
ngrok http 3000
```

### Configure dev server for ngrok

**Vite** (`vite.config.ts`):
```typescript
export default defineConfig({
  server: {
    allowedHosts: [".ngrok.io", ".ngrok-free.app"],
  },
});
```

**Next.js** — no special config needed, but add CORS headers if needed.

### Load in MiniPay

1. Open MiniPay on your device
2. Go to Settings > About > tap Version 7+ times to enable Developer Settings
3. Enable Developer Mode + Use Testnet
4. Enter your ngrok HTTPS URL in "Load Test Page"

### Remote Debugging

Connect your Android device via USB and visit `chrome://inspect` in desktop Chrome to debug the MiniPay WebView.

The ngrok dashboard at `http://localhost:4040` shows all requests for debugging.

---

## Important Constraints

1. **No emulators** — MiniPay requires a physical device
2. **Legacy transactions only** — MiniPay ignores EIP-1559 fields. Do not set `maxFeePerGas` / `maxPriorityFeePerGas`
3. **Fee abstraction** — MiniPay pays the network fee with USDm by default. Use the `feeCurrency` parameter
4. **No message signing** — `personal_sign` and `eth_signTypedData` are not supported
5. **Small screens** — Design for mobile-first, low-bandwidth environments
6. **2MB footprint** — Keep Mini App bundle size small
7. **No CELO in UI** — MiniPay hides CELO from users. Your app must only display and accept USDT / USDC / USDm; fee abstraction handles the network fee in stablecoins automatically
8. **Submission checklist** — before listing, review `minipay-requirements.md` for the 7-section official checklist (copy rules, 360×640, PageSpeed, ToS / Privacy, 24h SLA)
9. **No geolocation on iOS** — MiniPay iOS does not bridge `navigator.geolocation` to the OS. `getCurrentPosition` and `watchPosition` hang silently, no callback ever fires, even with location permission granted to MiniPay at the OS level. Same code works fine in MetaMask in-app browser (iOS and Android) and Safari with extension wallets, which points at MiniPay's WKWebView delegate not implementing the geolocation permission handlers. Android behavior untested. Tracked at https://github.com/celo-org/minipay/issues/44. Workaround: detect `isIOS && window.ethereum.isMiniPay` and offer a deep link out to MetaMask (`https://metamask.app.link/dapp/<host>`)

---

## UX Best Practices for Emerging Markets

- Display amounts in local currency when possible (use Mento local stablecoins)
- Minimize data usage — lazy load images, compress assets
- Design for small screens (most users are on budget Android phones)
- **Test at 360 × 640** — the minimum MiniPay WebView resolution. Use Chrome DevTools device mode to validate before submission
- **Use SVG or WebP for images** — avoid PNG/JPG for anything larger than a few KB
- Show clear transaction confirmations with USD equivalents
- Handle network errors gracefully (intermittent connectivity is common)
- Keep flows short — minimize steps to complete an action
- Support offline-capable patterns where possible
- **Show your app identity** — display your name and logo so users understand the service is operated by you, not by MiniPay
- **In-app support link** — Telegram, WhatsApp, email, or web portal, reachable from any screen
- **Link to ToS + Privacy Policy** from inside the app (footer or settings) — required for listing

See `minipay-requirements.md` for the full submission checklist.

---

## Funding for MiniPay Builders

- **Celo Builder Fund** (Verda Ventures): $25K investment for MiniPay builders
  - Contact: team@verda.ventures
- **Proof of Ship**: Monthly rewards for consistent building
  - Subscribe: https://celo-devs.beehiiv.com/subscribe
