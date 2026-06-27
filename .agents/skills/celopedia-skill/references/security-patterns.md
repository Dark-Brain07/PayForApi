# Celo-Specific Security Patterns

> **Scope:** risks that are **unique to Celo** and not generally covered by chain-agnostic audit skills. For general Solidity auditing (static analysis, threat modeling, invariants, fuzz testing, access control, math precision), use the **Pashov Audit Group skills**: https://github.com/pashov/skills
>
> Specifically: `solidity-auditor` (8-agent parallel audit) and `x-ray` (threat model / attack surface generation).
>
> This file is a **minimal stub**, not a full audit playbook. Each risk below names the failure mode and a rough mitigation; several include **⚠️ Unverified specifics** tags — verify against primary sources before shipping authoritative guidance.

---

## 1. CELO token duality

**Risk:** CELO exists on two transport paths simultaneously — native (`msg.value`) and ERC-20 at `0x471EcE3750Da237f93B8E339c536989b8978a438`. Contracts that treat the same user action as crediting through both paths produce double-count accounting. Contracts that reject one path when the target function expects the other silently lose funds.

**Detection:**
- Search each entry point for both `msg.value > 0` handling and `IERC20(CELO).transferFrom(...)`.
- If both can credit the same balance, confirm the two paths are tracked in separate state or explicitly mutually exclusive.

**Mitigation:**
- Pick one path per entry point. If you must accept both, track them in separate balances or unify at a single authoritative entry.
- Never assume `address(this).balance` alone captures CELO deposits — aggregate with `IERC20(CELO).balanceOf(address(this))` if both paths are live.

> Builder-side how-to: `builder-guide.md` → _Sending CELO — common failure & fix_.

---

## 2. Fee abstraction (CIP-64) abuse

**Risk:** With `feeCurrency` set, gas is paid in a whitelisted ERC-20 — including tokens your contract also accepts as payment. A user's transaction can both debit a balance inside your contract **and** pay gas in the same token, out-of-band. If your accounting assumes `msg.sender`'s balance is stable across the call, that assumption can fail.

**⚠️ Unverified specifics — check before shipping:**
- CIP-64 ([spec](https://github.com/celo-org/celo-proposals/blob/master/CIPs/cip-0064.md)) defines the tx type and encoding but **does not explicitly state whether the `feeCurrency` debit runs before, during, or after the main call, or whether unused gas is refunded in the fee currency**. Confirm this against current Celo client behavior before writing authoritative mitigations.
- The CIP refers back to CIP-42 for security considerations without restating them.

**Rough rule:**
- Never assume `msg.sender`'s token balance at the start of a function equals their balance at the end, even without your contract touching it — the fee-currency deduction happens outside your code.
- If you rely on balance-delta invariants (e.g. "this call must transfer exactly `x` tokens from the caller"), assert them with `balanceOf` snapshots taken inside your call, not from pre-call state.

---

## 3. Aave V3 aToken ratio drift

**Risk:** aToken balance is **not** 1:1 with the underlying — it scales with `liquidityIndex` as interest accrues. Contracts that treat `aToken.balanceOf(x)` as "x's underlying position" produce incorrect share math, incorrect redemption amounts, and (over long horizons) increasingly skewed accounting.

**⚠️ Unverified specifics — check before shipping:**
- Exact conversion math lives in Aave V3's `ReserveLogic` / `WadRayMath` libraries. Verify the current formula against the Aave V3 docs (`https://docs.aave.com/developers/core-contracts/pool`) before relying on any snippet here.

**Mitigation:**
- Store positions as `scaledBalanceOf` (index-normalized) — not raw `balanceOf`. Convert to underlying only at the moment of display/withdrawal via the current reserve index.
- For UIs: fetch fresh data via `UIPoolDataProvider` (see `defi-protocols.md` → _Fetching Live APY_).

---

## 4. Mento circuit breaker risk

**Risk:** Mento stablecoin pools (USDm, EURm, BRLm, GBPm, etc.) use per-pool price-deviation **circuit breakers** that halt swaps when the live price diverges too far from a reference / EMA, or when oracle data goes stale. A protocol that assumes always-available Mento mint/redeem can freeze user funds during breaker cooldowns.

**What is known** (from Mento v3 docs, `https://docs.mento.org/mento-v3/dive-deeper/fpmm/oracles-and-circuit-breakers`):
- Breakers are **binary** — trading is either allowed or halted for that feed; they do not throttle.
- When tripped, **swaps and quotes halt** on affected pools. Adding/removing liquidity in existing pools may remain possible.
- Resets require a **cooldown period plus normalized conditions**; thresholds and cooldowns are governance-configured.
- FX-priced pools (EURm/USDm, GBPm/USDm) are most exposed to market-hours gating; USDC/USDm is less affected.

**⚠️ Unverified specifics — check before shipping:**
- Exact threshold values, cooldown durations, and the full list of gated pools change via governance. Always read the live config, not this file.

**Mitigation:**
- Design withdrawal paths that don't require hitting Mento atomically. Consider fallback liquidity (Uniswap, Curve) or time-delayed queues.
- For critical user flows, detect breaker state before quoting and surface it in the UI.

---

## 5. Epoch boundary effects (post-L2 migration)

**Risk:** Post-L2 migration (block 31,056,500, 2025-03-26), epoch processing moved from the geth client to an `EpochManager` smart contract. Contracts that read staking-related balances or validator state at epoch boundaries may see non-atomic or mid-transition state.

**What is known** (from the Celo L2 migration spec, `https://specs.celo.org/l2_migration.html`):
- Epoch processing, rewards distribution, and elected-validator storage are handled by the `EpochManager` contract.
- Only a subset of legacy epoch functions were ported: `getEpochNumberOfBlock()`, `getEpochNumber()`, `validatorSignerAddressFromCurrentSet()`, `numberValidatorsInCurrentSet()`.

**⚠️ Unverified specifics — check before shipping:**
- **Epoch duration** post-L2 is not stated in the spec page above — confirm against current `EpochManager` configuration or release notes.
- Whether epoch state changes are atomic-within-one-block or spread across multiple blocks is **not documented on the linked spec page**. Don't assume atomicity without verification.

**Mitigation:**
- For staking / validator / reward math, prefer reading from `EpochManager` directly rather than inferring from validator balances or total supply.
- If your logic depends on atomic balance snapshots, don't rely on values read in the same block as an epoch transition — add a buffer or cross-check with the previous epoch's finalized state.

---

## 6. Low-liquidity DEX pool execution risk

**Risk:** Pool depth on Celo varies hugely per pair, per DEX, per version, and per fee tier — and shifts over time as liquidity migrates. When a pool's reserves are small relative to the swap size, the AMM curve produces extreme price impact: the effective execution rate can diverge by orders of magnitude from external market price. Standard slippage protection (`amountOutMin`) does **not** catch this, because the router validates against the pool's own quoted output, not against market price. A swap that pays the user 1.5% less than the (broken) pool quote still settles, even if that pool quote is 5000% off market. The failure is silent from the contract's perspective — the tx succeeds, the user just receives a tiny amount.

**What is known:**
- This affects any constant-product (Uniswap V2-style) pool whose `reserve0 * reserve1` product is small relative to the input amount.
- Concentrated-liquidity (Uniswap V3-style) pools fail similarly when active in-range liquidity is thin at the trade's price.
- On Celo specifically, liquidity has migrated several times since the L2 transition (Ubeswap V2 → Uniswap V3 → V4), so pools and fee tiers that older code or tutorials still default to may now be effectively empty. Per-pair, per-tier reality changes — don't assume protocol-wide claims like "X DEX is the deep one" stay true.

**⚠️ Unverified specifics — check before shipping:**
- Live TVL per pool changes daily. This file deliberately does not name "the deep pool" for any given pair, because that ranking goes stale. Always query live (DefiLlama, the protocol's subgraph, or on-chain reserves) at the time of the swap.

**Mitigation:**
- **Sanity-check pool depth on-chain at quote time.** For V2-style: `factory.getPair(a, b)` → `IERC20.balanceOf(pair)` for both tokens. For V3-style: `factory.getPool(a, b, fee)` → balance check. If either reserve is < ~10× the swap size, route elsewhere.
- **Cross-check the router's quoted output against an external price reference** (CoinGecko, DefiLlama, or a deeper venue) before broadcasting. Abort if the implied rate diverges more than ~2% from reference. Pseudocode:

  ```ts
  const quoted = await router.getAmountsOut(amountIn, path);
  const effectiveRate = Number(amountIn) / Number(quoted[quoted.length - 1]);
  const reference = await fetchReferencePrice(tokenIn, tokenOut); // off-chain oracle
  if (Math.abs(effectiveRate - reference) / reference > 0.02) {
    throw new Error("Quote diverges from reference price — pool likely shallow. Aborting.");
  }
  ```

- **For automated systems** (bots, agents, keepers, sweep scripts) that swap programmatically, encode both checks as hard preconditions — do not rely on a configured `slippage` parameter alone, and do not hard-code a "preferred DEX / fee tier" without re-validating depth at runtime.
- **Don't blanket-blacklist or blanket-recommend any DEX or version.** Pool health is per-pair and time-varying. A pair that's deep on one DEX today may shift tomorrow; a pair that's shallow on a DEX may have a sibling pair (different fee tier, different stable, multi-hop route) that's fine.

---

## Using this file with pashov/skills

For any Celo deployment, run all three layers:

1. **pashov/skills `solidity-auditor`** → chain-agnostic security coverage (math precision, access control, economic security, invariants, first principles, execution trace).
2. **pashov/skills `x-ray`** → threat model, actors, trust boundaries, attack surfaces, data flow.
3. **This file** → Celo-specific risks layered on top.

Install pashov/skills: https://github.com/pashov/skills
