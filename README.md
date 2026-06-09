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