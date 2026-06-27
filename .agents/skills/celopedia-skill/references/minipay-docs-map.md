# MiniPay Documentation Map

> **Single source of truth:** https://docs.minipay.xyz/
> This file is the canonical index of all MiniPay developer documentation pages.
> All other `minipay-*.md` skill files defer to URLs listed here for authoritative content.
> Last updated: 2026-05-22

Use this to find the right page in MiniPay's developer docs for any topic. Links go directly to `docs.minipay.xyz`.

For the broader Celo docs map (chain, SDKs, contracts, governance), see `docs-map.md`. For the duplicate set of MiniPay quickstart pages hosted on `docs.celo.org`, see `docs-map.md` → _Build on MiniPay_.

---

## Getting Started

| Topic | URL |
|-------|-----|
| Overview | https://docs.minipay.xyz/getting-started/overview.html |
| Why MiniPay | https://docs.minipay.xyz/getting-started/why-minipay.html |
| Availability (countries / platforms) | https://docs.minipay.xyz/getting-started/availability.html |
| Quick Start | https://docs.minipay.xyz/getting-started/quick-start.html |

## Installation

| Topic | URL |
|-------|-----|
| Project setup | https://docs.minipay.xyz/getting-started/project-setup.html |
| Setup with React | https://docs.minipay.xyz/getting-started/setup-react.html |
| Test in MiniPay (on device) | https://docs.minipay.xyz/getting-started/test-in-minipay.html |
| FAQ | https://docs.minipay.xyz/faq.html |

## Guides

| Topic | URL |
|-------|-----|
| Wallet connection (auto-connect, `window.ethereum.isMiniPay`) | https://docs.minipay.xyz/getting-started/wallet-connection.html |
| UI & container | https://docs.minipay.xyz/getting-started/ui-and-container.html |
| Smart contracts (reads, writes, batching, events) | https://docs.minipay.xyz/getting-started/smart-contracts.html |
| Best practices (error handling, tx UX, security, performance) | https://docs.minipay.xyz/getting-started/best-practices.html |
| Deployment | https://docs.minipay.xyz/getting-started/deployment.html |
| Submit your Mini App | https://docs.minipay.xyz/getting-started/submit-your-miniapp.html |

## Reference — Overview

| Topic | URL |
|-------|-----|
| Technical references overview | https://docs.minipay.xyz/technical-references.html |
| Deeplinks (canonical list) | https://docs.minipay.xyz/technical-references/deeplinks.html |

## Reference — Wallet Operations

| Topic | URL |
|-------|-----|
| Retrieve balance | https://docs.minipay.xyz/technical-references/retrieve-balance.html |
| Send a transaction | https://docs.minipay.xyz/technical-references/send-transaction.html |
| Gas estimation | https://docs.minipay.xyz/technical-references/gas-estimation.html |
| Phone number lookup (ODIS / SocialConnect) | https://docs.minipay.xyz/technical-references/phone-number-lookup.html |

## Reference — Custom Methods

| Topic | URL |
|-------|-----|
| Overview | https://docs.minipay.xyz/technical-references/custom-methods/custom-methods.html |
| Get exchange rate | https://docs.minipay.xyz/technical-references/custom-methods/get-exchange-rate.html |
| Scan QR code | https://docs.minipay.xyz/technical-references/custom-methods/scan-qr-code.html |
| Request contact | https://docs.minipay.xyz/technical-references/custom-methods/request-contact.html |

## Deeplinks (host: `link.minipay.xyz`)

> Source: https://docs.minipay.xyz/technical-references/deeplinks.html — fetch before shipping; the list is updated periodically.

| Deeplink | URL | When to use |
|----------|-----|-------------|
| Add Cash | `https://link.minipay.xyz/add_cash` (optionally `?tokens=USDm,USDC,USDT`) | Low balance — redirect users to top up |
| Open Mini App | `https://link.minipay.xyz/browse?url=xxx` | Deep-link into an approved Mini App from outside MiniPay |
| MiniApps tab | `https://link.minipay.xyz/discover` | Jump to the discovery tab |
| Transaction receipt | `https://link.minipay.xyz/receipt?tx=xxx[&celebrate]` | Show the receipt screen for a tx hash (optionally with celebration animation) |
| User's QR code | `https://link.minipay.xyz/qr` | Open the user's own QR screen |
| Invite friends | `https://link.minipay.xyz/invite_friends` | Trigger the invite flow |
| Pockets / balance | `https://link.minipay.xyz/balance` | Open the user's Pockets screen |

All deeplinks require MiniPay installed and the user logged in.

## External: Build-on-MiniPay on docs.celo.org

These are the same MiniPay topics mirrored under `docs.celo.org`. Both sets are canonical and stay in sync; either is fine to link from a Mini App project.

| Topic | URL |
|-------|-----|
| Overview | https://docs.celo.org/build-on-celo/build-on-minipay/overview |
| Quickstart | https://docs.celo.org/build-on-celo/build-on-minipay/quickstart |
| Code Library | https://docs.celo.org/build-on-celo/build-on-minipay/code-library |
| Deeplinks | https://docs.celo.org/build-on-celo/build-on-minipay/deeplinks |
| Ngrok Setup (device testing) | https://docs.celo.org/build-on-celo/build-on-minipay/prerequisites/ngrok-setup |

## Submission

| Resource | URL |
|----------|-----|
| MiniPay intake form (Stage 1) | https://minipay.to/mini-apps |
| Submission docs page | https://docs.minipay.xyz/getting-started/submit-your-miniapp.html |

> Stage 1 = the public intake form. Stage 2 = the readiness form sent after the first call. Full checklist in `minipay-requirements.md`.

---

## Quick lookups

| If you need… | Go to |
|--------------|-------|
| Auto-connect / `isMiniPay` detection | `wallet-connection.html` · `faq.html` Q5 |
| Send a transaction | `technical-references/send-transaction.html` · `faq.html` Q7–Q8 |
| Pay gas in a stablecoin (CIP-64 fee abstraction) | `technical-references/gas-estimation.html` · `faq.html` Q9 |
| Phone → address lookup | `technical-references/phone-number-lookup.html` |
| Read on-chain balances | `technical-references/retrieve-balance.html` · `faq.html` Q10 |
| Supported tokens | `faq.html` Q11 |
| Smart-contract reads / writes / batching | `getting-started/smart-contracts.html` · `faq.html` Q12 |
| Test on a real device | `getting-started/test-in-minipay.html` · `faq.html` Q13 |
| Submit for listing | `getting-started/submit-your-miniapp.html` · `faq.html` Q14 |
| Add Cash deeplink (low-balance redirect) | `technical-references/deeplinks.html` |
| Available countries & platforms | `getting-started/availability.html` |
