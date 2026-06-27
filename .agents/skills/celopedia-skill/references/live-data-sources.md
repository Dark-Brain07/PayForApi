# Live Data Sources

Instead of relying on hardcoded snapshots, use these APIs and endpoints to fetch real-time data. **Always prefer live data over hardcoded reference files** for TVL, prices, protocol status, and grant programs.

Hardcoded references (contracts.md, network-info.md) should still be trusted for contract addresses and chain configuration — those rarely change.

---

## 1. DeFi TVL & Protocol Data (DefiLlama)

### Get all protocols on Celo with TVL

```bash
curl -s https://api.llama.fi/protocols | jq '[.[] | select(.chains[]? == "Celo")] | sort_by(-.tvl) | .[] | {name, tvl, category, slug}'
```

### Get total Celo chain TVL

```bash
curl -s https://api.llama.fi/v2/chains | jq '.[] | select(.name == "Celo") | {name, tvl}'
```

### Get specific protocol TVL on Celo

```bash
# Replace "aave-v3" with protocol slug
curl -s https://api.llama.fi/protocol/aave-v3 | jq '.chainTvls.Celo'
```

### Common protocol slugs on Celo
- `aave-v3` — Lending
- `uniswap` — DEX (V3)
- `morpho` — Lending
- `curve-dex` — DEX
- `mento` — Stablecoins
- `beefy` — Yield aggregator

**When to use**: Any question about TVL, yield, protocol size, or "what's the biggest X on Celo?"

---

## 2. Grant Programs (celopg.eco)

### Fetch current programs

```bash
curl -s https://www.celopg.eco/programs
```

The page lists all programs with status badges (Live/Past), dates, hosts, and funding amounts. Parse the HTML to get current state.

**MANDATORY for any grant/program question.** The `grants-funding.md` cache goes stale the moment a program's status flips (e.g. a program listed as "Past" may actually be Live this quarter). Never answer an eligibility, status, reward, or deadline question from the cache alone — always fetch.

**Key fields to extract**: status (Live vs Past), funding amount, date range, host organization, **eligibility requirements**, submission cadence (monthly/rolling/one-shot), submission deadlines.

---

## 3. Ecosystem Products (The Grid — GraphQL)

See `the-grid-skill.md` for complete query templates. The Grid is the primary live source for ecosystem intelligence.

**Endpoint**: `https://beta.node.thegrid.id/graphql`
**Auth**: None required

### Quick: Products deployed on Celo

```bash
curl -s -X POST https://beta.node.thegrid.id/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ products(where: { productDeployments: { smartContractDeployment: { deployedOnProduct: { name: { _ilike: \"%celo%\" } } } }, productStatus: { slug: { _eq: \"live\" } } }, order_by: { root: { gridRank: { score: desc_nulls_last } } }, limit: 25) { name productType { slug name } root { slug urlMain } } }" }' | jq .
```

**When to use**: Competitive analysis, "what exists on Celo?", vertical saturation.

---

## 4. On-Chain Data (RPC)

### Get current block number

```bash
curl -s -X POST https://forno.celo.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' | jq -r '.result' | xargs printf "%d\n"
```

### Get CELO balance of an address

```bash
curl -s -X POST https://forno.celo.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["ADDRESS_HERE","latest"],"id":1}' | jq -r '.result'
```

### Get ERC-20 token balance (e.g., USDm/cUSD)

```bash
# balanceOf(address) selector: 0x70a08231
# Pad address to 32 bytes
curl -s -X POST https://forno.celo.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x765DE816845861e75A25fCA122bb6898B8B1282a","data":"0x70a08231000000000000000000000000ADDRESS_WITHOUT_0x"},"latest"],"id":1}' | jq -r '.result'
```

### Get current gas price

```bash
curl -s -X POST https://forno.celo.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}' | jq -r '.result'
```

### Check if a contract exists at an address

```bash
curl -s -X POST https://forno.celo.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getCode","params":["CONTRACT_ADDRESS","latest"],"id":1}' | jq -r '.result | length'
```

**When to use**: Verifying addresses, checking balances, confirming contract deployments.

---

## 5. Celo Documentation (llms.txt)

### Fetch the latest docs sitemap

```bash
curl -s https://docs.celo.org/llms.txt
```

Returns a structured list of all documentation pages. Use this to find the right docs page for any topic instead of relying on the hardcoded `docs-map.md`.

**When to use**: Finding docs pages, especially if the user asks about something that might have new documentation.

---

## 6. Celoscan API (Block Explorer)

### Get contract ABI (verified contracts only)

```bash
curl -s "https://api.celoscan.io/api?module=contract&action=getabi&address=CONTRACT_ADDRESS&apikey=API_KEY"
```

### Get token info

```bash
curl -s "https://api.celoscan.io/api?module=token&action=tokeninfo&contractaddress=TOKEN_ADDRESS&apikey=API_KEY"
```

### Get transaction list for address

```bash
curl -s "https://api.celoscan.io/api?module=account&action=txlist&address=ADDRESS&startblock=0&endblock=99999999&sort=desc&apikey=API_KEY"
```

**Note**: Celoscan API requires an API key from https://celoscan.io/myapikey. Some endpoints work without a key but are rate-limited.

---

## 7. Blockscout API (Alternative Explorer)

### Get contract info (no API key needed)

```bash
curl -s "https://celo.blockscout.com/api/v2/addresses/CONTRACT_ADDRESS"
```

### Get token info

```bash
curl -s "https://celo.blockscout.com/api/v2/tokens/TOKEN_ADDRESS"
```

### Get address token balances

```bash
curl -s "https://celo.blockscout.com/api/v2/addresses/ADDRESS/token-balances"
```

**When to use**: Quick contract/token lookups without needing an API key.

---

## 8. Governance — Celo Mondo API

Celo Mondo (`mondo.celo.org`) has a **public JSON API** for governance proposals. No auth needed.

### Get all governance proposals

```bash
curl -s 'https://mondo.celo.org/api/governance/proposals' | jq '.[:5] | .[] | {id, cgp, title, stage, timestamp, proposer, approvedAt, executedAt}'
```

### Proposal fields

Each proposal includes: `id`, `cgp` (CGP number), `title`, `author`, `stage` (numeric), `timestamp`, `proposer`, `deposit`, `networkWeight`, `transactionCount`, `queuedAt`, `dequeuedAt`, `approvedAt`, `executedAt`, `url` (forum link), `cgpUrl` (GitHub link), `cgpUrlRaw` (raw markdown), `constitutionThreshold`.

### Get votes for a proposal

```bash
curl -s 'https://mondo.celo.org/api/governance/votes?proposalId=PROPOSAL_ID' | jq 'keys | length'
```

### Stage values

Stages are numeric. Common values: `6` = executed/passed.

**When to use**: Any question about governance proposals, voting results, proposal history, or "what proposals are active?"

---

## 9. Governance — CGP Repository (GitHub)

All Celo Governance Proposals (CGPs) are stored as markdown in `celo-org/governance`.

### List all CGPs

```bash
gh api repos/celo-org/governance/contents/CGPs | jq -r '.[].name' | sort -V | tail -10
```

### Read a specific CGP

```bash
# Replace cgp-0232.md with any CGP number
curl -s 'https://raw.githubusercontent.com/celo-org/governance/main/CGPs/cgp-0232.md' | head -40
```

### CGP frontmatter fields

Each CGP markdown file has YAML frontmatter with: `cgp`, `title`, `date-created`, `author`, `status` (DRAFT, PROPOSED, EXECUTED, etc.), `discussions-to` (forum URL), `governance-proposal-id`, `date-executed`.

**When to use**: Reading full proposal text, understanding proposal details, checking proposal status history.

---

## 10. Governance — Celo Forum (Discourse API)

The Celo Forum (`forum.celo.org`) runs on Discourse with a **public JSON API** — no auth needed.

### Get governance discussions

```bash
curl -s 'https://forum.celo.org/c/governance/12.json' | jq '.topic_list.topics[:5] | .[] | {id, title, created_at, posts_count, views}'
```

### Get latest topics across all categories

```bash
curl -s 'https://forum.celo.org/latest.json' | jq '.topic_list.topics[:5] | .[] | {id, title, category_id, created_at, reply_count}'
```

### Read a specific topic

```bash
curl -s 'https://forum.celo.org/t/TOPIC_ID.json' | jq '{title, created_at, posts_count, views, tags}'
```

### Search the forum

```bash
curl -s 'https://forum.celo.org/search.json?q=SEARCH_TERM' | jq '.topics[:5] | .[] | {id, title}'
```

### Key category IDs

| Category | ID | URL |
|----------|-----|-----|
| Governance | 12 | `/c/governance/12.json` |
| Announcements | 5 | `/c/announcements/5.json` |
| Developers | 22 | `/c/developers/22.json` |
| Ecosystem | 15 | `/c/ecosystem/15.json` |
| Protocol | 20 | `/c/protocol/20.json` |

**When to use**: Community discussions, proposal debate context, developer announcements.

---

## Priority Order for Data Sources

When answering questions, prefer data sources in this order:

1. **Live API** (DefiLlama, The Grid, Mondo, Forum, RPC, celopg.eco) — most current
2. **Official docs** (docs.celo.org/llms.txt) — authoritative for technical info
3. **Hardcoded references** (contracts.md, network-info.md) — stable, verified data
4. **Ecosystem directory** (ecosystem.md) — curated snapshot, may be stale

Always tell the user when you're using hardcoded data vs live data, and suggest they verify with the live source if the data might be stale.
