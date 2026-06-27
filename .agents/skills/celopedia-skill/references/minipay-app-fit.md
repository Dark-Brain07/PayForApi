# MiniPay App Fit & Priority Framework

> **Who this is for:** Founders and builders deciding whether to build a Mini App for MiniPay —
> and how to prioritise effort if they do.
>
> **What it answers:** "Should I target MiniPay?", "How strong is my product-channel fit?",
> "Which category gives me the best chance of listing?", and "What will block me before I even submit?"
>
> **Data sources:** `minipay-live-apps.md` (catalog snapshot) · `minipay-requirements.md`
> (official submission checklist) · `minipay-guide.md` (technical constraints).

---

## 0. Understand Your Builder Profile First

Before scoring your idea, answer these questions honestly. Your profile changes what you should build.

**Q1 — How mature is your app?**
- I have an idea / prototype → **First-time or early builder**
- I have live users and traction → **Established builder**

**Q2 — Do you have a background in the domain you're building in?**
- Yes (e.g. fintech, trading, lending) → **Domain expert**
- No → **Domain generalist**

**Q3 — Does your app involve B2B relationships (partnerships, white-label, enterprise)?**
- Yes → You need to show existing traction and contracts. Without them, MiniPay is not the right channel yet.
- No → Continue to scorecard.

**What this means for your recommendations:**

| Profile | Best path |
|---------|-----------|
| First-time founder, no traction | Start with **x2earn games** or **pay-as-you-go AI tools** — low regulatory risk, fastest to ship, high demand |
| Domain expert in fintech / tradfi, existing users | Financial apps (savings, credit, FX) are viable — but require proper licensing in each market you serve |
| Second-time founder with tradfi background | More options open, including credit/lending — still requires compliance |
| B2B app, no traction yet | Not a good MiniPay fit right now. Come back when you have live users |
| B2B app, proven traction | Strong fit — MiniPay gives you direct reach to 14M+ wallets |

> ⚠️ **Financial apps (credit, lending, savings, FX) require licensing in most MiniPay primary markets.** Building without proper compliance puts your users at risk and your app at risk of removal. If you are not established in the domain, default to games or AI pay-as-you-go instead.

---

## 1. Who Is the MiniPay User?

Before scoring your idea, know the person on the other end of the screen.

| Dimension | Reality |
|-----------|---------|
| **Geography** | Global South — Nigeria, Kenya, Uganda, Ghana, South Africa, Brazil, Colombia, Philippines (60+ countries) |
| **Device** | Budget Android (most common), basic iOS. Expect small screens, low RAM |
| **Connectivity** | Intermittent, low bandwidth. 2G/3G is common in primary markets |
| **Financial profile** | Unbanked or underbanked. Stablecoins serve as the primary savings and payment tool |
| **Stablecoins available** | USDm, USDC, USDT. Network fees are handled automatically |
| **Crypto literacy** | Non-crypto-native. Terms like "gas", "onramp", "wallet address", and "blockchain" are UX failures |
| **Session length** | Short. Single-handed use on mobile, often in noisy or low-attention environments |

**The core implication:** Apps that solve real everyday problems (paying for things, earning income, sending money, accessing services) for non-crypto users win in MiniPay. Apps that require crypto knowledge, long forms, or heavy UI lose.

---

## 2. App Fit Scorecard

Score your idea on 5 dimensions (0–2 each). Total out of 10.

### A. Stablecoin-native
Does the core value of your app involve sending, receiving, saving, or earning USDm / USDT / USDC?

| Score | What it means |
|-------|---------------|
| **2** | The core user flow is entirely in stablecoins — users earn, spend, or move USDm/USDT/USDC |
| **1** | Stablecoins are present but secondary to the main experience |
| **0** | The app does not involve stablecoin transactions at all |

> **Note:** Network fees are handled automatically by MiniPay via CIP-64 fee abstraction — users can see the fee by tapping Info on the transaction approval screen, but never need to manage it manually. CELO should not be prominent in your UI. See `builder-guide.md` → *Allowed Fee Currencies (Mainnet)*.

---

### B. Short-session friendly
Can the primary action be completed in under 60 seconds on a budget Android?

| Score | What it means |
|-------|---------------|
| **2** | Core action takes ≤ 3 taps, works reliably on a slow connection |
| **1** | 4–7 steps, requires decent connectivity |
| **0** | Multi-step flow, data-heavy UI, or complex input required |

> Budget Android users on 3G have a very low tolerance for loading times and form friction. Every extra tap is potential churn. Keep the happy path ruthlessly short.

---

### C. Local market fit
Does your app address a need that is acute in at least one of MiniPay's primary markets?

| Score | What it means |
|-------|---------------|
| **2** | Directly solves a known, documented pain point in a specific target market — describe which country and why |
| **1** | Useful broadly but not specifically designed for Global South or emerging market users |
| **0** | Designed primarily for users who already have banking infrastructure |

**Example everyday pain points by market:**

| Country | Acute need |
|---------|-----------|
| 🇳🇬 Nigeria | Airtime top-up, bill payment, peer money transfer, earning in USD |
| 🇰🇪 Kenya | Micro-savings, small business payments, mobile-first commerce |
| 🇧🇷 Brazil | Fast peer payments, earning opportunities, everyday commerce |
| 🇨🇴 Colombia | Gig worker payouts, peer-to-peer transfers, everyday services |
| 🇵🇭 Philippines | Remittances, digital tipping, mobile-first earning |
| 🇿🇦 South Africa | Township commerce, peer payments, informal savings groups (stokvels) |

> **When filling this dimension:** name the specific country, the pain point, and why your app addresses it better than what already exists in that market.
>
> ⚠️ **Licensing reminder:** financial use cases in these markets (payments, savings, lending, FX) require proper local licensing. These categories should not be pursued without compliance and domain expertise — they are not yet fully covered by MiniPay's offer.

---

### D. Works without `personal_sign`
MiniPay does not support `personal_sign` or `eth_signTypedData`. Can your app work without them?

| Score | What it means |
|-------|---------------|
| **2** | Wallet address is sufficient for the core flow — no off-chain signature required |
| **0** | Requires `personal_sign` or `eth_signTypedData` — **this is a hard technical block; the app cannot function in MiniPay** |

> **Note:** Apps can still collect user data (email addresses, phone numbers, profile info) through regular forms — that is fully supported. This dimension is only about cryptographic signing methods.
>
> **Auto-connect is mandatory inside MiniPay.** Never show a "Connect Wallet" button when `window.ethereum.isMiniPay === true`. See `minipay-guide.md` → *Wallet Connection*.
>
> Need phone-number → wallet address resolution? ODIS / FederatedAttestations is supported and recommended — see `odis-socialconnect.md`. This adds setup complexity but does not block your score.

---

### E. Category gap in current catalog
Is your category underserved in the MiniPay Discovery catalog right now?

| Score | What it means |
|-------|---------------|
| **2** | Category has 0–1 existing apps, or the one app that exists is geo-blocked in your target market |
| **1** | 2–4 competitors, but your angle is meaningfully differentiated |
| **0** | Highly competitive category with no clear differentiation angle |

> See `minipay-live-apps.md` for the current catalog snapshot with per-country availability data.

---

## 3. Priority Tiers

Use your total score to understand what to do next.

| Total Score | Priority | What to do |
|-------------|----------|------------|
| **8–10** | 🟢 **Tier 1 — Build now** | Strong fit. MiniPay Discovery should be your primary distribution target. Get a Celo team review before submitting. |
| **5–7** | 🟡 **Tier 2 — Build, fix the gaps** | Good fit but one or two dimensions are weak. Find your lowest score, fix that specific gap, then re-evaluate. |
| **3–4** | 🟠 **Tier 3 — Validate before committing** | Partial fit. Test with real users via ngrok before building further. Consider Proof of Ship to get community feedback first. |
| **0–2** | 🔴 **Tier 4 — Wrong channel for now** | Structural mismatch with MiniPay. Pivot the concept or choose a different channel. Proof of Ship is a good place to explore alternatives. |

---

## 4. Category Opportunity Map

Current catalog density from `minipay-live-apps.md` (snapshot — verify before using):

| Category | Apps live | Opportunity | Notes |
|----------|-----------|-------------|-------|
| **Games** | 11 | 🟢 High | Easiest to build and launch; strong Celo interest; novel mechanics (skill-based, local IP, cultural context) differentiate |
| **Rewards / earn** | 10 | 🟢 High | High interest from Celo; differentiated earning mechanics have strong potential |
| **Pay AI as you go** | 0 | 🟢 High | No apps yet. Pay-per-use AI tools with stablecoin micropayments are a strong fit for MiniPay's UX model |
| **Social** | 0 | 🟢 High | No social app listed — but requires network effects, plan for user acquisition from day one |
| **Health / fitness** | 1 | 🟢 High | Only Squadletics. Large green field |
| **News / media** | 1 | 🟢 High | Only Briefing. Untapped |
| **Shopping** | 1 | 🟢 High | E-commerce + stablecoins is open — **only if you already have users/traction** |
| **Utility** | 8 | 🟡 Medium | Bill pay led by Bitgifty and Fonbank (Nigeria-focused). Check which markets they do not cover — that gap is your opportunity |
| **Sports** | 4 | 🟢 High | Africa-focused. Opportunities in other markets |
| **Finance — savings/FX** | 7 | 🟠 Established builders only | Many markets underserved, but this space suits teams with existing users and relevant domain background |
| **Finance — credit/lending** | 0 | 🔴 Requires licensing | Massive market need, but requires financial licensing in each market. Not recommended without legal compliance and domain expertise |

---

## 5. Things to Fix Before Submitting

These are technical constraints that need to be addressed before your app can function correctly in MiniPay. All of them are fixable — address them during development.

| Item | What to do |
|---|---|
| App uses `personal_sign` | Replace with wallet-address-only identity or ODIS phone resolution. See `odis-socialconnect.md`. |
| App uses `eth_signTypedData` | Replace with a flow that only requires `eth_sendTransaction`. |
| App displays CELO balance or requires CELO payment | Remove CELO from your UI entirely. MiniPay handles gas automatically — users never see it. |
| App sets EIP-1559 transaction fields | Remove `maxFeePerGas` / `maxPriorityFeePerGas`. Use legacy transaction format. |
| Bundle size > 2 MB or heavy images | Use SVG/WebP, lazy-load aggressively, and keep your initial JS bundle small. |

---

## 6. Pre-fit Checklist (run before scoring)

Before applying the scorecard, answer these questions. A single "No" on items 1–3 is an immediate Tier 4:

- [ ] Can the entire core user flow run inside MiniPay's WebView?
- [ ] Can you build the UI without showing CELO or raw `0x…` addresses?
- [ ] Can a non-crypto user understand what the app does from the first screen?

---

## 7. Example Score — Reference

The table below shows a worked example for orientation. Replace with your own app's values.

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| A. Stablecoin-native | 2 | All payments and rewards denominated in USDm, USDT, or USDC |
| B. Short-session | 2 | Core action (3 taps): choose → confirm → done |
| C. Local market fit | 2 | Directly solves a documented pain point in a specific primary market |
| D. No `personal_sign` | 2 | Wallet address = identity; no `personal_sign` anywhere |
| E. Category gap | 2 | Category has zero or one Celo-native apps |
| **Total** | **10 / 10** | **🟢 Tier 1 — Build now** |

---

## Related References

- `minipay-guide.md` — Detection, auto-connect, stablecoin transfers, deeplinks, ngrok testing
- `minipay-requirements.md` — Official submission checklist (copy rules, PageSpeed, ToS/Privacy, SLA)
- `minipay-live-apps.md` — Full catalog snapshot with country availability data
- `minipay-templates.md` — Ready-to-copy code for common Mini App patterns
- `minipay-scaffold-from-scratch.md` — Minimal Next.js + viem setup without Celo Composer
- `odis-socialconnect.md` — Phone number → address resolution via ODIS / FederatedAttestations
- `builder-guide.md` — Fee abstraction (CIP-64), feeCurrency adapter addresses, SDK selection
