# The Grid — Ecosystem Intelligence Queries

> Endpoint: `https://beta.node.thegrid.id/graphql`
> Auth: None required (public API)
> Engine: Hasura-style GraphQL

The Grid indexes **6,300+ crypto products** across chains. Use it for competitive analysis, ecosystem mapping, and trend discovery.

**Important**: The Grid has NO full-text search. It only supports substring matching via `_contains`, `_eq`, `_in` operators. Craft queries accordingly.

---

## Core Schema

```
roots (top-level projects/orgs)
  └── products
       └── productDeployments
            └── smartContractDeployment
                 └── smartContracts
  └── entities (legal/org entities)
  └── assets (tokens)
  └── profileInfos (metadata)
```

### Key Types

- **Root**: A project or organization (e.g., "Uniswap", "Aave")
- **Product**: A specific offering (e.g., "Uniswap V3", "Aave Lending")
- **ProductType**: Category slug (e.g., `dex`, `lending`, `bridge`, `wallet`)
- **ProductStatus**: Lifecycle (`live`, `beta`, `deprecated`, `dead`)
- **ProductDeployment**: Chain-specific deployment info
- **SmartContractDeployment**: Network where contracts are deployed
- **Asset**: Token/coin tracked by the project

---

## Query Templates

### 1. Search Products by Vertical (e.g., "Find all DEXes")

Use this to explore a category. Replace `"dex"` with any product type slug.

```graphql
query SearchByVertical {
  products(
    where: {
      productType: { slug: { _eq: "dex" } }
      productStatus: { slug: { _eq: "live" } }
    }
    order_by: { root: { gridRank: { score: desc_nulls_last } } }
    limit: 25
  ) {
    name
    productType { slug name }
    productStatus { slug }
    root {
      slug
      urlMain
      gridRank { score }
    }
    productDeployments {
      smartContractDeployment {
        deployedOnProduct { name }
      }
    }
  }
}
```

**Common product type slugs:**
- `dex` — Decentralized exchanges
- `lending` — Lending/borrowing
- `bridge` — Cross-chain bridges
- `wallet` — Wallets
- `yield_aggregator` — Yield farming
- `liquid_staking` — Liquid staking
- `stablecoin` — Stablecoins
- `oracle` — Price oracles
- `nft_marketplace` — NFT marketplaces
- `launchpad` — Token launchpads
- `derivatives` — Derivatives/perps
- `payments` — Payment protocols
- `identity` — Identity/DID
- `data_analytics` — Analytics platforms
- `rwa` — Real-world assets
- `insurance` — Insurance protocols
- `gaming` — Gaming/GameFi

### 2. Keyword Search (Broad)

Search across product names and descriptions. Remember: substring match only, not semantic.

```graphql
query KeywordSearch {
  products(
    where: {
      _or: [
        { name: { _ilike: "%stablecoin%" } }
        { root: { profileInfos: { descriptionShort: { _ilike: "%stablecoin%" } } } }
      ]
      productStatus: { slug: { _eq: "live" } }
    }
    order_by: { root: { gridRank: { score: desc_nulls_last } } }
    limit: 25
  ) {
    name
    productType { slug name }
    root {
      slug
      urlMain
      gridRank { score }
      profileInfos { descriptionShort }
    }
  }
}
```

### 3. Get Full Root Profile

Expand a specific project to see all its products, entities, and assets.

```graphql
query RootProfile {
  roots(where: { slug: { _eq: "uniswap" } }) {
    slug
    urlMain
    urlGithub
    urlTwitter
    urlDiscord
    urlDocs
    gridRank { score }
    profileInfos {
      descriptionShort
      descriptionLong
      foundingDate
      tagline
    }
    products {
      name
      productType { slug name }
      productStatus { slug }
      productDeployments {
        smartContractDeployment {
          deployedOnProduct { name }
        }
      }
    }
    assets {
      name
      symbol
      assetType { slug }
      assetStandard { slug }
    }
    entities {
      name
      entityType { slug }
      country
    }
  }
}
```

### 4. Saturation Analysis

Count products per category to identify crowded vs. underserved verticals.

```graphql
query SaturationAnalysis {
  products_aggregate(
    where: { productStatus: { slug: { _eq: "live" } } }
  ) {
    aggregate { count }
  }
}
```

To get counts per category, run the vertical search for each slug and check `aggregate.count`.

### 5. Products Deployed on a Specific Chain

Find what's deployed on Celo (or any chain):

```graphql
query ProductsOnCelo {
  products(
    where: {
      productDeployments: {
        smartContractDeployment: {
          deployedOnProduct: { name: { _ilike: "%celo%" } }
        }
      }
      productStatus: { slug: { _eq: "live" } }
    }
    order_by: { root: { gridRank: { score: desc_nulls_last } } }
    limit: 50
  ) {
    name
    productType { slug name }
    root {
      slug
      urlMain
      gridRank { score }
    }
  }
}
```

### 6. Product Dependency Graph

Find what products a given product supports/depends on:

```graphql
query Dependencies {
  products(where: { root: { slug: { _eq: "chainlink" } } }) {
    name
    supportsProducts {
      name
      root { slug }
      productType { slug }
    }
  }
}
```

### 7. Entity Search

Find organizations/companies behind a product:

```graphql
query EntitySearch {
  entities(
    where: { name: { _ilike: "%celo%" } }
    limit: 10
  ) {
    name
    entityType { slug }
    country
    root {
      slug
      urlMain
      products { name productType { slug } }
    }
  }
}
```

### 8. Asset/Token Search

Find tokens by symbol or name:

```graphql
query AssetSearch {
  assets(
    where: {
      _or: [
        { symbol: { _ilike: "%CELO%" } }
        { name: { _ilike: "%celo%" } }
      ]
    }
    limit: 10
  ) {
    name
    symbol
    assetType { slug }
    assetStandard { slug }
    root {
      slug
      urlMain
    }
  }
}
```

### 9. Discover Product Type Slugs

If you don't know the exact slug for a vertical:

```graphql
query DiscoverTypes {
  productTypes(
    where: { name: { _ilike: "%lend%" } }
  ) {
    slug
    name
  }
}
```

---

## EVM Filtering Strategy

When doing competitive analysis for Celo builders, filter results to EVM-relevant projects:

1. **Chain filter**: Use the "Products Deployed on a Specific Chain" query targeting Celo, Ethereum, Base, Arbitrum, Optimism, Polygon
2. **Exclude non-EVM**: If results include Solana/Cosmos/etc. deployments, note them but focus analysis on EVM
3. **Cross-chain comparison**: Query the same vertical across multiple EVM chains to identify gaps on Celo

### EVM Chain Names in The Grid

Use these in `deployedOnProduct.name` filters:
- `"Ethereum"` / `"ethereum"`
- `"Celo"` / `"celo"`
- `"Base"` / `"base"`
- `"Arbitrum"` / `"arbitrum"`
- `"Optimism"` / `"optimism"`
- `"Polygon"` / `"polygon"`

Note: Chain names may vary in capitalization. Use `_ilike` for case-insensitive matching.

---

## Making Queries

Use `curl` to query The Grid:

```bash
curl -s -X POST https://beta.node.thegrid.id/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "YOUR_QUERY_HERE"}' | jq .
```

Or use any GraphQL client. No authentication headers needed.

## Rate Limits

The Grid public API has no documented rate limits, but be respectful:
- Batch related queries when possible
- Cache results within a session
- Don't run more than ~10 queries per minute

## Fallback Strategy When Queries Return Empty

The Grid uses substring matching only — a typo or unindexed project returns `[]`. Don't treat empty results as "the project doesn't exist."

**Fallback order:**

1. **Broaden the query.** Retry with `_ilike` plus shorter substrings or alternate spellings (e.g. `"mini pay"` and `"minipay"`, `"prezenti"` and `"Celo PG"`).
2. **Check `ecosystem.md`.** The curated directory covers 30+ Celo DeFi protocols, bridges, oracles, wallets, and flagship Mini Apps — it may include projects The Grid hasn't indexed yet.
3. **WebSearch / docs.celo.org.** For very new projects (deployed this week, hackathon submissions, just-announced partners), neither The Grid nor `ecosystem.md` will have them. Fall back to web search against official Celo docs and announcements.
4. **Still empty? Say so.** Never fabricate a product listing to fill the gap — report that the query returned nothing across all three sources.
