# MiniPay Submission Requirements

> **Single source of truth:** https://docs.minipay.xyz/ — specifically https://docs.minipay.xyz/getting-started/submit-your-miniapp.html
> - Additional source: Opera MiniPay "Build for MiniPay: Developer Requirements" (official PDF)
>
> Last updated: 2026-05-18.

Getting a Mini App listed in MiniPay is a **two-stage process**:

1. **Intake form** — submit basic app info at `https://minipay.to/mini-apps`. If the app looks promising, the MiniPay team books a first call with you.
2. **Readiness form** — after the first call, MiniPay sends a full readiness form. The checklist in Stage 2 below is what they will assess against.

For how to build each piece, see `minipay-guide.md`, `minipay-templates.md`, and `minipay-scaffold-from-scratch.md`. For the full canonical docs index, see `minipay-docs-map.md`.

---

## Stage 1 — MiniPay Intake Form

Submit at: **`https://minipay.to/mini-apps`**

### ⚠️ Do not submit a half-built app

> If your app is not ready, **do not submit yet**. The MiniPay team triages on quality — if the submission is rough, they will **deprioritize follow-up communication**. You typically only get one good first impression, so wait until the app is in good shape before applying.

### What the intake form asks

| Field | Required | Notes |
|------|------|------|
| Developer / Company Name | ✅ | Who's building this app |
| Email | ✅ | Contact email for follow-up |
| App URL | ✅ | Link to your live app or demo |
| Category | ✅ | DeFi · Social & Communities · Payments · Gaming · Content/News · Digital Collectibles · Other |
| Short Description | ✅ | One sentence — what does your app do? |
| Does your App already support MiniPay? | ✅ | Yes / No |
| App Screenshots | ✅ | PNG or JPG, max **500 KB** each, at least **3** high-quality screenshots showing the app in action |
| Smart Contract Address | optional | If applicable |
| Is the smart contract audited? | ✅ | Yes / No |
| Do you have social media? | ✅ | Yes / No |

### Recommended to have ready *before* you submit

These are a subset of the full Stage 2 checklist, but they are the items most visible from a quick review of your app and links. If they're not in place, the intake reviewer will likely bounce you. Get these right first:

**From "Seamless User Experience":**

- [ ] **Zero-click connect** — no "Connect Wallet" button when `window.ethereum.isMiniPay === true`
- [ ] **No `personal_sign` / `eth_signTypedData`** anywhere in the app
- [ ] **No raw `0x…` addresses** shown as the primary user identifier

**From "User-Facing Copy" (strict):**

- [ ] UI copy uses: **Network fee**, **Deposit**, **Withdraw**, **Stablecoin** — **not** gas / onramp / offramp / crypto

**From "Smart Contract Standards":**

- [ ] All contracts **verified on Celoscan**
- [ ] Sample **transaction hashes** collected for every user-facing method

**Other quick-look items:**

- [ ] Tested at **360 × 640** mobile resolution
- [ ] Images are **SVG or WebP**
- [ ] **PageSpeed Insights** score captured for production URL
- [ ] Redirects to the **Deposit deeplink** on insufficient balance (`https://minipay.opera.com/add_cash`)
- [ ] **App name + logo** visible and clearly distinct from MiniPay's own branding

If those are solid, submit the intake form. If they're not, build first, then come back.

---

## Stage 2 — Post-call Readiness Checklist

Everything below is what MiniPay assesses against in the readiness form **after your first call**. You don't need to submit this checklist with the intake form, but you'll need to satisfy all of it before listing.

### 1. Seamless User Experience

> Docs: https://docs.minipay.xyz/getting-started/wallet-connection.html · https://docs.minipay.xyz/getting-started/best-practices.html

- **Zero-Click Connect** — do **not** show a "Connect Wallet" button inside MiniPay. Auto-retrieve the wallet address from `window.ethereum`. Pattern: `minipay-templates.md` §1; detection: `minipay-guide.md` → MiniPay Detection; docs: https://docs.minipay.xyz/getting-started/wallet-connection.html.
- **No Message Signing** — do **not** prompt users to `personal_sign` or `eth_signTypedData` to access or authenticate. MiniPay does not support these methods. See `minipay-guide.md` → Important Constraints #4 and the wallet-connection doc above.
- **Phone-First Identity** — **never display raw `0x…` addresses** as the primary identifier. Show the phone number (resolved via ODIS → FederatedAttestations), an app-specific alias, or a truncated form only as a secondary hint. Lookup flow: `odis-socialconnect.md` and `minipay-guide.md` → Phone Number → Address Resolution; docs: https://docs.minipay.xyz/technical-references/phone-number-lookup.html.

### 2. Currency & Stablecoin Logic

> Docs: https://docs.minipay.xyz/technical-references/retrieve-balance.html · https://docs.minipay.xyz/technical-references/gas-estimation.html · https://docs.minipay.xyz/faq.html (Q9, Q11)

- **Token Support** — supported tokens are **USDT, USDC, and USDm only**. **Never display or require the CELO token**; MiniPay handles fees automatically via CIP-64 fee abstraction. See `faq.html` Q11.
- **Dynamic Adaptation** — adapt to the user's **preferred stablecoin** (the one they hold the most of). Working helper: `minipay-templates.md` §6 — Preferred Stablecoin Selection. Balance lookup: https://docs.minipay.xyz/technical-references/retrieve-balance.html.
- **Graceful Degradation** — if your app only supports one stablecoin, show a clear explainer ("This app accepts USDC only. Swap in MiniPay first.") instead of a broken interface.

### 3. User-Facing Copy (strict)

> Docs: https://docs.minipay.xyz/getting-started/submit-your-miniapp.html · https://docs.minipay.xyz/getting-started/best-practices.html (Transaction UX)

Replace crypto-jargon with user-friendly terms everywhere a real user sees them (buttons, tooltips, error messages, copy):

| ❌ Don't say | ✅ Say |
|------|------|
| Gas / Gas fee | **Network fee** |
| Onramp / Buy (crypto) | **Deposit** |
| Offramp / Sell (crypto) | **Withdraw** |
| Crypto / Crypto token | **Stablecoin** or **Digital dollar** |
| Wallet address (as primary identifier) | Phone number |

**Scope:** all UI strings, button labels, tooltips, error messages. Code identifiers and RPC method names (`gasEstimate`, `eth_gasPrice`, `feeCurrency`) are technical — keep those as-is.

### 4. Technical Performance & Optimization

> Docs: https://docs.minipay.xyz/getting-started/submit-your-miniapp.html · https://docs.minipay.xyz/getting-started/best-practices.html (Performance, User Experience) · https://docs.minipay.xyz/getting-started/deployment.html

- **Mobile-First Resolution** — the UI must be responsive and fully functional at **360w × 640h**. This is the hard minimum from the readiness PDF, and the smaller of the two figures floating in MiniPay's public material — design and verify against 360 × 640. Use Chrome DevTools device mode to validate before submission.
- **Asset Optimization** — use **SVG or WebP** for images. Avoid PNG/JPG for anything larger than a few KB.
- **Performance Benchmarking** — submit a **PageSpeed Insights** score (`https://pagespeed.web.dev`) for your production URL with the form. Aim for 90+ on mobile. Low scores block listing.
- **Network Transparency** — provide a full manifest of every **URL, subdomain, and origin** your app calls (JS, CSS, fonts, RPCs, APIs). MiniPay reviews this for supply-chain risk.

### 5. Smart Contract Standards

> Docs: https://docs.minipay.xyz/getting-started/smart-contracts.html

- **Public Verification** — all your contract source code must be **verified on Celoscan** (`https://celoscan.io`) so users can inspect it. How-to: `builder-guide.md` → Verification.
- **Transaction Samples** — for every user-facing method your app uses, provide a **sample transaction link on Celoscan** with the submission.

### 6. Integration & Support

> Docs: https://docs.minipay.xyz/technical-references/deeplinks.html · https://docs.minipay.xyz/getting-started/best-practices.html (Error Handling)

- **Code Guidelines** — use the patterns in this skill (`minipay-guide.md`, `minipay-templates.md`). They mirror the canonical MiniPay Developer Documentation at https://docs.minipay.xyz/.
- **Low-Balance Handling** — when a user cannot complete an action because their balance is too low, **redirect to the MiniPay Add Cash deeplink** rather than showing an error. Deeplink: `https://link.minipay.xyz/add_cash` (optionally `?tokens=USDm,USDC,USDT`). Canonical deeplink list: https://docs.minipay.xyz/technical-references/deeplinks.html — fetch before shipping; new deeplinks are added periodically.
- **Dedicated Support** — provide an **in-app support link** reachable from inside the Mini App (header icon, footer, or settings). Accepted channels: Telegram, WhatsApp, email, or web support portal.
- **SLA** — you must fix reported **critical issues within 24 hours**, or MiniPay will temporarily disable your listing.

#### Recommended: AI support agent on Telegram

Meeting the 24h SLA across a growing user base is hard with manual triage. A recommended pattern is to **front Telegram support with an AI agent** that:

- **Intakes** the user message, opens a ticket, and replies with an acknowledgement + ticket ID
- **Categorises** each ticket by **type** (bug · UX · payment failure · account / KYC · feature request) and **criticality** (P0 funds-at-risk · P1 blocking · P2 degraded · P3 question) so P0/P1 surface immediately for the 24h SLA
- **Prepares a draft resolution** from app logs, prior tickets, on-chain transaction state, and the FAQ — so a human dev only has to **review, approve, and send** (or override)
- **Tracks status** (open · awaiting-user · awaiting-dev · resolved) and chases stale tickets

You stay in the loop as the human approver, but the agent handles intake, classification, and first-draft answers — which is what makes the 24h critical-fix SLA actually achievable.

### 7. Branding & Legal

> Docs: https://docs.minipay.xyz/getting-started/submit-your-miniapp.html (Legal and Branding)

- **Clear Ownership** — display your app's **name and logo** prominently. It must be obvious to the user that the service is operated by your entity, not by MiniPay.
- **Legal Links** — provide accessible links to your **Terms of Service** and **Privacy Policy** from inside the app (footer or settings screen). Required for listing.

### 8. Analytics & Operational Visibility

MiniPay reviewers want to see that you actually know how your app is performing. Stand up a **public-or-shared stats / analytics page** for the Mini App that surfaces, at a minimum:

**Usage metrics** (from your web analytics — Plausible, PostHog, Umami, GA4, etc.):

- **DAU** — daily active users
- **MAU** — monthly active users
- **Retention** — D1 / D7 / D30 cohort retention (so growth isn't just acquisition)
- **Top countries** — useful given MiniPay's per-country availability

**On-chain metrics** (from your contracts on Celo — index via The Graph, Goldsky, Dune, or a lightweight indexer on top of Blockscout / Celoscan APIs):

- **Transactions per day / week / month / lifetime** broken down by contract method
- **Unique on-chain users** per period (distinct `tx.from`)
- **Volume** transacted per stablecoin (USDT / USDC / USDm), per period
- **Network fees paid** by users (sum of `gasUsed × effectiveGasPrice`, converted to USD)
- **Protocol fees / revenue** collected by your contracts (if your contract charges a fee — emit a `FeeCollected` event and sum it)
- **Failed-tx rate** — share of transactions that revert (proxy for UX or contract bugs)

**Why this matters for listing:** these numbers are what MiniPay uses to decide promotion, featuring, and continued listing. They also surface UX regressions (e.g. failed-tx spikes) before users complain.

Where to publish: a `/stats` page inside the Mini App (read-only, no wallet required) or a Dune dashboard linked from your app footer. Either works — the requirement is that the numbers are **fresh and reachable**.

---

## Deeplinks (MiniPay)

> Canonical list: https://docs.minipay.xyz/technical-references/deeplinks.html — fetch this before shipping; MiniPay publishes new deeplinks periodically. Full mirror in `minipay-docs-map.md` → _Deeplinks_.

| Deeplink | URL | When to use |
|----------|-----|-------------|
| Add Cash | `https://link.minipay.xyz/add_cash` (optionally `?tokens=USDm,USDC,USDT`) | Low balance; user needs to top up |
| Open Mini App | `https://link.minipay.xyz/browse?url=xxx` | Deep-link into an approved Mini App |
| MiniApps tab | `https://link.minipay.xyz/discover` | Jump to the discovery tab |
| Transaction receipt | `https://link.minipay.xyz/receipt?tx=xxx[&celebrate]` | Show a receipt screen for a tx hash |
| User's QR code | `https://link.minipay.xyz/qr` | Open the user's own QR screen |
| Invite friends | `https://link.minipay.xyz/invite_friends` | Trigger the invite flow |
| Pockets / balance | `https://link.minipay.xyz/balance` | Open the user's Pockets screen |

---

## Full pre-listing checklist (Stage 2)

Copy this block into your submission PR or internal review doc:

- [ ] Zero-click connect (no Connect Wallet button when `window.ethereum.isMiniPay === true`)
- [ ] No `personal_sign` / `eth_signTypedData` anywhere in the app
- [ ] No raw `0x…` addresses shown as primary user identifier
- [ ] Only USDT / USDC / USDm — no CELO in balances, selectors, or copy
- [ ] Picks the user's highest-balance stablecoin, or explains single-token UX clearly
- [ ] UI copy uses: **Network fee**, **Deposit**, **Withdraw**, **Stablecoin** (not gas / onramp / offramp / crypto)
- [ ] Tested at **360 × 640** mobile resolution
- [ ] Images are SVG or WebP
- [ ] PageSpeed Insights score captured for production URL
- [ ] URL / subdomain / origin manifest prepared
- [ ] All contracts verified on Celoscan
- [ ] Sample transaction hashes collected for every method
- [ ] Redirects to Deposit deeplink on insufficient balance
- [ ] In-app support link (Telegram / WhatsApp / email / web portal)
- [ ] Committed to 24h SLA for critical fixes
- [ ] App name + logo visible and clearly distinct from MiniPay's branding
- [ ] Terms of Service + Privacy Policy links accessible in-app
- [ ] **Stats / analytics page** published — DAU, MAU, retention, tx volume per stablecoin, network fees paid, protocol fees / revenue, failed-tx rate, tx counts per day / week / month / lifetime
- [ ] **AI support agent on Telegram** (recommended) — intakes tickets, categorises by type + criticality (P0–P3), drafts resolutions for human approval, tracks SLA
