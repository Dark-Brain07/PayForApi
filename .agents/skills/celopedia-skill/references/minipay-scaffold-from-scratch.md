# Scaffold a MiniPay Mini App from Scratch

For builders who want a minimal Next.js setup without Celo Composer's monorepo / Hardhat scaffolding. Produces a single Next.js app ready for MiniPay testing on ngrok.

> Pairs with the canonical MiniPay docs:
> - Project setup: https://docs.minipay.xyz/getting-started/project-setup.html
> - Setup with React: https://docs.minipay.xyz/getting-started/setup-react.html
> - Wallet connection: https://docs.minipay.xyz/getting-started/wallet-connection.html
> - Test in MiniPay: https://docs.minipay.xyz/getting-started/test-in-minipay.html

> **When to use this vs Celo Composer:** Use Composer (`npx @celo/celo-composer@latest create -t minipay`) if you want batteries-included (Hardhat, Foundry config, pre-wired wagmi/RainbowKit, monorepo layout). Use this guide if you want a clean single-app repo or are integrating MiniPay into an existing Next.js project.

---

## 1. Create the Next.js app

```bash
npx create-next-app@latest my-minipay-app --typescript --tailwind --app --no-src-dir
cd my-minipay-app
```

## 2. Install MiniPay dependencies

```bash
npm install viem@2 @celo/abis @celo/identity
```

That's the full runtime. No wagmi, no RainbowKit, no connector libraries required — MiniPay uses `window.ethereum` directly.

## 3. Add MiniPay detection + auto-connect

Drop the full starter from `minipay-templates.md` § 1 (_Next.js MiniPay Starter Page_) into `app/page.tsx`. It handles:

- `isMiniPay()` detection via `window.ethereum.isMiniPay`
- Auto-connect on mount (no connect button shown inside MiniPay)
- Fallback UI for browser testing outside MiniPay
- Balance display and a transfer flow with correct decimals

## 4. Configure ngrok for device testing

MiniPay requires HTTPS and a real device — emulators do **not** work. Expose localhost:

```bash
npx ngrok http 3000
```

Open the ngrok HTTPS URL on an Android or iOS device with MiniPay installed. The wallet injects `window.ethereum` automatically on any HTTPS origin.

## 5. Enable fee abstraction (recommended)

Users shouldn't need CELO to pay gas — let them pay in stablecoins. See `minipay-templates.md` § 3 (_Stablecoin Payment Flow_) for the viem pattern. Critical rule:

- **USDm** / **EURm** / **BRLm** (18-decimal): token address == `feeCurrency` address.
- **USDC** / **USDT** (6-decimal): `feeCurrency` **must** use the adapter address, not the token address. Transactions with the token address will fail.

Canonical table: `builder-guide.md` → _Allowed Fee Currencies (Mainnet)_. Quick reference also in `minipay-guide.md` § Supported Stablecoins.

## 6. Ship

- **Open-source the repo.** Required for Proof of Ship and several other programs.
- **Submit to MiniPay discovery.** See `minipay-live-apps.md` for the current pipeline notes and category/country targeting behavior.

---

## Minimal working example

A complete ~80-line starter is at `minipay-templates.md` § 1. Copy that into `app/page.tsx`, run `npm run dev`, start ngrok, and you have a working Mini App.

---

## Differences from Celo Composer

| Aspect | Composer (`-t minipay`) | This guide |
|--------|------------------------|-----------|
| Framework | Next.js (in a monorepo) | Next.js standalone |
| Contract tooling | Hardhat + Foundry pre-configured | None (add later if needed) |
| React wrapper | wagmi / RainbowKit pre-wired | Plain viem |
| Folder layout | `packages/react-app`, `packages/hardhat` | Flat `app/` |
| Best for | Full-stack dApp with contracts | Frontend-only Mini App or existing Next.js project |

Neither path is "better" — pick the one that matches what you're building.
