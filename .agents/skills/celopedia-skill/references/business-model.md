# Growth — Business Model (MRR or Die)

The hard truth most Celo founders never confront: **if your project doesn't generate monthly recurring revenue, you will stop building it.** Not because you'll fail in some dramatic sense, but because grant cycles end, hackathon adrenaline fades, and you'll quietly drift to the next shiny project.

A sustainable Celo project must move stablecoins (preferably USDT) **and** capture some of that flow as revenue — through commissions, product/service sales, or premium subscriptions. This file is the framework for designing that revenue layer from day one, not as an afterthought.

---

## 1. The MRR-or-die framing

Ask the builder one question:

> *"How does this project pay for itself in 12 months?"*

The bad answers:
- "I'll apply for the next grant cycle" — grant funding is a runway, not a business model
- "Token launch" — most token launches fail; this is a lottery ticket, not a plan
- "Eventually we'll add a fee" — if you haven't designed for fees on day 1, retrofitting them post-launch tanks retention
- "VCs" — VCs don't fund unmonetized consumer crypto in 2026 unless you already have 6-figure MAUs

The good answer is a specific number: **"At X users doing Y action per month, the app generates $Z in USDT revenue, which covers $W in monthly costs."** This file teaches builders how to arrive at that sentence.

---

## 2. Why USDT specifically (not just "stablecoins")

For Celo projects targeting emerging markets, **USDT is the dominant settlement currency for end users**. Builders sometimes default to USDC because it's the developer-friendly default, or to USDm (cUSD) because it's "the Celo stablecoin." Both are valid, but for monetization:

- **USDT has the deepest liquidity** in user-facing offramps across emerging markets (P2P Binance, OKX P2P, plus regional ramps like Bitso in LatAm and Yellow Card in Africa)
- **MiniPay users hold USDT as their primary balance** in most regions where MiniPay has traction
- **USDT is what users actually want to hold** — they don't want to swap to your "premium-feature token" or some bespoke wrapper
- **USDC adapter for fee abstraction works on Celo** — so your users can pay in USDC for gas if needed, even if your revenue is in USDT (see [builder-guide.md](builder-guide.md))

**Practical rule**: charge in USDT. Pay your costs in USDC (Vercel, Cloudflare, AWS) by swapping monthly. Capital efficiency.

---

## 3. The 4 monetization patterns for Celo apps

Pick ONE primary pattern (mixing too many at launch confuses users). Add a second only after the first hits product-market fit.

### Pattern A — Transaction commission (the savings/payments default)

You take a percentage of every transaction routed through your contract.

- **Best for**: savings apps, P2P payments, remittances, swap UIs
- **Typical rate**: 0.3% – 1.5% per transaction (compete with Binance P2P's ~1% as the reference price)
- **Implementation**: skim a fee in the smart contract on the deposit/withdraw/swap action; transfer to a treasury address
- **Pros**: aligned with user activity, scales with usage, fair-feeling to users
- **Cons**: requires volume to matter; tiny commissions on small txns barely cover costs

**Math example**: 1% commission × 1,000 monthly users × $100 average txn × 4 txns/month = **$4,000 MRR**

### Pattern B — Product/service sale (the marketplace/utility default)

You sell a specific thing to users — physical goods, digital goods, a one-time service, a generated artifact.

- **Best for**: NFT marketplaces, IRL goods marketplaces, design tools, AI-generated content, ticketing
- **Typical price**: highly variable; the unit economic question is *cost-per-fulfillment* vs *price-per-unit*
- **Implementation**: USDT payment → trigger fulfillment (mint NFT, ship item, deliver service, generate output)
- **Pros**: clean unit economics, easy to explain
- **Cons**: requires actual product/inventory; not recurring

**Math example**: $5 per item × 200 items sold/month = **$1,000 MRR** (plus need to subtract cost of goods)

### Pattern C — Premium subscription (the productivity/utility default)

Users pay USDT monthly for access to features beyond the free tier.

- **Best for**: dashboards, analytics, alerts, advanced trading tools, productivity apps
- **Typical price**: $2-10/month for retail crypto users; $20-100/month for power-users/traders
- **Implementation**: time-bounded NFT pass, on-chain subscription contract (Sablier-like streams), or off-chain with on-chain receipt
- **Pros**: predictable revenue, easy to model
- **Cons**: hardest to launch — requires meaningful feature differentiation between free and paid

**Math example**: $5/month × 200 subscribers = **$1,000 MRR**

### Pattern D — Agent/AI access fee (the 2026 default)

You expose an MCP server (see [growth-gtm.md](growth-gtm.md) §5) and charge AI agents per call using x402.

- **Best for**: data services, oracles, premium API endpoints, agent-callable contract actions
- **Typical price**: $0.001 – $0.10 per call (depending on cost-per-call to you)
- **Implementation**: x402 payment gate on the endpoint; receiver address collects USDC/USDT
- **Pros**: scales infinitely without user-acquisition friction (agents discover you), aligned with AI adoption trajectory
- **Cons**: requires AI ecosystem to actually find you (so promote the MCP server — see [growth-gtm.md](growth-gtm.md) §5)

**Math example**: $0.01 per call × 100,000 calls/month from various agents = **$1,000 MRR**

---

## 4. The break-even calculator (every builder must run this)

This is the most important prompt in this file. Before launch, every Celo project should be able to fill in this table.

### Prompt: "Build my break-even model"

```
Help me build a break-even model for {project name}.

My monetization pattern is: {A: commission / B: product sale /
C: subscription / D: agent calls — pick one from §3, with my rate}.

My monthly costs are (be exhaustive — include the things people forget):
- Hosting (Vercel / Cloudflare / etc.): $X
- Domain renewal (amortize annual cost / 12): $X
- The Graph queries (if applicable): $X
- RPC provider (if you outgrew free tier): $X
- Database / analytics (if paid PostHog tier): $X
- Email / notification services: $X
- Any paid AI / API services your app uses: $X
- My time, if I'm paying myself a minimum living wage: $X
  (Be honest. If you're not paying yourself, write "I am subsidizing
  this with personal savings — runway: $Y for Z months.")

Calculate:
1. Total monthly cost (T)
2. Revenue per user per month under my chosen pattern (R)
3. Break-even users: T / R = ___
4. To clear a meaningful margin (2× costs): users needed = 2T / R
5. To pay myself a real wage ($3k/month minimum survivable in {my country}):
   users needed = (T + $3000) / R
6. Sanity check: in the Celo ecosystem, comparable projects have ~ X
   users at month 6. Is my break-even users number above or below that?
   If far above, the model is fragile — recommend changes (raise price,
   change pattern, narrow ICP).
7. The single biggest cost driver in my P&L — what to optimize first.

Output as a markdown table I can paste into Notion/Linear and update monthly.
```

### Template table for the builder to fill in

```markdown
| Item                          | Monthly Cost (USD) |
|-------------------------------|--------------------|
| Vercel Pro / Cloudflare       | $20                |
| Domain (annual / 12)          | $1                 |
| The Graph queries             | $0                 |
| RPC (Forno free or alt)       | $0                 |
| PostHog                       | $0                 |
| Telegram bot infra            | $0                 |
| Founder wage (target)         | $3,000             |
| **Total**                     | **$3,021**         |

| Item                          | Per-user Revenue (USDT) |
|-------------------------------|-------------------------|
| Commission (1% × $100 × 4)    | $4 / user / month       |

**Break-even users**: 3021 / 4 = 756 active users/month
**2× margin**: 1,512 users
**Realistic 6-month target**: 200-500 users for a typical solo Celo project
**Conclusion**: at current monetization, cannot pay founder wage at realistic scale.
**Action**: raise commission to 2%, OR add subscription tier at $5/mo for power users.
```

---

## 5. Designing for monetization from day one

The biggest mistake: building the free product first, then bolting on monetization later. By then, your user base is anchored on "this is free" and churns when you introduce fees.

### Design rules

1. **Charge from launch.** Even $0.50/transaction is better than $0 — it sets the anchor.
2. **Make the free tier deliberately limited.** Not broken — *limited*. A free tier that lacks the most powerful feature is worth more than one with everything.
3. **Show users where their money goes.** "$0.30 of this $30 transaction supports the developer (me)." Honesty converts in Celo's user base — they understand someone has to pay for the lights.
4. **Denominate prices in USDT explicitly.** Not "0.5%" — "0.5% USDT". Not "$5/month" — "$5 USDT/month". Users in inflation-affected markets care about denomination clarity.
5. **Treasury address must be a real address you control** — multisig if possible (Safe on Celo works). Verifying this on Celoscan is part of trust building.

### Prompt: "Design my pricing for launch"

```
I'm about to launch {project name} ({one-sentence pitch}).

My monetization pattern is: {pattern from §3}.

My target user: {ICP from growth-gtm.md §3}.

Comparable products and their pricing (be specific — list names and rates):
- {Comparable 1}: {their fee/price}
- {Comparable 2}: {their fee/price}
- {Comparable 3}: {their fee/price}

Help me decide:
1. What rate/price should I launch at? Justify against the comparables.
2. What's my pricing PAGE going to say? (Draft the copy — 3 tiers max,
   one recommended, no jargon, MiniPay copy rules.)
3. How will users SEE that they're being charged? (In the UX flow,
   before they sign — never as a surprise.)
4. What's my refund/grievance policy? (Even if you don't have one
   formally, decide what you'll do when someone complains.)
5. The single experiment I should run in month 2 to optimize this
   pricing (e.g. raise price 20% for new users, A/B test tier names,
   add a free trial).
```

---

## 6. The grant-to-MRR transition

Most Celo projects start funded by grants and need to transition to MRR. Here's the realistic playbook:

| Phase | Funding source | What to build | Metric to watch |
|-------|----------------|---------------|-----------------|
| Month 0-3 (grant) | Initial grant ($10k-50k) | MVP + first 100 users | Weekly active users |
| Month 3-6 (grant + early revenue) | Bridge grant + first $100/mo MRR | Monetization layer + retention loops | MRR growth rate |
| Month 6-12 (revenue-supplemented) | Diminishing grants + $1k-5k MRR | Scale what's working, kill what isn't | MRR / costs ratio |
| Month 12+ (self-sustaining) | $5k+ MRR | New features funded by revenue | Months of runway from MRR alone |

If at month 6 the project has zero MRR, **that's the moment to make a serious decision** — pivot the monetization model, narrow the ICP, or honestly retire the project. The worst outcome is grinding for another 6 months on grant fumes with no path to sustainability.

---

## 7. The conversation to have with yourself (or a co-founder)

Most projects skip this. Don't.

### Prompt: "Stress-test my sustainability plan"

```
I'm building {project name}. Here is my current sustainability plan:
{paste the break-even table from §4, your current MRR if any, and
your runway in months from any other source}.

Be a skeptical investor / friend reviewing this plan. Identify:
1. The most optimistic assumption that, if wrong by 50%, kills the
   business model.
2. The realistic next 3 months — at the current trajectory, where will
   MRR be vs. costs?
3. The pivot the data is whispering but I'm probably ignoring.
4. The honest "kill criteria" — if I haven't hit X by month Y, I should
   shut this down instead of continuing to subsidize it.
5. The one bet that, if it pays off, makes the whole model work — and
   what evidence I should be looking for that this bet is paying off.

Be direct. I'd rather hear hard truth now than burn another 6 months.
```

---

## 8. Don't confuse activity with revenue

A final warning: a Celo project can have impressive on-chain numbers (thousands of txns, millions in TVL) and **zero revenue**. The metrics in [growth-analytics.md](growth-analytics.md) are necessary but not sufficient — you also need a column for **"USDT revenue extracted per transaction / per user / per month."**

Track that column from day 1. If it's $0, you don't have a business — you have a hobby that happens to use Celo. Both are fine, but be honest about which one you're running.
