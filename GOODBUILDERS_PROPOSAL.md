# GoodBuilders Season 4: PayForAPI Implementation Plan

## Eligibility & Fit Analysis
Yes, PayForAPI is an excellent fit for the GoodBuilders Season 4 grant. Since PayForAPI is already live on Celo, utilizes MiniPay, and handles Web3 microtransactions (x402 protocol), integrating GoodDollar (G$) is a natural and highly synergistic progression.

To qualify, we must avoid "trivial integrations" (like simply adding G$ as a payment token alongside cUSD). Instead, we must implement meaningful utility that drives G$ adoption and ecosystem growth.

## What You Need to Add (Core Integrations)
Based on the GoodBuilders Season 4 criteria, here are the three high-impact features we will add to PayForAPI to secure the grant:

### 1. "API UBI" via GoodDollar Identity SDK (Sybil Resistance)
* **The Problem:** Currently, PayForAPI uses IP-based rate limiting, which is vulnerable to VPNs and bot abuse.
* **The G$ Solution:** Integrate the GoodDollar Identity SDK to verify human users. Once verified, developers/users can claim a daily "UBI" of free API credits (e.g., free calls to the OpenAI or Weather endpoints).
* **Grant Alignment:** "Use the G$ Identity SDK in a meaningful way" and "Implement the face-verification flow with a claim button".

### 2. Activity-Based UBI Pool Contributions
* **The Problem:** The PayForAPI treasury currently takes a 10% cut in cUSD for platform sustainability, which doesn't benefit the broader Web3 ecosystem.
* **The G$ Solution:** Add G$ as a primary payment method for the x402 protocol. We will update the APIRevenueSplitter.sol smart contract so that 50% of the platform's fee on all G$ transactions is automatically routed back to the GoodDollar UBI Pool.
* **Grant Alignment:** "Contribute to the UBI Pool through activity-based fees".

### 3. Streaming API Subscriptions via G$ Supertokens
* **The Problem:** Pay-per-call (x402) is great for micro-usage, but heavy users need bulk access without signing hundreds of transactions.
* **The G$ Solution:** Implement G$ Supertokens to allow developers to open a continuous payment stream to an API Creator. As long as the G$ stream is active, the developer gets uninterrupted API access.
* **Grant Alignment:** "Leverage G$ Supertoken / streaming capabilities".

## 3-Month Implementation & Execution Plan

### Month 1: Foundation & Identity (Weeks 1-4)
**Goal:** Implement human verification and basic G$ payments.

* **Week 1:** Register on FlowState and submit the GoodBuilders Season 4 application detailing this exact roadmap.
* **Week 2:** Update the PayForAPI frontend to integrate the GoodDollar Identity SDK. Add a "Verify as Human" flow in the user dashboard.
* **Week 3:** Connect the identity verification to the APICredits.sol contract. Allow verified users to claim their daily free API credits (API UBI).
* **Week 4:** Update the ethers.js MiniPay integration to support G$ as a valid FeeCurrency for gas abstraction.

### Month 2: Smart Contracts & UBI Contribution (Weeks 5-8)
**Goal:** Route real economic value back to the GoodDollar ecosystem.

* **Week 5:** Modify the APIRevenueSplitter.sol contract to accept G$ tokens.
* **Week 6:** Implement the logic to split the 10% platform fee: 5% to the PayForAPI treasury, and 5% directly to the GoodDollar UBI Pool address.
* **Week 7:** Deploy the updated contracts to the Celo mainnet and update the Next.js x402 middleware to validate G$ payment hashes.
* **Week 8:** Launch marketing campaign: "Pay for APIs with G$ and fund Universal Basic Income."

### Month 3: Growth & G$ Streaming (Weeks 9-12)
**Goal:** Introduce advanced functionality and drive real transaction volume (crucial for the Season 4 25% Growth metrics).

* **Week 9:** Integrate the Superfluid / G$ Supertoken SDK into the frontend.
* **Week 10:** Build a "Subscription" dashboard where users can start and stop continuous G$ streams to specific API endpoints.
* **Week 11:** Update the backend middleware to continuously verify active G$ streams instead of single transaction hashes.
* **Week 12:** Prepare for Demo Day. Present on-chain metrics proving real usage (number of verified humans, amount of G$ routed to the UBI pool, active API streams).

## Next Steps for You
* **Apply Immediately:** Applications close June 30th, 2026. You should apply on FlowState as soon as possible.
* **Use this Document:** Copy the features from the "What You Need to Add" section directly into your application form when they ask how you will expand your G$ integration.
* **Focus on Growth:** Highlight that your project brings developers into the GoodDollar ecosystem, creating a B2B utility for the G$ token.
