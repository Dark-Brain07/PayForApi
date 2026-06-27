# Growth — Analytics

"What gets measured gets managed." For a Celo project, that means knowing both **on-chain truth** (TVL, txns, unique wallets) and **off-chain user behavior** (where visitors come from, where they drop off, what they tap). This file covers a three-tier scaling strategy: direct RPC for v0, The Graph for scale, PostHog for user behavior.

---

## 1. Recommended tools

### PostHog — https://posthog.com/

Open-source product analytics. Generous free tier, self-hostable if you ever need it. Covers: pageviews, custom events, funnels, session recordings, A/B tests, feature flags, heatmaps.

**Why PostHog over Google Analytics / Mixpanel for Celo builders**: GA is a black box you don't control; Mixpanel gets expensive fast. PostHog gives you the same primitives, lets you query the raw data with SQL/HogQL, and the free tier covers most pre-PMF Celo projects without ever paying.

### The Graph — https://thegraph.com/

Decentralized indexing protocol. Convert your contract's event log into a queryable GraphQL API. Free tier on Graph Studio is enough for early-stage projects.

**Why The Graph over polling RPC**: contract `view` functions only return *current* state. The Graph keeps the full history — every deposit ever made, daily volume per day, unique users per week — pre-aggregated and queryable in milliseconds. Once your dashboard needs time-series charts, lifetime totals, or leaderboards, you've outgrown RPC and need The Graph.

---

## 2. The three-tier scaling strategy

Don't over-engineer on day one. Graduate as you grow.

```
Tier 1: Direct RPC calls          →  $0/mo, ~1 second to load, OK for first 100 users
Tier 2: + Vercel cache + CORS     →  $0/mo, handles 10k concurrent, OK until you need history
Tier 3: + The Graph subgraph      →  $0/mo on Studio, unlimited history & charts, scales forever
```

Start at Tier 1. Add Tier 2 the day you ship publicly. Add Tier 3 the day you need a time-series chart or leaderboard.

---

## 3. Tier 1 — Direct RPC for on-chain stats

### Pattern A: Batch RPC calls with `Promise.all`

Read multiple contract values in parallel — don't await them sequentially:

```javascript
const [poolSize, totalUsers, apy, myBalance] = await Promise.all([
  contract.getTotalDeposited(),
  contract.getUniqueDepositors(),
  aavePool.getReserveData(USDT_ADDRESS),
  contract.getUserDeposit(userAddress),
]);
```

### Pattern B: Read historical events with `queryFilter`

Use `queryFilter` with block ranges. Celo has ~1s block time, so 30 days ≈ 2,592,000 blocks. **Stay under 2,000 blocks per query on public RPCs** or use a public indexer endpoint that allows larger ranges.

```javascript
const filter = contract.filters.Deposited();  // your event
const toBlock   = await provider.getBlockNumber();
const fromBlock = toBlock - 2_592_000; // ~30 days on Celo (~1s blocks)

const events = await contract.queryFilter(filter, fromBlock, toBlock);

const stats = events.reduce((acc, e) => {
  acc.totalVolume += Number(ethers.formatUnits(e.args.amount, 6));
  acc.uniqueUsers.add(e.args.user);
  return acc;
}, { totalVolume: 0, uniqueUsers: new Set() });
```

> **Note on Celo block time**: post-L2 migration, blocks are ~1 second. If you have an older code snippet using ~5s assumptions, the block math is wrong by 5×.

### Pattern C: Cache the result in a serverless function

Add a `Cache-Control` header so Vercel's CDN caches the response and you don't hit the RPC 100× per page load:

```javascript
// api/stats.js
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const data = await fetchOnChainData();
  return res.json({ ok: true, ...data });
};
```

### Pattern D: Minimal dashboard HTML

```javascript
// frontend/app.js — fetch and render
async function loadStats() {
  const res  = await fetch("/api/stats?t=" + Date.now());
  const data = await res.json();

  document.getElementById("pool").textContent =
    "$" + Number(data.poolSize).toFixed(2);
  document.getElementById("users").textContent =
    data.uniqueUsers.toLocaleString();
}

loadStats();
setInterval(loadStats, 30_000); // refresh every 30s
```

---

## 4. Tier 2 — CDN caching + CORS hardening

Once your app is public, you need to defend against bots, accidental abuse, and the 10,000-users-simultaneously scenario.

### The result you're aiming for

> A stats dashboard that handles 10,000 simultaneous users while sending The Graph (or RPC) just **one query every 2 minutes** — not 10,000.

The trick is layered: CDN cache absorbs the volume, CORS blocks unauthorized callers, and the browser never talks to the data source directly.

### Step 1 — Never expose your data source URL to the browser

The browser calls your Vercel API. Your API calls The Graph (or RPC). The Graph URL lives in an env var — it never appears in client code.

```javascript
// ❌ wrong — The Graph URL visible to anyone who opens DevTools
fetch("https://api.studio.thegraph.com/query/.../your-app/v0.0.2", { ... })

// ✅ right — browser calls your own API, The Graph stays private
fetch("/api/graph-stats")
```

> If you expose the subgraph URL directly, anyone can run unlimited queries against it — bypassing your cache entirely and exhausting your free-tier quota.

### Step 2 — CDN cache with `stale-while-revalidate`

Two headers turn Vercel's global CDN into a shared cache. 10,000 users requesting the same endpoint simultaneously receive the cached response — The Graph only gets queried when the cache expires.

```javascript
// api/graph-stats.js
res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=240");
// s-maxage=120    → CDN caches for 2 minutes (shared by all users)
// stale-while-    → after 2 min, CDN serves the old response instantly
// revalidate=240    while fetching the fresh one in the background
```

The math: **10,000 users × 1 req/2min = The Graph receives <1 query per 2 minutes globally** — not 10,000.

### Step 3 — Restrict CORS to your own domain

Setting `Access-Control-Allow-Origin: *` lets any website call your API from a browser. Restrict it so only your frontend can make cross-origin requests:

```javascript
// api/graph-stats.js
const ALLOWED_ORIGINS = [
  "https://yourapp.com",
  "https://www.yourapp.com",
];

const origin = req.headers.origin;
if (origin && !ALLOWED_ORIGINS.includes(origin)) {
  return res.status(403).json({ ok: false, error: "Forbidden" });
}
if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
// Note: same-origin requests don't send an origin header — those always pass
```

### Step 4 — Block cache-busting attacks

Vercel's CDN caches by exact URL. A bot adding `?t=1234` generates a unique URL on every request — each one hits The Graph directly, bypassing the cache entirely.

```javascript
// api/graph-stats.js — redirect any request with query params
if (Object.keys(req.query).length > 0) {
  res.setHeader("Cache-Control", "no-store");
  return res.redirect(307, "/api/graph-stats");
}
```

> 307 (Temporary Redirect) tells the browser to reuse the method (GET) and follow the redirect to the canonical cacheable URL. The browser caches this redirect too, so repeat offenders get stopped earlier.

### Step 5 — Frontend polling with live countdown

Poll the API every 2 minutes. The `stale-while-revalidate` header means the user always gets an instant response — no loading spinner. A live countdown shows when the data was last refreshed.

```javascript
// frontend/stats.js
const POLL_INTERVAL = 120_000; // 2 minutes
let lastUpdated = null;

async function loadStats() {
  const res  = await fetch("/api/graph-stats");
  const data = await res.json();
  lastUpdated = Date.now();

  renderDashboard(data);
}

function startCountdown() {
  const el = document.getElementById("last-updated");
  setInterval(() => {
    if (!lastUpdated) return;
    const s = Math.floor((Date.now() - lastUpdated) / 1000);
    el.textContent = s < 60 ? `Updated ${s}s ago` : `Updated ${Math.floor(s/60)}m ago`;
  }, 1000);
}

loadStats();
setInterval(loadStats, POLL_INTERVAL);
startCountdown();
```

---

## 5. Tier 3 — The Graph subgraph for scale

Once you need lifetime totals, daily aggregations, leaderboards, or charts spanning more than a few days, RPC stops working. Time to deploy a subgraph.

### Why The Graph beats polling RPC at scale

Contract view functions only return **current** state. The Graph keeps the full history: every deposit ever made, daily volume per day, unique users per week — all pre-aggregated and queryable in milliseconds. Free on Studio for early-stage projects.

### Step 1 — Define your schema

```graphql
# schema.graphql — one entity per aggregation you need
type GlobalStats @entity {
  id: ID!                         # always "global"
  totalTxCount:       BigInt!
  totalDepositedUSDT: BigDecimal! # lifetime gross, not net
  totalDepositors:    Int!
  activeDepositors:   Int!
}
type DayStat @entity {
  id:            ID!              # "YYYY-MM-DD"
  date:          String!
  txCount:       Int!
  depositVolume: BigDecimal!
  uniqueUsers:   Int!
}
```

### Step 2 — Map events to entities (AssemblyScript)

```typescript
// src/mappings.ts
export function handleDeposited(event: Deposited): void {
  let global = getOrCreateGlobal();
  let amount = normaliseUsdt(event.params.amount);

  global.totalDepositedUSDT = global.totalDepositedUSDT.plus(amount);
  global.totalTxCount = global.totalTxCount + 1;
  global.save();

  let day = getOrCreateDayStat(getDayId(event.block.timestamp));
  day.depositVolume = day.depositVolume.plus(amount);
  day.txCount = day.txCount + 1;
  day.save();
}
```

### Step 3 — Deploy to Graph Studio, query from Vercel

```javascript
// api/graph-stats.js
const ENDPOINT =
  "https://api.studio.thegraph.com/query/YOUR_ID/your-app/v0.0.1";

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  const r = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: `{
      globalStats(id: "global") {
        totalTxCount totalDepositedUSDT
        totalDepositors activeDepositors
      }
      dayStats(first: 30, orderBy: date, orderDirection: desc) {
        date txCount depositVolume uniqueUsers
      }
    }` }),
  });
  const { data } = await r.json();
  res.json({ ok: true, source: "the-graph", ...data });
};
```

### AssemblyScript gotchas

- Use `.toI32()` not `as i32`
- Use `BigDecimal.fromString("0")` not `BigDecimal.zero()`
- Avoid `parseInt` — it doesn't exist in AssemblyScript
- Renaming an entity changes the collection query name, so redeploy as a new version (don't try to mutate in place)

---

## 6. PostHog — user behavior layer

The Graph and RPC tell you *what happened on-chain*. PostHog tells you *what the user did in the app before/after*. Both are necessary; neither replaces the other.

### Step 1 — Add the PostHog snippet to every HTML page

> Use the **project API key** (starts with `phc_`) — not the personal API key (`phx_`). Wrong key = silent failure, all zeros in dashboard.

```html
<script>
  !function(t,e){/* PostHog snippet — copy from app.posthog.com */}
  posthog.init('phc_YOUR_PROJECT_KEY', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'always',   // track anonymous + identified
    autocapture: true,           // automatic click/form tracking
  });
</script>
```

### Step 2 — Capture custom wallet events

```javascript
// After wallet connects:
posthog.identify(userAddress);          // tie future events to this wallet
posthog.capture('wallet_connected', {
  wallet_type: isMiniPay() ? 'minipay' : 'walletconnect',
});

// After deposit:
posthog.capture('deposit_completed', { amount_usdt: amount });

// After withdraw:
posthog.capture('withdraw_completed', { amount_usdt: amount });
```

### Step 3 — Proxy the API server-side (keep keys safe)

Never expose your PostHog personal API key (`phx_`) to the browser. Create a serverless proxy that runs HogQL queries server-side:

```javascript
// api/analytics.js
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=300");
  const r = await fetch(
    `https://us.i.posthog.com/api/projects/${process.env.PH_PROJECT_ID}/query/`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PH_API_KEY}`, // phx_ key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          kind: "HogQLQuery",
          query: `SELECT countDistinctIf(distinct_id, event = '$pageview') as visitors,
                         countDistinctIf(distinct_id, event = 'wallet_connected') as connected
                  FROM events WHERE timestamp >= now() - interval 30 day`
        }
      })
    }
  );
  const data = await r.json();
  res.json({ ok: true, results: data.results });
};
```

> Use `countDistinctIf()` in HogQL, **NOT** `count(distinct CASE WHEN ...)` — the CASE WHEN syntax fails silently in PostHog's ClickHouse backend.

### Step 4 — Run the PostHog wizard for zero-config setup

```bash
npx -y @posthog/wizard@latest
# Auto-detects your framework and injects the snippet
# Works with Next.js, Vite, vanilla HTML
```

---

## 7. The metrics that actually matter (most builders track the wrong things)

Most pre-PMF Celo dashboards measure vanity metrics — total TVL, total txns. Those are necessary but not sufficient. The actual decision-quality metrics are:

| Metric | Why it matters | Source |
|--------|----------------|--------|
| **Day-1 / Day-7 / Day-30 retention** | Did the user come back? Without retention, no growth strategy works. | PostHog cohorts |
| **Wallet-connect → first-action conversion rate** | Of users who connected, what % actually used the app? | PostHog funnel |
| **Median session length** | Are users engaged or bouncing? <30s = product is broken, >3min = something is working | PostHog |
| **Repeat-action rate** | Of users who deposited once, what % deposited a second time? Predicts retention. | The Graph subgraph |
| **Cost per acquired user** (CAC) | What did you spend (in ad $ or time) per user who took the primary action? | PostHog source + manual spend tracking |
| **LTV proxy** (USDT-moved-per-user) | How much value does each user transact through your app? Foundation for [business-model.md](business-model.md). | The Graph subgraph |

**The 1 metric on the homepage**: pick the single number that, if you 10× it, the project succeeds. Display it prominently on your stats page. For a savings app, it's "total USDT saved." For a payments app, it's "total USDT moved." For a game, it's "unique daily players." For a marketplace, it's "GMV." Everything else is supporting evidence.

---

## 8. Prompts for analytics work

### Prompt: "Diagnose my analytics gap"

```
Here's my current analytics setup for {project name}:
{paste what tools you have installed, what you currently measure, what
dashboards you check daily}.

Here's the next decision I need to make about the product:
{the actual question — e.g. "should I add MiniPay onboarding flow A or B",
"should I drop the leaderboard feature", "should I raise/lower the fee"}.

Identify:
1. The specific metric(s) I need to answer that question — be precise
2. Whether my current setup measures them or not
3. The minimum instrumentation I need to add this week to answer it
4. The trap I'm likely falling into right now (vanity metric, confounded
   variables, sample size too small)
```

### Prompt: "Design my homepage stats display"

```
I want one prominent stats display on my landing page for {project name}.

The product is: {what it does}.
The user takes this primary action: {the core thing — deposit, swap, play, etc.}.

Tell me:
1. The ONE number that should be biggest on the page (the hero metric)
2. 3-4 supporting numbers that contextualize the hero metric
3. Whether each metric should come from PostHog, The Graph, or direct RPC
4. The exact copy for each label (apply MiniPay copy rules: "Network fee"
   not "Gas", "Stablecoin" not "Crypto", phone/alias not 0x addresses)
5. How often the page should auto-refresh
6. What to show during loading (skeleton) and on error (graceful fallback,
   never blank)
```
