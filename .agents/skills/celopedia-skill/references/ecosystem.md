# Celo Ecosystem Directory

> Sources: docs.celo.org, DefiLlama, celo.org/ecosystem
> For live TVL data, always refer to https://defillama.com/chain/Celo
> Last updated: 2026-04-15

---

## DeFi Protocols

### DEXes

| Protocol | Description | Website |
|----------|-------------|---------|
| Uniswap V3 | Concentrated liquidity AMM | https://app.uniswap.org |
| Uniswap V4 | Next-gen AMM with hooks (deployed Oct 2025) | https://app.uniswap.org |
| Velodrome V3 | Concentrated liquidity, ve-tokenomics | https://velodrome.finance |
| Curve | Efficient stablecoin trading | https://curve.finance |
| Ubeswap | Celo-native DEX (V2 + V3) | https://ubeswap.org |
| Carbon DeFi | Automated on-chain trading strategies (Bancor) | https://app.carbondefi.xyz |
| Mento V3 | Multi-currency FX infrastructure | https://app.mento.org |

### Lending & Borrowing

| Protocol | Description | Website |
|----------|-------------|---------|
| Aave V3 | Multi-asset lending, largest on Celo | https://aave.com |
| Morpho V1 | Permissionless isolated lending markets | https://app.morpho.org |
| Feather | Risk-adjusted permissionless lending | https://app.feather.zone |

> **For live TVL data**, query DefiLlama: `curl -s https://api.llama.fi/protocols | jq '[.[] | select(.chains[]? == "Celo")] | sort_by(-.tvl)'`
> See `live-data-sources.md` for more API examples.

### Yield & Liquidity Management

| Protocol | Description | Website |
|----------|-------------|---------|
| Beefy | Autocompounding yield farming | https://beefy.com |
| Steer Protocol | Automated liquidity management | https://app.steer.finance |
| ICHI | Algorithmic liquidity strategies | https://www.ichi.org |
| TheDeep | Cross-chain DeFi liquidity automation | https://app.thedeep.ink |
| Gamma | Active liquidity management | https://www.gamma.xyz |

### Stablecoins

| Protocol | Description | Website |
|----------|-------------|---------|
| Mento V2 | Celo-native stablecoin protocol (15+ currencies) | https://app.mento.org |
| Angle | Over-collateralized stablecoin protocol | https://app.angle.money |

### Liquid Staking

| Protocol | Description | Website |
|----------|-------------|---------|
| stCELO | Liquid staking for CELO | https://stcelo.xyz |

### Derivatives

| Protocol | Description | Website |
|----------|-------------|---------|
| Lynx | Perpetuals DEX with high leverage | https://app.lynx.finance |

### RWA (Real-World Assets)

| Protocol | Description | Website |
|----------|-------------|---------|
| Toucan Protocol | Carbon credit tokenization | https://toucan.earth |
| EthicHub | ReFi protocol for unbanked farmers | https://ethichub.com |
| Anemoy Capital | Institutional RWA | https://www.anemoy.io |
| Midas RWA | Tokenized real-world assets | https://midas.app |
| VNX | Tokenized commodities/forex | https://vnx.li |
| Untangled Vault | Capital allocation | https://untangled.finance |

### Payments & Streaming

| Protocol | Description | Website |
|----------|-------------|---------|
| Superfluid | Programmable cashflows, subscriptions, salaries | https://superfluid.org |

### Governance

| Protocol | Description | Website |
|----------|-------------|---------|
| Gardens | Community governance platform | https://app.gardens.fund |

### Other

| Protocol | Description | Website |
|----------|-------------|---------|
| PoolTogether V3 | No-loss prize games | https://pooltogether.com |

---

## Stablecoin Ecosystem

Celo is known as the "Home of Stablecoins" with 15+ Mento local-currency stablecoins.

### Mento Stablecoins (see contracts.md for addresses)

> Canonical list + how to build with them: https://docs.celo.org/build-on-celo/build-with-local-stablecoin

| Currency | Symbol | Region |
|----------|--------|--------|
| US Dollar | USDm (cUSD) | Global |
| Euro | EURm (cEUR) | Europe |
| Brazilian Real | BRLm (cREAL) | Brazil |
| West African CFA Franc | XOFm (eXOF) | West Africa |
| Kenyan Shilling | KESm | Kenya |
| Nigerian Naira | NGNm | Nigeria |
| Colombian Peso | COPm | Colombia |
| British Pound | GBPm | UK |
| Swiss Franc | CHFm | Switzerland |
| Japanese Yen | JPYm | Japan |
| Australian Dollar | AUDm | Australia |
| Canadian Dollar | CADm | Canada |
| Ghanaian Cedi | GHSm | Ghana |
| Philippine Peso | PHPm | Philippines |
| South African Rand | ZARm | South Africa |

### External & third-party stablecoins

Sourced from the official list (https://docs.celo.org/build-on-celo/build-with-local-stablecoin), addresses verified on-chain. See `contracts.md` for the full table.

| Token | Symbol | Issuer | Address |
|-------|--------|--------|---------|
| USDC | USDC | Circle | `0xcebA9300f2b948710d2653dD7B07f33A8B32118C` |
| Tether USD | USDT | Tether | `0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e` |
| Tether America USD | USAT | Tether | `0xD2ab3C9A02DBBAB236BfEC45D1d755DF4267F771` |
| Mountain Protocol USD | USDM | Mountain Protocol | `0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C` |
| Angle USD | USDA | Angle | `0x0000206329b97DB379d5E1Bf586BbDB969C63274` |
| Angle Euro | EURA | Angle | `0xC16B81Af351BA9e64C1a069E3Ab18c244A1E3049` |
| VNX Euro | VEUR | VNX | `0x9346F43c1588B6DF1D52bdD6Bf846064F92d9Cba` |
| VNX British Pound | VGBP | VNX | `0x7aE4265eCFC1F31bc0E112DfCFe3D78E01f4BB7f` |
| VNX Swiss Franc | VCHF | VNX | `0xC5ebEa9984C485EC5D58cA5a2D376620d93aF871` |
| Glo Dollar | USDGLO | Glo Foundation | `0x4F604735c1cF31399C6E711D5962b2B3E0225AD3` |
| BRLA Digital | BRLA | BRLA | `0xFECB3F7c54E2CAAE9dC6Ac9060A822D47E053760` |
| Minteo Colombian Peso | COPM | Minteo | `0xC92E8Fc2947E32F2B574CCA9F2F12097A71d5606` |
| GoodDollar | G$ | GoodDollar | `0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A` |

> ⚠️ **Ticker collisions** (match on address, not symbol): Mountain Protocol's **USDM** (yield-bearing, US-Treasury backed, `0x59D9…508C`) ≠ Celo's **USDm** (cUSD, the Mento dollar). Minteo's **COPM** (`0xC92E…`) ≠ Mento's **COPm**.

---

## Infrastructure

### Oracles

| Provider | Docs |
|----------|------|
| Chainlink | https://docs.celo.org/tooling/oracles/chainlink-oracles |
| Band Protocol | https://docs.celo.org/tooling/oracles/band-protocol |
| RedStone | https://docs.celo.org/tooling/oracles/redstone |
| Supra | https://docs.celo.org/tooling/oracles/supra |
| Quex | https://docs.celo.org/tooling/oracles/quex-oracles |

### Data Indexers

| Provider | Docs |
|----------|------|
| The Graph | https://docs.celo.org/tooling/indexers/the-graph |
| Envio | https://docs.celo.org/tooling/indexers/envio |
| SubQuery | https://docs.celo.org/tooling/indexers/subquery |
| GoldRush (Covalent) | https://docs.celo.org/tooling/indexers/goldrush |
| Indexing Co | https://docs.celo.org/tooling/indexers/indexing-co |

### Bridges

| Bridge | URL | Type |
|--------|-----|------|
| Superbridge | https://superbridge.app/celo | Native L2 bridge |
| Wormhole (Portal) | https://portalbridge.com | Cross-chain |
| Axelar (Satellite) | https://satellite.money | Cross-chain |
| Chainlink CCIP (Transporter) | https://www.transporter.io | Cross-chain messaging |
| Squid Router | https://v2.app.squidrouter.com | Liquidity routing |
| Jumper Exchange | https://jumper.exchange | Cross-chain DEX |
| Hyperlane Nexus | https://www.usenexus.org | Cross-chain messaging |
| AllBridge | https://app.allbridge.io | Multi-chain |
| Layerswap | https://layerswap.io | EVM/non-EVM transfers |
| SmolRefuel | https://smolrefuel.com | Gas top-up |

Cross-chain messaging docs: https://docs.celo.org/tooling/bridges/cross-chain-messaging

### Stablecoin Orchestration & Fintech Infrastructure

B2B APIs for moving money between fiat and stablecoins on Celo. Use these when building products
that need to accept fiat deposits, pay out to bank accounts, or issue cards backed by stablecoin
balances — without holding money transmitter licenses yourself.

| Provider | Description | Docs |
| --- | --- | --- |
| Bridge (Stripe) | Stablecoin orchestration API — virtual accounts, transfers, custodial wallets, card issuing, USDB native stablecoin | <https://apidocs.bridge.xyz> |

See `stablecoin-orchestration.md` for the full Bridge integration reference.

### Wallets

| Wallet | Type | Platforms | URL |
|--------|------|-----------|-----|
| MiniPay | Non-custodial stablecoin | Android, iOS | https://www.opera.com/products/minipay |
| Valora | Non-custodial multichain | iOS, Android | https://valora.xyz |
| Celo Terminal | Desktop wallet + dApp hub | Mac, Linux, Windows | https://celoterminal.com |
| Safe Wallet | Multisig | Web | https://app.safe.global |
| MetaMask | Browser extension + mobile | All platforms | https://metamask.io |

Wallet infrastructure (WaaS): Privy, Alchemy Smart Wallets, Thirdweb, Reown, Portal, JAW, Dynamic

Wallet docs: https://docs.celo.org/tooling/wallets/index

### Block Explorers

| Explorer | URL |
|----------|-----|
| Celoscan | https://celoscan.io |
| Blockscout | https://celo.blockscout.com |

### Developer SDKs & Libraries

| Library | Docs |
|---------|------|
| Viem | https://docs.celo.org/tooling/libraries-sdks/viem/index |
| Ethers.js | https://docs.celo.org/tooling/libraries-sdks/ethers/index |
| Web3.js | https://docs.celo.org/tooling/libraries-sdks/web3/index |
| ContractKit | https://docs.celo.org/tooling/libraries-sdks/contractkit/index |
| Thirdweb SDK | https://docs.celo.org/tooling/libraries-sdks/thirdweb-sdk/index |
| Reown (WalletConnect) | https://docs.celo.org/tooling/libraries-sdks/reown/index |
| Composer Kit UI | https://docs.celo.org/tooling/libraries-sdks/composer-kit |
| Celo CLI | https://docs.celo.org/tooling/libraries-sdks/cli/index |

### Development Environments

| Tool | Docs |
|------|------|
| Foundry | https://docs.celo.org/tooling/dev-environments/foundry |
| Hardhat | https://docs.celo.org/tooling/dev-environments/hardhat |
| Remix | https://docs.celo.org/tooling/dev-environments/remix |
| Thirdweb | https://docs.celo.org/tooling/dev-environments/thirdweb/overview |

---

## MiniPay Ecosystem

MiniPay is Celo's flagship stablecoin wallet, built into Opera Mini and also available as a standalone app.

**Stats**: 16M+ wallets, 470M+ transactions, 15M+ monthly Mini App opens, 66+ countries

### Known Mini Apps

| App | Category | Description |
|-----|----------|-------------|
| BitGifty | Bill Payments | Stablecoin-powered bill payments (450K+ active users, 10+ countries) |
| Topcasters | Prediction Gaming | USDT-powered prediction market game (2.2M+ predictions, 138K+ users) |
| Mdundo | Music Streaming | Africa's top music platform, subscriptions from $0.50 |
| Gamifly | Gamified Rewards | Trivia and challenge app with stablecoin rewards |
| Kiln Earn | DeFi Yield | Earn on USDT via Aave on Celo |
| Tether Gold (XAUt) | Gold Investment | Buy/hold tokenized gold |

### Building for MiniPay

- Quickstart: https://docs.celo.org/build-on-celo/build-on-minipay/quickstart
- Code Library: https://docs.celo.org/build-on-celo/build-on-minipay/code-library
- Deeplinks: https://docs.celo.org/build-on-celo/build-on-minipay/deeplinks
- Detection: Check `window.ethereum.isMiniPay` in browser

---

## AI & Agent Infrastructure

Celo is positioning itself for AI agent use cases:

- **ERC-8004 (Agent Trust Protocol)**: Identity, Reputation, and Validation registries for AI agents
  - Docs: https://docs.celo.org/build-on-celo/build-with-ai/8004
- **x402 Protocol**: HTTP-native micropayments using stablecoins
  - Docs: https://docs.celo.org/build-on-celo/build-with-ai/x402
- **Agent Skills**: Modular capabilities for AI coding agents
  - Docs: https://docs.celo.org/build-on-celo/build-with-ai/agent-skills
- **Celo MCP Server**: Model Context Protocol for blockchain data
  - Docs: https://docs.celo.org/build-on-celo/build-with-ai/mcp/celo-mcp
- **Vibe Coding**: AI-assisted development on Celo
  - Docs: https://docs.celo.org/build-on-celo/build-with-ai/vibe-coding

---

## Notable Ecosystem Projects (2025)

| Project | Category | Launch |
|---------|----------|--------|
| Aave V3 | Lending | March 2025 |
| Uniswap V4 | DEX | October 2025 |
| Self Protocol | ZK Identity (Aadhaar support) | 2025 |
| Nightfall L3 (EY) | Privacy/ZK Layer | 2025 |
| Prosperity Pass | Savings (2.5K accounts, $150K locked) | May 2025 |
