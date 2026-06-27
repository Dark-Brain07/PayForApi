# Growth — Comms & Narrative

A Celo project that can't explain itself in one sentence will not survive contact with the user, the investor, the journalist, or the Twitter timeline. This file gives builders the prompts and cadence to develop a narrative, ship it weekly via build-in-public, and produce launch-grade content when the moment comes.

---

## 1. The one-sentence test (do this first)

Before *any* comms work, the builder needs a one-sentence answer to:

> *"What do you do, who is it for, and why does it matter right now?"*

If they can't answer in one sentence — STOP. Run the narrative prompt below before touching any social copy. Everything downstream (launch posts, tweets, pitch decks) compounds on top of this sentence. Get it wrong and you'll regret every piece of content built on top.

### Prompt: "Forge the one-sentence pitch"

```
I'm building {project name}.

What it does, in my words right now: {paste 2-4 sentences of how the
builder currently describes it — probably too long, probably full of
jargon}.

Target user: {who specifically — be granular. "MiniPay users in {country}
saving in USDT to hedge against local currency inflation", not "people in
emerging markets"}.

Why now (what changed in the world that makes this possible/urgent):
{the trigger — new tech, new regulation, new behavior, new pain}.

Produce 5 candidate one-sentence pitches in this format:
"[Project name] is [what category, in user's words] for [specific user]
who [specific pain] — so they can [specific outcome]."

Rules:
- No jargon ("DeFi", "primitives", "on-chain") unless the target user
  actually uses those words
- Specific over general: "save USDT" > "store value"
- Active over passive
- Under 25 words

For each candidate, give me the trade-off: what it nails, what it sacrifices.
Then recommend one.
```

---

## 2. Build-in-public — the weekly cadence

Build-in-public is the single highest-leverage comms strategy for solo Celo founders. It:
- Compounds an audience while you build (so launch doesn't start from zero)
- Forces you to ship visible progress weekly
- Generates content as a *by-product* of building, not as a second job
- Makes you findable by grants programs, hackathon judges, and other builders

### The 4-part weekly template

Once a week (pick a day and stick to it — Friday afternoons work for Celo Twitter / Americas + Africa timezones), post a thread/cast with this structure:

1. **What I shipped** (the screenshot or 30-second video — proof, not promise)
2. **What I learned** (one specific lesson, technical or otherwise)
3. **What's next** (one concrete commitment for next week)
4. **One metric** (users, txns, USDT moved, or "still at zero because I'm pre-launch and that's fine")

### Prompt: "Draft this week's build-in-public update"

```
Help me draft this week's build-in-public post for {project name}.

This week I shipped: {bullet list of what was built/fixed/launched}.

Things I tried that didn't work: {bullet list — be honest, this is the
authentic part that algorithms reward}.

Numbers since last week: {users, txns, USDT volume, signups — whatever
you measure. If zero, say zero.}

Next week I'm committing to: {one specific shippable thing}.

Format:
- A Twitter/X thread (5-8 tweets) AND a Farcaster cast (single, 1000-char
  limit, no thread) — same content, optimized for each format
- Lead with a hook tweet that is concrete and specific (a number, a
  screenshot description, or a counter-intuitive learning) — NOT
  "Week 4 update 🚀"
- Use "this week I" not "we" if it's a solo project — be honest about scale
- Include the {project} handle and {Celo} once, naturally
- End with a soft CTA: "try it: {url}" or "what would you want next?"
- No emojis except where they replace a word, no hashtag spam
```

### What NOT to post

- "Excited to share..." threads with no actual share
- AI-generated images that don't show your actual product
- Engagement-bait questions that don't relate to your project
- Mirror.xyz essays as the *primary* output — those work as quarterly retrospectives, not weekly updates
- A "we" voice when you're solo — be honest about being one person

---

## 3. Launch posts

A launch post is different from a weekly update. It's the single highest-stakes piece of content you'll produce; it determines how the next 1000 people first encounter your project.

### Prompt: "Draft my launch announcement"

```
I'm launching {project name} on {date}.

What it is: {the one-sentence pitch from §1 — must be locked in before
running this prompt}.

The story: {3-5 sentences of how you got here — the problem you saw,
the failed first attempt, the insight that made it click. Be specific.
"After 8 months of building" not "after a long journey".}

What's live today: {exact features users can touch now — not roadmap}.

What's NOT live yet (be honest): {features still cooking — don't promise
what you haven't shipped}.

Numbers I can share: {beta users, waitlist size, USDT in pre-launch escrow,
testnet txns — any real number, even a small one, beats vague hype}.

Where users go: {URL, MiniPay deep link, App Store, whatever the primary
action is}.

Where to follow: {your handle, project handle, Telegram/Discord, mailing list}.

Produce three versions of the launch post:
1. Twitter/X thread (8-12 tweets, image suggestions for tweets 1, 4, and 8)
2. Farcaster cast (single, 1000 chars, optimized for screenshots-on-timeline)
3. Long-form blog/Mirror post (800-1200 words, with H2 headers, written in
   the builder's voice, NOT the marketing voice)

For ALL three:
- No hype words ("revolutionary", "game-changing", "the future of")
- Concrete numbers over adjectives
- Lead with the user problem, not the tech
- Include the screenshot/video URL placeholder where it should go
- End with a clear CTA — one action, not three
```

---

## 4. Voice & tone — the trap to avoid

Most AI-generated comms sound like a B2B SaaS startup from 2019. They use words like *seamless*, *empower*, *unlock*, *democratize*. Avoid all of them. They're the comms version of AI-slop UI (see [growth-ux-design.md](growth-ux-design.md)).

Instead:

- **Use the words your users actually use.** If they say "guardar dólares" — write "save dollars," not "preserve value through stablecoin custody."
- **Be specific about pain.** "Inflation is bad" is generic; "I used to lose 8% of my salary every month to local-currency depreciation" is unforgettable.
- **Be honest about scale.** "We are 2 people and a domain name" is more compelling than "Our team is rapidly scaling."
- **Use 'I' when you're solo.** The "we" voice from a one-person team is the single most reliable tell that the comms are AI-generated.

### Prompt: "Strip AI-slop from this copy"

```
Here's some copy I wrote for {project name}: {paste copy}.

Rewrite it to remove all of these AI-slop signals:
- Buzzwords: empower, unlock, seamless, revolutionary, democratize,
  paradigm, ecosystem, leverage (as a verb), holistic, robust,
  game-changing, transformative
- Vague abstractions: "value", "solutions", "experiences"
- Hedge phrases: "we believe", "we think", "in our view"
- "We" voice if I'm a solo founder (replace with "I")
- Em-dashes used as a stylistic flourish (one per paragraph max — they
  signal AI when overused)
- Three-item lists that pad with a third weak item ("fast, cheap, and
  reliable" where "reliable" is filler)

Keep the substance. Cut the noise. Match the voice of a real builder
explaining their project to a friend — specific, opinionated, slightly
nervous, mostly honest.

Show me the before-and-after side by side so I can see what got cut.
```
