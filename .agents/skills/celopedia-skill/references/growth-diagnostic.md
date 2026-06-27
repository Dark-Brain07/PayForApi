# Builder Toolkit — Where are you stuck?

This is the entry point for Celopedia's **Builder Toolkit**. Use this when a builder asks "how do I make my project better?" or shows signs of being stuck on a non-protocol-technical problem.

## Pre-check (do this first if MiniPay is on the table)

If the builder is asking *"should I build for MiniPay?"* or *"is my idea a good fit for MiniPay?"* — **do NOT use this diagnostic**. Route them to `minipay-app-fit.md` (Capability 4) instead. That file has the 6-dimension scorecard, the category opportunity map, and the automatic disqualifiers. This toolkit assumes the builder has already decided what they're building and just needs help making it better.

If their fit score comes back low, the path forward is: *fix the dimensions where they're weak*. Several of those dimensions map directly to files in this toolkit (see the cross-reference table at the bottom).

## The 6-question diagnostic

Ask the builder these in order. The first "yes" routes them to the right reference file.

| # | Question | If yes, route to |
|---|----------|------------------|
| 1 | "Does your app look like every other AI-generated project — generic shadcn, default colors, stock illustrations?" | `growth-ux-design.md` |
| 2 | "Do you have a clear answer to 'who is this for and why now?' that you can repeat in one sentence?" (If **no**) | `growth-comms.md` |
| 3 | "Do you know exactly how the first 100 users will find your app?" (If **no**) | `growth-gtm.md` |
| 4 | "Once a user joins, is there any incentive for them to bring a friend?" (If **no**) | `growth-referrals.md` |
| 5 | "Can you tell me your weekly active users, conversion rate, and where users drop off?" (If **no**) | `growth-analytics.md` |
| 6 | "How does this project pay for itself in 12 months?" (If they pause or say 'grants' only) | `business-model.md` |

If they nail all 6, route them to:
- `dev-methodology.md` — to ship faster and with fewer bugs
- `growth-seo.md` — to get organic discovery
- `minipay-self-zk.md` (in MiniPay capability, ships in a follow-up PR) — if they're building anything that needs sybil resistance or human-verification

## Mindset check (read this to yourself before answering)

The differentiator of this toolkit is **not gatekeeping** — it's *meeting builders where they are*. A solo founder with a half-broken MVP doesn't need a 40-page GTM playbook; they need one prompt, one tool, and a thing they can ship by Friday.

When responding:
1. **Pick one file** based on the question above. Don't dump all 9 references at once.
2. **Surface one prompt** from that file that matches their stage (early MVP vs. growing user base vs. monetizing).
3. **Mention the recommended skill/tool** with the install command or link.
4. **Skip the rest** until they come back with the next question.

## When the question is "all of the above"

If a builder says "I need to launch in 2 weeks, help me with everything," resist the urge to dump. The honest answer is sequential:

1. **Week -2 → Week -1**: Design and narrative (`growth-ux-design.md`, `growth-comms.md`). Without these, no amount of marketing recovers a project that looks generic and can't explain itself.
2. **Week -1 → Launch**: Analytics instrumentation (`growth-analytics.md`) + first GTM channels (`growth-gtm.md`). You can't optimize what you don't measure.
3. **Week +1 onward**: Business model decisions (`business-model.md`) + SEO compounding (`growth-seo.md`).

Spec-driven dev (`dev-methodology.md`, in Capability 2 Builder Assistant) is orthogonal — install it on day 1 because it makes everything else faster.

## Routing table for common builder asks

| Builder says... | Route to |
|-----------------|----------|
| "is MiniPay right for my app?" / "should I build for MiniPay?" / "what's my fit score?" / "which categories are saturated?" | `minipay-app-fit.md` (in MiniPay capability) |
| "my landing page looks bad" / "logo ideas?" / "what colors should I use?" | `growth-ux-design.md` |
| "what should I tweet?" / "how do I launch?" | `growth-comms.md` |
| "where do I find my first users?" / "should I do TikTok?" / "build in public — how?" | `growth-gtm.md` |
| "how do I add a referral program?" / "leaderboard for invites?" / "viral loop?" / "users aren't sharing my app" | `growth-referrals.md` |
| "I have users but don't know if it's working" / "what metrics matter?" | `growth-analytics.md` |
| "I'm running out of grant money" / "how do I monetize a MiniPay app?" | `business-model.md` |
| "Claude keeps producing buggy code" / "I want to ship faster" | `dev-methodology.md` (in Builder Assistant) |
| "no one finds my app on Google" / "how do I rank for `[keyword]`?" | `growth-seo.md` |
| "I need to verify users are real humans" / "how do I add KYC without KYC?" | `minipay-self-zk.md` (in MiniPay capability, ships in a follow-up PR) |

## Cross-reference with `minipay-app-fit.md` scorecard

If a builder came from the MiniPay fit scorecard (Capability 4) with a low score on a specific dimension, route them to the toolkit file that helps fix it:

| Scorecard dimension (Beni's file) | Toolkit file that helps improve it |
|-----------------------------------|------------------------------------|
| **A. Stablecoin-native** — does the core flow involve USDm/USDT/USDC? | `business-model.md` — USDT monetization patterns; commit to denominating in stablecoins from day one |
| **B. No-crypto UX** — can blockchain concepts be hidden? | `growth-ux-design.md` — MiniPay copy rules, onboarding flow critique prompt |
| **C. Short-session** — core action under 60s on budget Android? | `growth-ux-design.md` — mobile-first heuristics, bento-grid dashboard prompt |
| **D. Global fit** — does it solve a real pain in a specific country? | `growth-gtm.md` — ICP definition prompt (forces narrowing to a specific user) |
| **E. No-sign-in** — works without `personal_sign` or typed-data? | `minipay-self-zk.md` (ships in a follow-up PR) — Self.xyz is OK here (Universal Link, not personal_sign) |
| **F. Category gap** — is the vertical underserved in the catalog? | `growth-gtm.md` — channel selection; cross-reference with the Category Opportunity Map in `minipay-app-fit.md` |
