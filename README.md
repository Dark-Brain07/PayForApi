# Pay For API 🚀

> Pay-per-call AI APIs using Celo stablecoins. No subscriptions. No credit cards. Just pay what you use.

[![MiniPay](https://img.shields.io/badge/MiniPay-Compatible-brightgreen.svg)](https://docs.celo.org/developer/build-on-minipay/overview)
[![Celo](https://img.shields.io/badge/Celo-Mainnet-yellow.svg)](https://celo.org)
[![x402](https://img.shields.io/badge/x402-Enabled-blue.svg)](https://x402.org)
[![GitHub stars](https://img.shields.io/github/stars/Dark-Brain07/pay-for-api?style=social)](https://github.com/Dark-Brain07/pay-for-api)

## 🌍 Supported Stablecoins

| Token | Currency | Price Per Call |
|---|---|---|
| cUSD 🇺🇸 | US Dollar | $0.001 |
| cEUR 🇪🇺 | Euro | €0.001 |
| cKES 🇰🇪 | Kenyan Shilling | KES 0.13 |
| cBRL 🇧🇷 | Brazilian Real | R$0.005 |
| cGHS 🇬🇭 | Ghana Cedi | GHS 0.01 |
| cCOP 🇨🇴 | Colombian Peso | COP 4.00 |
| PUSO 🇵🇭 | Philippine Peso | ₱0.056 |

## 🤖 Available APIs

| API | Endpoint | Price |
|---|---|---|
| Weather Info | /api/weather | 0.001 cUSD |
| Global News | /api/news | 0.002 cUSD |
| Crypto Pulse | /api/crypto | 0.001 cUSD |
| AI Summary | /api/summary | 0.005 cUSD |
| AI Translate | /api/translate | 0.003 cUSD |

## 📱 MiniPay Integration

- Auto-detects `window.ethereum.isMiniPay`
- Auto-connects wallet — no popups
- Uses cUSD as feeCurrency for all transactions
- Discovery manifest: `/.well-known/minipay.json`
- Hook: `hooks/useMiniPay.ts`



## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in your API keys and contract addresses
npm run dev
```

## 📋 Celo Onchain Agents Hackathon

Built for the Celo Onchain Agents Hackathon (May 22 - June 15, 2026)

- Track 1: Best Agent on Celo
- Track 2: Most Onchain Activity  
- Track 3: Highest 8004scan Rank


## 🛠️ Developer SDK (`@pay-for-api/sdk`)

The Developer SDK allows autonomous agents to seamlessly interact with x402 endpoints.
By providing an EVM-compatible private key, the SDK automatically handles `402 Payment Required` interception.

### Installation
```bash
npm install @pay-for-api/sdk
```

### Usage Example
```typescript
import { PayForApiClient } from '@pay-for-api/sdk';

const client = new PayForApiClient({
  privateKey: process.env.CELO_PRIVATE_KEY
});

// The fetch call automatically handles x402 invoice settlement in the background
const response = await client.fetch('https://pay-for-api.com/api/weather');
const data = await response.json();
```

## 📈 Creator Dashboard (List Your Own API)

Pay For API is not just a consumer platform; it is a two-sided marketplace.
Developers can register their own Web2 or Web3 endpoints via our Creator Dashboard.

### How it Works:
1. **Register**: Submit your endpoint URL and desired cUSD price per call.
2. **Wrap**: Our platform provides a reverse-proxy x402 wrapper.
3. **Earn**: Every successful call routes payment directly to your Celo wallet.

### Smart Contract Revenue Split
Earnings are managed by the `APIRevenueSplitter.sol` contract.
- **90%** routes to the API Creator instantly.
- **10%** routes to the Pay For API Treasury to sustain infrastructure.

## 📚 Comprehensive Developer Guide

Welcome to the deep-dive documentation for Pay For API.

### 1. Architecture Overview

The platform follows a highly modular architecture separating the frontend, backend middleware, and Celo smart contracts.

#### 1.1 Frontend Stack

Built with Next.js 15 App Router, React 19, and Tailwind CSS v4 for a highly responsive, glass-morphic UI.

#### 1.2 Wallet & Provider Integration

We utilize ethers.js v6 for provider interactions, specifically auto-detecting the MiniPay injected provider via window.ethereum.isMiniPay.

#### 1.3 Smart Contracts

All smart contracts are written in Solidity 0.8.24 and compiled using Hardhat. They handle API revenue splits and APIC token logic.

#### 1.4 x402 Middleware

Our Next.js API routes are protected by custom x402 middleware that intercepts requests and validates on-chain payment hashes.

### 2. Environment Setup & Configuration

Before running the project locally, you must configure a series of environment variables.

- NEXT_PUBLIC_RPC_URL: The Celo Mainnet RPC URL used for public data reading.

- PRIVATE_KEY: The deployer's private key used for smart contract deployments and backend admin transactions.

- OPENAI_API_KEY: Required for the Premium AI Chat endpoint.

- GEMINI_API_KEY: Required for the AI Summary and AI Translate endpoints.

- WEATHER_API_KEY: Sourced from OpenWeatherMap for real-time meteorological data.

- NEWS_API_KEY: Used to fetch global news headlines for the News API endpoint.

### 3. Smart Contract Deployment Guide

To deploy the contracts to the Celo network, ensure your wallet is funded with CELO for gas.

#### 3.1 APICredits.sol

This contract implements the ERC20 standard with additional minting logic for daily rewards and streaks.

#### 3.2 APIRevenueSplitter.sol

Handles the 90/10 split between API creators and the platform treasury.

Run the deployment script using Hardhat:
`ash
npx hardhat run scripts/deploy.ts --network celo
`

#### 3.3 Contract Verification

Verify your deployed contracts on CeloScan using the @nomicfoundation/hardhat-verify plugin.

`ash
npx hardhat verify --network celo <DEPLOYED_CONTRACT_ADDRESS>
`

### 4. API Endpoint Reference

Detailed specifications for each premium endpoint offered on the marketplace.

#### 4.1 POST /api/chat

Accepts a user message and returns an AI-generated response. Requires a 	xHash proving a 0.005 cUSD payment.

#### 4.2 GET /api/weather

Requires a lat and lon query parameter. Returns current weather data. Price: 0.001 cUSD.

#### 4.3 GET /api/news

Returns the top 10 global news headlines. Price: 0.002 cUSD.

#### 4.4 GET /api/crypto

Fetches live prices for major cryptocurrencies including BTC, ETH, and CELO. Price: 0.001 cUSD.

#### 4.5 POST /api/summary

Accepts a long text payload and returns a concise AI-generated summary. Price: 0.005 cUSD.

#### 4.6 POST /api/translate

Accepts text and a target language code. Returns translated text. Price: 0.003 cUSD.

### 5. x402 Protocol Deep Dive

The x402 protocol is the backbone of Pay For API's monetization strategy.

#### 5.1 HTTP 402 Payment Required

When a client accesses a premium endpoint without a valid payment, the server returns an HTTP 402 status code.

#### 5.2 Invoice Generation

Along with the 402 status, the server provides an invoice containing the required token address, amount, and recipient.

#### 5.3 Payment Settlement

The client's wallet processes the payment on the Celo network and obtains a transaction hash.

#### 5.4 Transaction Validation

The client retries the request, including the transaction hash in the X-Payment-Hash header. The server verifies this hash on-chain before serving the data.

### 6. MiniPay Integration Guide

MiniPay is an ultra-lightweight wallet built into the Opera Mini browser, designed for users in emerging markets.

#### 6.1 Auto-Detection

Our platform uses window.ethereum.isMiniPay to seamlessly detect the wallet and bypass standard connection modals.

#### 6.2 Gas Abstraction (FeeCurrency)

All transactions are formatted to use cUSD as the eeCurrency, ensuring users don't need native CELO to pay for gas.

#### 6.3 Transaction Formatting

MiniPay strictly requires Legacy (Type 0) or EIP-1559 (Type 2) transactions. We ensure all ethers.js transactions are correctly populated.

### 7. Security Best Practices

Maintaining the integrity of the marketplace and protecting user funds is paramount.

#### 7.1 Rate Limiting

All API endpoints are protected by IP-based rate limiting to prevent abuse and DDoS attacks.

#### 7.2 Double-Spend Prevention

The backend maintains a registry of processed transaction hashes to ensure a single payment cannot be used multiple times.

#### 7.3 Input Sanitization

All user inputs, especially for AI prompts and database queries, are strictly sanitized to prevent injection attacks.

#### 7.4 Smart Contract Audits

The APICredits and APIRevenueSplitter contracts have undergone internal review, though external audits are recommended before high-volume mainnet usage.

### 8. Creator Dashboard Overview

The Creator Dashboard empowers developers to monetize their own endpoints on our platform.

#### 8.1 Endpoint Registration

Creators provide their endpoint URL, metadata, and set a custom cUSD price.

#### 8.2 Gateway Routing

Pay For API acts as a reverse proxy, enforcing x402 payments before routing the request to the creator's server.

#### 8.3 Analytics & Earnings

Creators can track their total calls, revenue generated, and withdraw their 90% share directly to their Celo wallet.

### 9. Future Roadmap

We are constantly iterating and expanding the capabilities of Pay For API.