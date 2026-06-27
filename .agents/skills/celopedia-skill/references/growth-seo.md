# Growth — SEO

SEO is the channel most Celo founders dismiss ("it's for B2B SaaS, not for crypto") and the channel that quietly compounds for the founders who do it. A Celo project that ranks for "best USDT savings app {country}" or "how to use MiniPay" earns free, qualified, intent-driven traffic forever — long after the last X thread fades from the timeline.

This file gives builders the skill, the on-page essentials, and a globally-applicable Celo SEO playbook with worked examples across multiple regions.

---

## 1. Recommended skill

### SEO Audit — https://www.skills.sh/coreyhaines31/marketingskills/seo-audit

Audits a website for SEO issues — technical (meta tags, structured data, robots.txt, sitemap, page speed, mobile-friendliness), on-page (title tags, H1s, keyword density, internal linking), and off-page (backlinks, brand mentions, social signals).

**Why this matters for Celo builders**: most dApp landing pages launch with broken or generic SEO — no `<title>`, no `<meta description>`, no Open Graph image, no structured data, no sitemap. The SEO Audit skill catches all of this in one pass and gives you a prioritized fix list.

**Trigger words that load it**: "audit my SEO", "why isn't my site ranking", "review SEO for {url}", "improve SEO".

---

## 2. The SEO baseline (every Celo project needs this on day 1)

Before any keyword strategy, every landing page needs these basics correct. Use the SEO Audit skill to verify each:

### Meta tags

```html
<title>{Project Name} — {One-sentence pitch from growth-comms.md §1}</title>
<meta name="description" content="{120-160 character summary; lead with the user benefit, not the tech}">
<link rel="canonical" href="https://yourproject.com/">
```

### Open Graph (the unlock for X/Farcaster/Telegram preview cards)

```html
<meta property="og:title" content="{Project Name}">
<meta property="og:description" content="{Same as meta description, or slightly punchier}">
<meta property="og:image" content="https://yourproject.com/og-image.png">
<meta property="og:url" content="https://yourproject.com/">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

> **The OG image (1200×630 PNG) is the single highest-ROI design asset.** Every time someone shares your link, it shows up in the timeline. If it looks generic, your share converts at 1-2%. If it looks distinctive (see [growth-ux-design.md](growth-ux-design.md)), it converts at 5-15%.

### Structured data (JSON-LD)

For a Celo project, use the `SoftwareApplication` schema:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "{Project Name}",
  "description": "{Same one-sentence pitch}",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web, Android (MiniPay)",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>
```

This is what gets you into Google's "App" carousel and rich results.

### Sitemap & robots.txt

```
# robots.txt
User-agent: *
Allow: /
Sitemap: https://yourproject.com/sitemap.xml
```

Generate `sitemap.xml` automatically if you're on Next.js. If you're on vanilla HTML, write a 10-line script that generates it from your pages directory.

### Page speed

- Image optimization (use WebP, lazy-load below-fold)
- No render-blocking scripts in the `<head>` except critical CSS
- Vercel + their default config gets you a 90+ Lighthouse score without extra work — verify after deployment

---

## 3. Keyword strategy for Celo / MiniPay (with regional examples)

The keyword opportunity for Celo projects in 2026 is *underexploited*. Big SEO competitors haven't optimized for:
- Non-English stablecoin/Celo terms (Spanish, Portuguese, Swahili, Tagalog, Bahasa)
- MiniPay-specific queries
- Country-specific savings queries (any market with stablecoin demand)
- Long-tail "how to" content about USDT in inflation-affected economies

### High-opportunity keyword categories

| Category | Example keywords (rotate regional variants) | Search intent | Competition |
|----------|---------------------------------------------|---------------|-------------|
| Product-category long-tail | "best USDT savings app Argentina", "USDT savings app Kenya", "aplikasi tabungan USDT" (Indonesia), "MiniPay savings app" | High (ready to act) | Low |
| MiniPay how-to | "how to use MiniPay", "what is MiniPay", "MiniPay Nigeria", "MiniPay supported countries" | Medium (learning) | Low |
| Country-stablecoin | "USDT Argentina", "USDC Kenya", "USDT Philippines", "dólares digitales Venezuela", "stablecoin Nigeria" | High (problem-aware) | Medium |
| Comparison | "MiniPay vs Trust Wallet", "Celo vs Polygon stablecoin fees", "USDT savings vs P2P Binance" | High (deciding) | Low |
| Brand defense | "{Your project} review", "{Your project} legit?", "is {Your project} safe?" | High (about to convert) | Very low |

### Prompt: "Find my best 10 SEO keywords"

```
I'm building {project name} — {one-sentence pitch from growth-comms.md §1}.

My target user is: {ICP description from growth-gtm.md §3}.

My target market(s): {countries / regions}.

I want a starter SEO keyword list. For each keyword, give me:
- The keyword phrase
- Estimated monthly search volume (your best guess; mark uncertainty)
- Search intent: navigational / informational / commercial / transactional
- Competition difficulty: low / medium / high
- A specific URL on my site that would target this keyword (or "needs
  new page")

Bias toward:
- Long-tail (3+ word phrases beat single words)
- Non-English keywords matching my target market's language(s) — search
  competition in Spanish/Portuguese/Swahili/Tagalog/Bahasa for Celo/USDT
  topics is currently 5-10x easier than English
- "How to" and "what is" queries (which I can target with content pages)
- Comparison queries (which I can target with a single comparison page)
- Country/region-specific queries (which most competitors ignore)

Avoid:
- Single-word keywords like "Celo" or "USDT" (too competitive)
- Brand keywords I don't own
- Keywords my target user wouldn't actually type

Output as a table I can paste into a spreadsheet.
```

---

## 4. Content that ranks for Celo projects

You don't need a blog with 200 articles. You need 3-5 high-quality pieces that target your top keywords.

### The 4 page types every Celo project should ship

1. **Landing page** (`/`) — targets your brand + primary product keyword
2. **"How to use" guide** (`/guide` or `/how-it-works`) — targets the "how to use {your product}" and "how to {core action} on Celo" keywords
3. **Comparison page** (`/vs/{competitor}`) — one page per major competitor, targets "{your product} vs {competitor}" keywords
4. **Stats/proof page** (`/stats`) — auto-generated from your analytics ([growth-analytics.md](growth-analytics.md)), targets trust-related searches

### Optional 5th: a build-in-public log

Your build-in-public weekly updates (from [growth-comms.md](growth-comms.md) §2) can be mirrored to `/blog` for compounding SEO. Each post is a piece of fresh content Google indexes, signals you're an active project, and earns long-tail traffic over time.

### Prompt: "Outline a how-to guide that ranks"

```
I want to write a how-to guide that ranks for "{target keyword from §3}".

My product is {one-sentence pitch}.

Currently ranking for this keyword (paste top 5 results from Google):
1. {URL 1} — {1-sentence summary of what they cover}
2. {URL 2} — ...
3. ...

Outline a page that's BETTER than these by:
1. Being more comprehensive (covers a question they all miss)
2. Being more specific to my user's context (country / device / use case)
3. Including original assets (a screenshot, a video, a calculator, a
   real number from my product)

Structure:
- H1 that includes the target keyword
- 4-6 H2 sections that cover the user's natural follow-up questions
- Internal links to 2-3 other pages on my site
- 1-2 external links to authoritative sources (docs.celo.org, the
  Celo blog, the user's wallet's docs)
- A CTA at the bottom that's specific to the article topic
- Word count target: 1200-2000 (long enough to be authoritative, short
  enough that someone actually reads it)

For each H2, give me the section title and 2-3 sentences of what to write.

Apply MiniPay copy rules: "Network fee" not "Gas", "Stablecoin" not "Crypto",
phone/alias not 0x addresses.
```

---

## 5. Off-page SEO — backlinks that move the needle

The kinds of backlinks that compound for Celo projects:

| Source | Effort to acquire | DR/authority lift |
|--------|-------------------|-------------------|
| Celo official blog / Twitter | Email Celo Foundation when you launch | Very high |
| docs.celo.org "ecosystem" listing | PR to celo-org/docs | Very high |
| The Grid (ecosystem directory) | Submit your project | Medium-high |
| Coverage in local crypto media (Cripto247, DiarioBitcoin, etc.) | See [growth-comms.md](growth-comms.md) §4 | Medium |
| Hackathon recap pages | Win/place in a Celo hackathon | Medium |
| GitHub README badges from infra you use (PostHog, The Graph) | Earned by integration | Low-medium |
| Listing in awesome-celo / awesome-minipay | PR to the awesome-list repos | Low (but high-context traffic) |

What does NOT move the needle in 2026:
- Buying backlinks from SEO services
- Comment-spam on dev.to / Medium
- Reciprocal-link schemes
- Submitting to 100 generic web-app directories

---

## 6. Local SEO for emerging-market Celo projects

If your project is country-specific, do these:

- **Native-language landing page** at `/es`, `/pt`, `/sw`, `/tl`, `/id` (as separate hreflang versions) — even if your team works in English. Google ranks language-matched pages dramatically higher for native-language queries.
- **Country-specific content pages** — `/argentina`, `/mexico`, `/kenya`, `/nigeria`, `/philippines`, `/brazil` — each addressing the specific savings/payments problem in that country with local context (local currency, local off-ramps, local regulations).
- **Hreflang tags** in the `<head>` of every page to tell Google which language/region each URL targets:
  ```html
  <link rel="alternate" hreflang="en" href="https://yourproject.com/">
  <link rel="alternate" hreflang="es" href="https://yourproject.com/es">
  <link rel="alternate" hreflang="pt" href="https://yourproject.com/pt">
  <link rel="alternate" hreflang="x-default" href="https://yourproject.com/">
  ```

---

## 7. Measuring SEO — what to look at

Don't measure rank. Measure traffic and conversions.

| Metric | Source | Why |
|--------|--------|-----|
| **Organic sessions / month** | PostHog + UTM (or Plausible/Google Search Console) | The actual outcome — humans arriving from search |
| **Top 10 landing pages** | PostHog | Where SEO is working — double down |
| **Top 10 search queries** | Google Search Console | What people typed to find you — content topics for next |
| **Avg position on top 10 queries** | Google Search Console | Are you on page 1, or stuck on page 3? |
| **Branded vs non-branded query split** | Google Search Console | Mostly branded = SEO not working yet. Mostly non-branded = compounding. |
| **Conversion rate of organic traffic** | PostHog | Are these the right users? Should be similar to or higher than other channels. |

Set up Google Search Console on day 1 (free, takes 10 minutes). Wait 90 days before judging the strategy — SEO compounds slowly.

---

## 8. The patient channel — manage expectations

SEO does not pay off in 30 days. Realistic timeline for a Celo project starting from zero:

- **Month 1-2**: 0-50 organic visits/month. Nothing visible. This is fine.
- **Month 3-4**: 100-500/month. First non-branded keywords appear in Search Console.
- **Month 6**: 500-2,000/month. A few pages start ranking on page 1 for long-tail queries.
- **Month 12**: 2,000-10,000+/month. Compounding visible. Worth the wait.

If a builder needs traffic *this week*, send them to [growth-gtm.md](growth-gtm.md) — SEO is a complementary long-term channel, not a replacement for active distribution work.
