# Pay For API 🚀

> Pay-per-call AI APIs using Celo stablecoins. No subscriptions. No credit cards. Just pay what you use.

[![MiniPay](https://img.shields.io/badge/MiniPay-Compatible-brightgreen.svg)](https://docs.celo.org/developer/build-on-minipay/overview)
[![Celo](https://img.shields.io/badge/Celo-Mainnet-yellow.svg)](https://celo.org)
[![x402](https://img.shields.io/badge/x402-Enabled-blue.svg)](https://x402.org)

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
