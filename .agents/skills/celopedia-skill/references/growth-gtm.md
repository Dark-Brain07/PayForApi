# Growth — Go-To-Market

GTM is the bridge between "the app works" and "people use the app." For Celo builders — especially solo founders targeting MiniPay or global stablecoin users — the GTM playbook is *not* the SaaS playbook. This file covers what actually works.

> **Composes with `minipay-app-fit.md` (Capability 4)**: a builder who scored low on **"Global fit"** or **"Category gap"** in Beni's MiniPay fit scorecard should land here. The ICP definition prompt in §3 forces the narrowing that fixes "Global fit," and Beni's Category Opportunity Map (in his file) is the missing input for channel selection in §2 — read both side by side.

---

## 1. Recommended skills & tools

### Remotion — https://www.remotion.dev/docs/ai/skills

Programmatic video generation (React → MP4). The single best tool for a solo Celo founder to produce launch videos, weekly updates, and explainer content *without* hiring a video editor.

Use the official skill bundle: https://www.skills.sh/remotion-dev/skills/remotion-best-practices

**Why it matters for Celo GTM**: video converts better than text on Twitter/X, Farcaster, Instagram Reels, and TikTok. Celo's emerging-market audience skews mobile-video-first. A solo founder with no editing skills can produce a 30-second explainer in an afternoon with Remotion + Claude.

### Screen recording — Screen Studio (Mac) or FocuSee (Mac/Win)

- **Screen Studio** — https://screen.studio/ — paid, polished, the gold standard for product demos with auto-zoom and cursor animation
- **FocuSee** — https://focusee.imobie.com/es/ — free tier, similar features, Spanish UI available (handy for Spanish-speaking builders)

Both auto-track the cursor, zoom into clicks, and smooth out raw screen captures into something watchable. The output is the same kind of video that gets shared from Linear, Arc, and other modern product accounts.

**Workflow**: record a 60-second raw demo → drop into Screen Studio/FocuSee → export → that becomes your build-in-public weekly update (see [growth-comms.md](growth-comms.md) §2).

---

## 2. Channels that work for Celo / MiniPay audiences

Ranked by realistic ROI for a solo founder with zero budget. Don't try all of them — pick the top 2 for your audience.

| Channel | Best for | Realistic effort | Realistic outcome (first 90 days) |
|---------|----------|------------------|-----------------------------------|
| **Twitter/X (CT)** | English-speaking crypto-native audience, grant program visibility | 30 min/day | 200-1000 followers, 2-3 outlet pickups |
| **Farcaster** | English crypto-builder audience, Celo Foundation eyeballs | 15 min/day | 100-500 followers, but higher signal-per-follower than X |
| **Local Telegram groups** | Emerging-market retail users — actual MiniPay users live here, especially in LatAm and SEA | 1 hr/week (you need to be a real participant, not a poster) | 50-500 first users from organic posts |
| **WhatsApp Status / Groups** | Direct line to MiniPay's actual user base (especially Africa) | 1 hr/week | Highest conversion rate, hardest to measure |
| **YouTube Shorts / TikTok / Reels** (with Remotion + Screen Studio) | Mass reach in regional markets — non-English content (Spanish, Portuguese, Swahili, Tagalog) has low competition for Celo/stablecoin topics | 2 hr/week to produce, 1 minute to post in 3 places | 1k-100k views per video, 1-3% to install |
| **Celo Discord** | Grants team, ecosystem partnerships, fellow builders | Background presence — answer 1 question/day, post launches | Indirect — leads to grant intros and integrations |
| **Hackathons (Proof of Ship)** | Validation, credibility, direct user funnel from MiniPay's discovery surface | Variable | Listing on MiniPay = instant distribution |
| **Cold outreach to outlets** | One-time launch moment | See [growth-comms.md](growth-comms.md) §4 | 1 in 10 pitch hit rate if your numbers are real |

### What does NOT work (skip these as a solo founder)

- **Paid ads** on FB/Google/X for a pre-PMF dApp — burning money to acquire users who churn in 24 hours
- **Press release wires** (PRNewswire, etc.) — zero readers, only useful for SEO backlinks (which are debatable)
- **LinkedIn posts** — wrong audience for consumer crypto in emerging markets
- **Generic Reddit posting** in r/cryptocurrency — instantly downvoted
- **Influencer "shoutouts"** at $500-5000 a pop — converts at <0.1% for unknown projects

---

## 3. ICP — the prompt to crystallize who you're for

Most Celo projects fail at GTM because they target "everyone in the Global South who wants to save in USDT" — which is unactionable. You need to narrow to a specific person you can imagine, find, and message.

### Prompt: "Define my ICP (Ideal Customer Profile)"

```
I'm building {project name} — {one-sentence pitch}.

I want to define a specific, actionable ICP — a single user persona I
could literally find, message, and convert.

Current loose target: {what the builder thinks now — probably too broad}.

Help me narrow this down by asking me these questions one at a time
(wait for my answer before asking the next):

1. What is the SHARPEST single pain my product solves? Not "saves them
   money" — name the specific monthly dollar amount or the specific
   broken workflow.
2. Of all the people with this pain, which subgroup feels it MOST
   acutely? (e.g. "freelancers paid in USD who lose to local-currency
   depreciation in {country}" is sharper than "people who want to save")
3. Where does this subgroup ALREADY hang out online? Be specific:
   which Telegram channel, which subreddit, which Twitter circle,
   which WhatsApp group.
4. What word do they use for the problem when they describe it to a
   friend? (Not the technical word — the everyday word.)
5. What ONE existing product do they currently use as a workaround?
   (USD bank account, P2P Binance, informal arbolito, savings club,
   mattress.)

After I answer all 5, produce:
- A 1-paragraph ICP description (a specific person, with a name, age,
  occupation, country, monthly income, current workaround, and exact pain)
- The first 3 places I should post / show up to find these people
- The exact opening message I'd send to convert one of them to a beta user
```

---

## 4. Video content production loop

This is the single highest-leverage GTM motion for a solo founder in 2026. The loop:

```
Screen Studio recording  →  raw 60s demo
        ↓
Remotion (with Claude generating the React code)  →  polished 30s with
                                                       captions + intro
        ↓
Post to:  X  •  Farcaster  •  YouTube Shorts  •  Reels  •  TikTok
        ↓
Embed on landing page  →  Lifts conversion 20-40%
```

### Prompt: "Generate a Remotion video for my launch"

```
Generate a Remotion (React-based) video for {project name}.

Length: 30 seconds.

Structure (use Sequence components for timing):
- 0-3s: Title card — project name + one-sentence pitch
- 3-15s: Product demo — show actual screenshots (I will provide PNGs of
  screens A, B, C) with subtle zoom + pan
- 15-22s: One social proof element (user testimonial card, or a single
  big number — "$X moved this week")
- 22-28s: Call to action — URL + QR code component
- 28-30s: Logo lockup

Style:
- Vertical 9:16 (1080×1920) — for Reels/Shorts/TikTok
- Also export horizontal 16:9 (1920×1080) for Twitter/Farcaster
- Captions ON by default, large readable Inter Tight or similar
- Color palette: {paste hex codes from growth-ux-design.md}
- Font: {your project font}
- Music: silent (so it autoplays on muted feeds — most consumption is
  silent)
- Pacing: cuts every 2-3 seconds, no static shots longer than 3s

Output: a complete Remotion project I can `npx remotion render` from.
```

---

## 5. Public MCP servers as distribution (high-leverage 2026 GTM)

**The thesis**: in 2026, the next billion users of your dApp won't be humans clicking buttons — they'll be AI agents calling APIs. If your contract is callable via a public MCP server, every AI coding assistant (Claude Desktop, Cursor, Codex, Gemini CLI) can reach it. That's a distribution channel almost nobody is exploiting yet.

This is also strategically relevant for the x402 ecosystem (see [ai-agents.md](ai-agents.md)) — agents can autonomously discover, pay, and call your endpoints.

### The pattern: agent wallet + Vercel cron + MCP server + x402

#### Step 1 — Agent wallet (one private key, stored in Vercel env)

```javascript
// api/agent.js — load agent wallet
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(
  process.env.CELO_RPC || "https://forno.celo.org"
);
const agent = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);

module.exports = async (req, res) => {
  // Agent logic: deposit, feed, withdraw — whatever your contract needs
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, agent);
  const tx = await contract.feed(agent.address);
  res.json({ ok: true, txHash: tx.hash });
};
```

#### Step 2 — Schedule with Vercel cron (free on hobby tier)

```json
// vercel.json
{
  "crons": [
    { "path": "/api/agent", "schedule": "50 5 * * *" }
  ],
  "functions": {
    "api/agent.js": { "maxDuration": 60 }
  }
}
```

> **Pick a time before your contract's daily deadline.** If your action window closes at 06:00 UTC, schedule the cron at 05:50 UTC — not midnight.

#### Step 3 — Expose an MCP server so any AI client can call your contract

```javascript
// api/mcp.js
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StreamableHTTPServerTransport } = require("@modelcontextprotocol/sdk/server/streamableHttp.js");

const server = new McpServer({ name: "my-app-agent", version: "1.0.0" });

server.tool("get_status", "Read state for a wallet", {
  wallet: { type: "string", description: "Wallet address" }
}, async ({ wallet }) => {
  const status = await contract.getStatus(wallet);
  return { content: [{ type: "text", text: JSON.stringify(status) }] };
});

server.tool("trigger_action", "Perform the daily action (costs 1 USDT)", {}, async () => {
  const tx = await contract.action(agent.address);
  await tx.wait();
  return { content: [{ type: "text", text: `Done! tx: ${tx.hash}` }] };
});

module.exports = async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
};
```

Add to any MCP-compatible client by pointing to your endpoint:

```json
{
  "mcpServers": {
    "my-app": { "url": "https://your-app.vercel.app/api/mcp" }
  }
}
```

#### Step 4 — Fire-and-forget for cron efficiency

```javascript
// ✅ fast — submit and return within the 60s cron window
const tx = await contract.feed(agent.address);
res.json({ ok: true, txHash: tx.hash, status: "submitted" });

// ❌ slow — awaiting confirmation blocks for ~5s and can timeout
await tx.wait();
```

Celo's sequencing guarantees ordering, so you don't need `await tx.wait()` inside cron handlers unless you actually need the receipt in the response.

#### Step 5 — x402 payment gate (monetize per call to AI agents)

Wrap any endpoint with x402 so other AI agents pay USDC on Celo to call your API. No API keys, no subscriptions — pure on-chain micropayments. See [ai-agents.md](ai-agents.md) for the x402 deep-dive.

```javascript
const { withPaymentRequired } = require("x402-next"); // or x402-express

module.exports = withPaymentRequired(
  async (req, res) => {
    // Only runs after payment is verified on-chain
    res.json({ ok: true, data: await getPremiumData() });
  },
  {
    amount:   "0.01",               // $0.01 USDC per call
    currency: "USDC",
    network:  "celo",
    receiver: process.env.PAYMENT_ADDRESS,
  }
);
```

x402 turns your Vercel function into a monetized AI service. Claude agents, LangChain bots, and any HTTP client that supports EIP-402 can call it autonomously without human approval — and pay you per call.

### Distribution benefits (why this is a GTM channel, not just a tech pattern)

1. **AI assistants discover your project organically.** Every time a builder asks Claude "how do I X on Celo," if your MCP server is registered/listed, it becomes the suggested integration.
2. **Free tier of Vercel + free MCP SDK** = zero infra cost.
3. **The README of your project doubles as marketing.** "Add `{ url: https://yourapp.com/api/mcp }` to your Claude Desktop config to interact with this protocol" is a clearer call to action than "view our docs."
4. **Compounds with x402.** As more agents adopt x402, your endpoints become passive revenue sources.

### Promote the MCP server itself

Once it's live:
- Post to https://github.com/modelcontextprotocol/servers — the canonical list
- Tweet/cast a 30-second video showing Claude Desktop calling your contract in natural language (this *will* go viral in 2026 — almost nobody is shipping public on-chain MCP servers yet)
- Add it to your project's GitHub README at the top, above install instructions

---

## 6. The first 100 users — channel-by-channel playbook

| If your ICP is... | First 100 users come from... |
|-------------------|------------------------------|
| Spanish-speaking LatAm crypto-curious (Argentina, Mexico, Colombia, Venezuela) | Local Telegram channels + Spanish-language YouTube Shorts/TikTok with subtitles + a launch post on regional outlets (Cripto247, DiarioBitcoin, etc.) |
| African MiniPay-native users (Kenya, Nigeria, Ghana, South Africa) | WhatsApp groups via local Celo ambassadors + listing on MiniPay's discovery page + a 30-sec demo in WhatsApp Status |
| SEA / Lusophone users (Philippines, Indonesia, Brazil) | Tagalog/Bahasa/Portuguese-language video content + Telegram + WhatsApp groups + regional crypto Twitter |
| English crypto-native (US/EU developers) | Twitter/CT + Farcaster + Hacker News (only for technical launches with a working demo) |
| Developers / agents (B2D play) | Public MCP server + GitHub README + Celo Discord + Farcaster |
| Generic "DeFi degens" | This is a bad ICP. Go back to §3 and narrow further. |

---

## 7. The build-in-public + GTM compounding loop

The single most underrated GTM motion: do build-in-public weekly (see [growth-comms.md](growth-comms.md) §2) and feed the *output of building* directly into your GTM channels. Each weekly update is:

- A piece of content (the post itself)
- A reason to ping your existing followers (top of mind)
- A signal to grants programs / journalists / partners (proof of work)
- An SEO artifact if you mirror to your project blog (see [growth-seo.md](growth-seo.md))
- A free user-research surface (replies tell you what people care about)

A solo founder shipping 1 build-in-public update per week for 12 weeks will out-perform a project with a $10k paid ad budget. This is the central GTM thesis of this file.
