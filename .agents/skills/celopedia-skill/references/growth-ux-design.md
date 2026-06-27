# Growth — UX & Design (anti-AI-slop layer)

In an era where any builder can ship a working app in a weekend with AI, **design taste is the moat**. A project that looks like every other shadcn-default, gradient-purple, Inter-font dApp is invisible — even if the underlying tech is great. This file gives builders the skills, tools, and prompts to differentiate aesthetically.

> **Composes with `minipay-app-fit.md` (Capability 4)**: a builder who scored low on **"No-crypto UX"** or **"Short-session"** in Beni's MiniPay fit scorecard should land here. The MiniPay copy rules and onboarding flow critique prompt in this file are the direct fix for those two dimensions.

---

## 1. Recommended skills (install these first)

### UI/UX Pro Max — https://www.uupm.cc/

The single highest-leverage skill for design work. Bundles 50+ visual styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, and HTML/CSS).

**Why it matters for Celo builders**: it covers styles that AI rarely defaults to — bento grid, claymorphism, brutalism, skeuomorphism — which is exactly what gets a MiniPay app to *not* look like every other MiniPay app.

**Trigger words that load it**: "design my landing page", "make this look better", "review UI/UX", "what color palette should I use", "implement glassmorphism", "create a dashboard".

### Claude Design (Anthropic Labs) — https://www.anthropic.com/news/claude-design-anthropic-labs

Anthropic's design-focused agent — produces visual mockups, design systems, and components with notably better taste than the default coding agent. Best for the "what should this even look like?" stage before you write a single line of code.

**When to use over UUPM**: UUPM is best when you already know the style and need execution. Claude Design is best when you're starting from zero and need direction.

### Logo design — Gemini + ChatGPT

Both image generators consistently outperform Claude-based image tools for logos in early 2026. Use them for: logo concepts, mascot illustrations, app icons, marketing illustrations.

**Don't pay for logo design services** as a solo Celo founder pre-revenue. Iterate with Gemini/ChatGPT until you have something you like, then if you can afford it, pay a designer to refine the final version.

---

## 2. Ready-to-use prompts

### Prompt: "Diagnose AI-slop in my current UI"

When to use: builder shares a screenshot or URL of their app and asks for feedback.

```
You are a senior product designer reviewing a Celo dApp/MiniPay Mini App.

Here is the current UI: {paste screenshot or URL}

Diagnose it for "AI-slop" — the generic look that comes from default
shadcn components, default Tailwind colors (especially purple gradients
and indigo-500), Inter as the only font, stock Heroicons, and centered
hero sections with a giant headline + subheadline + two buttons.

For each AI-slop tell you spot, give:
1. What you see (be specific: "indigo-500 gradient on hero", not "generic colors")
2. Why it makes the app forgettable
3. One concrete alternative (a specific font, palette, layout, or component pattern)

Then rank the top 3 changes by impact-per-hour-of-work.
```

### Prompt: "Pick a visual identity for my project"

When to use: pre-design, builder doesn't know what aesthetic to commit to.

```
I'm building {one sentence about the product} for {target user}.

The vibe I want users to feel is: {three adjectives, e.g. "trustworthy,
playful, fast"}.

Compete-against context: my closest comps are {2-3 competitor app names
or URLs}.

Propose 3 distinct visual identity directions. For each, give me:
- Name + 1-sentence mood
- Primary palette (3 colors with hex)
- Font pairing (heading + body, from Google Fonts only)
- Border-radius vibe (sharp / soft / pill / mixed)
- 1 reference site that nails this aesthetic
- Why this fits my target user better than the AI-slop default

Bias toward directions that are NOT purple gradients, NOT Inter,
NOT default shadcn.
```

### Prompt: "Logo brief for Gemini/ChatGPT"

When to use: builder asks "what should my logo look like?"

```
Generate a logo for {project name}.

Concept: {2-3 sentences about what the project does and feels like}.

Mascot or symbol: {a specific animal/object/glyph, or "no mascot"}.

Style references: {3 existing logos you like — Stripe, Linear, Phantom
wallet, etc.} — but DON'T copy them. Capture the spirit.

Constraints:
- Must work as a 32x32 favicon
- Must work in single-color (will be embossed/etched in some contexts)
- Should NOT include: gradients, 3D rendering, text inside the symbol
  (text goes next to the symbol, not inside it)
- Color palette: {hex codes or "surprise me"}

Produce 6 variations. Show me 4 symbol-only and 2 symbol+wordmark.
```

### Prompt: "Critique my onboarding flow"

When to use: builder has built signup/wallet-connect/first-action flow.

```
You are a mobile-first UX reviewer. The user is on Android, in a country
with intermittent 3G, opening a MiniPay Mini App for the first time.

Here is the flow: {list each screen — "Screen 1: hero with Connect Wallet
button", "Screen 2: ask for phone number", etc.}

For each screen, tell me:
1. What does the user think this screen is asking them to do?
2. What's the cognitive load (count: number of decisions + reads required)?
3. What can be cut, deferred, or auto-completed?

Then rewrite the flow with the minimum number of screens. Apply these
MiniPay-specific rules:
- No "Connect Wallet" button (MiniPay is implicit-connect)
- Use "Network fee" not "Gas"
- Use "Deposit" not "Onramp", "Withdraw" not "Offramp"
- Use "Stablecoin" or "Digital dollar" not "Crypto"
- Show phone number / alias, not raw 0x... addresses
- Only USDT / USDC / USDm — never CELO in user-facing copy
```

### Prompt: "Generate a bento-grid dashboard"

When to use: builder is building a stats page / portfolio view / activity dashboard.

```
Build a single-page dashboard for {project name} using a bento grid layout.

Data to display:
- {Metric 1, e.g. "Total deposited across all users"}
- {Metric 2, e.g. "Active users last 7 days"}
- {Metric 3}
- {A chart, e.g. "Daily transaction volume — last 30 days"}
- {A list, e.g. "Top 10 depositors leaderboard"}

Constraints:
- Bento grid: variable-size tiles, asymmetric, NOT a uniform 3-column grid
- One tile is the "hero" tile (~40% of viewport above the fold)
- Mobile-first: bento collapses to single-column stack below 768px
- Stack: {React + Tailwind / vanilla HTML+CSS / SwiftUI / etc.}
- Pull design references from: Apple Music's bento, Linear's dashboard,
  notion.so/templates — NOT generic shadcn examples
- Use these MiniPay copy rules: "Network fee" not "Gas", "Stablecoin"
  not "Crypto", phone/alias not 0x addresses

Output: a single self-contained file I can deploy.
```

---

## 3. Design heuristics for Celo / MiniPay apps

These are codified rules — if a builder's design violates them, push back.

### Mobile-first is non-negotiable

MiniPay is exclusively mobile (Opera Mini browser on Android, plus standalone iOS/Android). 70%+ of MiniPay users are on devices with screens ≤6 inches and intermittent connectivity. Design at 360×640 first, then scale up — not the reverse.

### Trust signals matter more than visual polish in emerging markets

In emerging markets, users have been burned by scam apps. A slightly "boring" but trustworthy-looking app converts better than a flashy one. Trust signals include:
- Real photos of the team (not stock illustrations)
- Visible Twitter/Farcaster handles with real activity
- "As featured in" logos (even small ones — local press counts)
- A working contact email (not "support@yourapp.com")
- The total amount of value already moved through the app

### Copy in the user's language, not the team's language

MiniPay's banned-terms list isn't just a MiniPay rule — it's a design philosophy. Builders writing for users who don't know what "gas," "DeFi," or "TVL" means need to translate every term. The full banned-terms reference lives in [minipay-requirements.md §3](../minipay-requirements.md). Re-read it before approving any user-facing copy.

### One color is a brand. Five colors is decoration.

Look at the apps users trust: Stripe (one blue), Linear (one purple), Phantom (one purple). They each commit to ONE distinctive color. Most AI-generated dApps use 3-5 colors and end up looking like everything else. Push builders to commit to one.

---

## 4. Quick wins for an existing app

If a builder has a deployed app that looks generic, these 4 changes do the most work in the least time:

1. **Replace Inter** with a more distinctive sans (Geist, Inter Tight at 600 weight, Aeonik, Söhne, Switzer, or a free Google Font with character — Space Grotesk, Outfit, Manrope).
2. **Replace the default purple gradient** with a single solid color from a deliberately-chosen palette.
3. **Replace stock Heroicons** with a custom icon set (Phosphor, Lucide-with-custom-stroke, or 5 custom-drawn icons for your most-used actions).
4. **Add a single "anchor" visual** — a hero illustration, a custom shape, a chart that nobody else has — that makes screenshots of your app recognizable at a glance.

---

## 5. When the builder pushes back: "but I'm not a designer"

This is the most common objection. The honest answer:

> *You don't need to be a designer. You need to make 3 deliberate decisions: one font, one color, one layout pattern. AI tools execute those decisions; you supply the taste. UI/UX Pro Max gives you the menu — you pick from it. That's the whole job.*
