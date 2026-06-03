# Pay For API - Hackathon Submission Details

## 🚀 Project Name
Pay For API

## 📖 Short Description
A decentralized, agentic marketplace that monetizes premium AI and Web2 API endpoints using the x402 protocol and sub-cent Celo micropayments via MiniPay.

---

## 💡 Overview
In the modern web, developers and users are forced into expensive, restrictive monthly subscriptions just to access premium AI models or data endpoints. **Pay For API** fundamentally disrupts this model. Built for the Celo Onchain Agents Hackathon, it is an autonomous ERC-8004 registered agent that acts as a decentralized API gateway. It allows users and other on-chain AI agents to purchase single API calls (like Gemini AI summaries, live Crypto prices, or Global News) instantly for fractions of a cent using Celo stablecoins. 

## ⚙️ How It Works
We completely replaced the traditional "API Key" login system with the bleeding-edge **x402 protocol** (HTTP Status 402: Payment Required). 
1. A user (or an autonomous machine) requests data from one of our endpoints.
2. Our middleware intercepts the request and demands a micro-payment (e.g., $0.005 cUSD).
3. The user pays instantly and gas-lessly using the **MiniPay** wallet integration. 
4. A custom smart contract validates the transaction hash on the Celo blockchain, unlocks the gateway, fetches the real-world/AI data, and returns the JSON payload seamlessly.

## ✨ Key Features
* **ERC-8004 Compliant Agent:** Fully registered and indexed on 8004scan.io, making our APIs discoverable and consumable by other autonomous agents on the Celo network.
* **x402 Middleware Integration:** Cryptographically enforces "Pay-Per-Call" mechanics directly at the Next.js API routing layer. 
* **Native MiniPay Support:** Abstracted wallet connections ensure Mobile-first African and global users can interact with AI APIs without needing deep Web3 knowledge.
* **Premium Hacker Terminal UI:** A stunning, immersive terminal-themed frontend that sequentially boots up the Celo network connections before launching into a glass-morphism API marketplace.
* **Dynamic Auto-resizing Layouts:** Custom Masonry grid layouts and responsive text-areas ensure the UI gracefully handles massive AI payload responses.

## 🛠 Technologies Built With
* **Blockchain:** Celo Mainnet, Solidity, Hardhat, ethers.js
* **Agent Standards:** ERC-8004 (On-chain Agent Registry), 8004scan
* **Protocols:** x402-next (Payment-gated HTTP layer)
* **Wallet:** MiniPay integration (window.ethereum auto-detection)
* **Frontend/Backend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Turbopack
* **AI & Data APIs:** Gemini 2.5 Flash (Summary/Translate), OpenWeather, NewsAPI, CoinGecko

---
---

# KarmaGap Submission Details

## Problem
Accessing premium Web2 data and advanced AI models (like Gemini or OpenAI) is currently broken. Developers and everyday users are forced to sign up for expensive monthly subscriptions, manage credit cards, and handle complex API key infrastructure just to make a few simple queries. Furthermore, as autonomous on-chain agents become more popular, there is no standardized, trustless way for these agents to pay each other for data or services without massive gas fees or central intermediaries.

## Solution
We built **Pay For API**, a decentralized agentic marketplace on the Celo network. By combining the ERC-8004 agent standard with the x402 protocol, we completely replace traditional API keys with sub-cent cryptocurrency micropayments. Users and autonomous AI agents can instantly query premium endpoints (like AI Summaries, Global News, or Live Crypto data) and pay fractions of a cent per call using stablecoins via the Celo MiniPay wallet. It makes premium data access instant, borderless, and entirely pay-as-you-go.

## Mission Summary
We are on a mission to democratize access to artificial intelligence and premium web data by building a decentralized, micro-payment-driven API economy on Celo.
