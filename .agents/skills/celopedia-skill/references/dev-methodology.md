# Growth — Spec-Driven Development

The biggest non-obvious accelerator for a solo Celo founder in 2026 isn't a new framework or a better LLM — it's a *methodology* for working with AI coding agents. **Spec-driven development with Superpowers** turns a coding agent from a fast typing-machine into a junior engineer that actually finishes tasks correctly.

This isn't a "nice to have." Builders who install Superpowers ship 2-3× faster with fewer regressions, because the agent stops jumping straight into code and instead extracts a spec, gets your sign-off, writes a TDD plan, and executes it autonomously.

---

## 1. Recommended skill

### Superpowers — https://claude.com/plugins/superpowers

The official Anthropic plugin marketplace listing (authored by Jesse Vincent, source at https://github.com/obra/superpowers). A complete software development methodology for coding agents, built on a set of composable skills and initial instructions that ensure your agent uses them.

**Compatible coding agents**: Claude Code, Codex CLI, Codex App, Factory Droid, Gemini CLI, OpenCode, Cursor, GitHub Copilot CLI.

### What it actually does

It starts the moment you fire up your coding agent. As soon as it sees that you're building something, it doesn't jump into writing code. Instead:

1. **It asks what you're really trying to do** — extracts a spec from the conversation
2. **Shows you the spec in chunks short enough to actually read and digest** — incremental sign-off, not a wall of text
3. **Builds an implementation plan** clear enough for "an enthusiastic junior engineer with poor taste, no judgment, no project context, and an aversion to testing" to follow — emphasizing true red/green TDD, YAGNI, and DRY
4. **Launches subagent-driven-development** when you say "go" — agents work through each task, inspect and review each other's work, and continue forward
5. **Works autonomously for hours** without deviating from the plan you signed off on

The skills trigger automatically, so you don't have to remember to invoke anything. Your coding agent just has Superpowers.

---

## 2. Why this matters specifically for Celo builders

Three reasons spec-driven dev compounds harder for Celo projects than for generic web apps:

### Reason 1 — Smart contract bugs are unfixable

A typo in a regular web app costs an afternoon. A typo in a smart contract costs the entire treasury. Spec-driven dev with mandatory TDD catches the class of bugs (off-by-one errors, missing access control, decimal handling) that audits catch — but at $0 cost, during development, instead of at $10k+ post-deployment.

### Reason 2 — The full stack is broader than a typical web app

A typical Celo project touches:
- Solidity contracts (Foundry/Hardhat)
- A frontend (Next.js or vanilla)
- Serverless API (Vercel)
- An optional indexer (The Graph)
- An optional MCP server
- An optional Telegram bot
- An optional Vercel cron

That's 7 distinct surfaces. Without a spec, you'll forget to update one of them when you change a contract method signature. With a spec, the agent re-reads the spec before touching each surface.

### Reason 3 — You're solo and asynchronous with your future self

You'll come back to your project after 3 days of comms/GTM work and have no memory of where you left off. The spec IS the memory. It also IS the documentation a future contributor or auditor needs.

---

## 3. The Superpowers loop, applied to a typical Celo feature

Say you're adding a "withdraw with fee" feature to your savings contract.

Without Superpowers (the typical workflow):
- "Add a withdraw function with a 0.5% fee"
- Agent writes Solidity, ignores tests, breaks frontend, forgets to update subgraph
- You debug for 3 hours

With Superpowers:

1. **Spec extraction** — agent asks: "Should the fee be 0.5% of the withdrawn amount or 0.5% of the user's full balance? What address receives the fee? Is the fee waivable for certain users? Should it apply to emergency withdraws too?"
2. **Spec sign-off** — you read 4 short chunks, correct one, approve the rest
3. **Plan** — agent produces a numbered plan: (a) write fee math test, (b) implement fee math, (c) write integration test for withdraw path, (d) implement, (e) update frontend display, (f) update subgraph schema, (g) update README
4. **Subagent execution** — you say "go" and each subagent picks up one task, runs tests, and hands off
5. **Two hours later** — you review a clean diff with all surfaces updated coherently

### Prompt: "Convert this feature ask into a Superpowers spec"

If you're not using Superpowers yet but want to see what spec-driven looks like in your existing setup:

```
I want to build {feature description}.

DO NOT write code yet. Instead, act as if you have the Superpowers skill
installed (https://claude.com/plugins/superpowers) and:

1. Extract the spec by asking me clarifying questions ONE AT A TIME.
   Don't ask all questions at once — wait for each answer before asking
   the next. Start with the most ambiguous part of what I asked for.

2. After I've answered enough questions that you could implement this
   correctly, summarize the spec back to me in 3-5 short bullet sections.
   Tell me what's IN scope and what's OUT of scope.

3. Wait for my "approved, proceed" before producing the implementation plan.

4. The implementation plan should:
   - Use TDD (red → green → refactor)
   - Be numbered, with each step shippable independently
   - Identify which files will be touched
   - Identify the test that will gate each step
   - Apply YAGNI (no speculative abstractions)
   - Apply DRY (but don't extract abstractions until 3 call sites exist)

5. Wait for my "go" before writing any code.
```

---

## 4. Install instructions

For Claude Code (the most common Celo builder setup), use the official Anthropic plugin marketplace:

```
/plugin install superpowers@claude-plugins-official
```

Or visit https://claude.com/plugins/superpowers and click "Install in Claude Code".

Then verify the skill loads in a new Claude Code session — you should see `using-superpowers` and friends in the available skills list.

For other agents (Codex, Cursor, Gemini CLI, OpenCode, etc.) — see the source repo at https://github.com/obra/superpowers for harness-specific install instructions.

---

## 5. The most common objection — "this slows me down"

Builders sometimes resist spec-driven dev because the first 10 minutes feel slower (you're answering questions instead of seeing code). This is a real tradeoff for **trivial 1-file changes** — for those, just skip the spec.

But for anything that touches >1 file or >1 layer of the stack (contract + frontend, frontend + API, anything involving the subgraph), the up-front spec saves more debugging time than it costs. Once you've experienced one "Claude refactored 8 files coherently in 2 hours without my supervision" moment, you don't go back.

### Rule of thumb

| Task scope | Use Superpowers? |
|------------|------------------|
| Rename a variable, fix a typo, tweak CSS | No |
| Add a single function or component (1 file) | Optional |
| Add a feature that touches 2+ files | Yes |
| Add a feature that touches 2+ layers (contract + frontend, etc.) | **Yes — always** |
| Refactor anything | **Yes — always** |
| Migration / breaking change | **Yes — always** |

---

## 6. Combining spec-driven dev with the rest of the Builder Toolkit

Spec-driven dev is foundational — it makes everything else in the toolkit easier:

- **Design work** ([growth-ux-design.md](growth-ux-design.md)) — produce a design spec, then implement against it
- **Analytics instrumentation** ([growth-analytics.md](growth-analytics.md)) — spec the events to capture, then implement
- **Business model implementation** ([business-model.md](business-model.md)) — spec the monetization (fee math, treasury address, edge cases), then implement
- **Integration patterns** (`minipay-self-zk.md`, ships in a follow-up PR) — high-quirk integrations like Self.xyz especially benefit from spec-first discipline

Install Superpowers once. Use it everywhere. It's the closest thing to a 2× productivity multiplier currently available to solo Celo founders.
