# Stablecoin Orchestration on Celo

> Source: apidocs.bridge.xyz, bridge.xyz
> Last updated: 2026-05-29

B2B APIs for moving money between fiat and stablecoins on Celo. This file covers Bridge, the
primary stablecoin orchestration platform supporting Celo today.

---

## Bridge

[Bridge](https://www.bridge.xyz/) is a stablecoin orchestration platform acquired by Stripe in
2024. It exposes APIs to move money between fiat and stablecoins programmatically, with KYC/KYB,
money transmission, and banking partnerships handled by Bridge.

### What's on offer

| Product | What it does | When to use |
| --- | --- | --- |
| Transfers | One-time fiat ↔ stablecoin or stablecoin ↔ stablecoin conversions | On-demand payments, payouts |
| Static template transfers | Reusable deposit instructions that auto-create new transfers when funds arrive | Recurring deposits from the same source |
| Virtual accounts | Real bank account numbers (ACH/Wire/SEPA/SPEI/Pix/Faster Payments) for your users; deposits auto-convert to stablecoins | Fiat on-ramps with local bank details |
| Liquidation addresses | Crypto address that auto-forwards and converts to a configured destination | Off-ramps, treasury sweeping |
| Wallets | Bridge-custodied stablecoin wallets per customer | Apps that don't want to handle key management |
| Cards | Visa virtual and physical cards backed by stablecoin balances (via Stripe Issuing) | Consumer card products, expense cards |
| Issuance | Launch a branded stablecoin or hold balances in USDB (yield-bearing) | Stablecoin issuers, treasury yield |

### Celo support

Celo is a supported chain across Bridge's APIs. Specify Celo using the `payment_rail` field on
transfer, virtual account, and liquidation address requests. Confirm the current
source/destination matrix via the
[Route Explorer](https://apidocs.bridge.xyz/get-started/introduction/what-we-support/payment-routes).

Stablecoins on Celo typically supported by Bridge:

* USDT
* USDC
* USDB (Bridge's native yield-bearing stablecoin)

Always verify the current route before integrating — sending an unsupported asset/chain pair to a
Bridge deposit address can result in permanent loss.

### Supported fiat rails

| Rail | Currency | Direction |
| --- | --- | --- |
| ACH | USD | In/out |
| Wire | USD | In/out |
| SEPA Instant, SEPA Credit | EUR | In/out |
| SPEI | MXN | In/out |
| Pix | BRL | In/out |
| Faster Payments | GBP | In/out |
| Bre-B, Bank Transfer PSE/ACH | COP | Beta |

### Critical caveats

* **EEA restriction**: USDT and Bridge-issued stablecoins (including USDB) are **not available to
  users in the EEA** due to MiCA-related restrictions. Use USDC for EU consumer flows.
* **Transaction minimums** are enforced per route. Check
  <https://apidocs.bridge.xyz/platform/orchestration/fees-and-mins/mins> before quoting.
* **Customer onboarding required**: every paying user must complete Bridge's KYC/KYB flow via a
  KYC link or hosted flow.
* **Idempotency keys** are required on most mutating endpoints. Generate a UUID per request.

### Minimal end-to-end flow (USD → USDT on Celo)

```bash
# 1. Onboard a customer with a KYC link
curl -X POST https://api.bridge.xyz/v0/kyc_links \
  -H "Api-Key: $BRIDGE_API_KEY" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Ada Lovelace",
    "email": "ada@example.com",
    "type": "individual"
  }'

# 2. Create a USD virtual account for that customer, destination = Celo USDT
curl -X POST https://api.bridge.xyz/v0/customers/<customer_id>/virtual_accounts \
  -H "Api-Key: $BRIDGE_API_KEY" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{
    "source": { "currency": "usd" },
    "destination": {
      "payment_rail": "celo",
      "currency": "usdt",
      "address": "0xYourCeloAddress"
    },
    "developer_fee_percent": "1.0"
  }'

# 3. Share the source_deposit_instructions with the user
# When they wire USD in, Bridge converts and sends USDT to the Celo address
```

For the inverse direction (USDT on Celo → fiat), use the Transfers endpoint with an external
account as the destination.

### When Bridge is the right tool

* You need to issue fiat bank accounts to users in multiple countries
* You need to send fiat payouts at scale (payroll, supplier payments, creator payouts, remittances)
* You need to ship a card product backed by stablecoins
* You want to remain unregulated as a money transmitter

### When it isn't

* You only need a one-time consumer on-ramp — use a widget like Banxa, Transak, or MoonPay
  (see `ecosystem.md` Ramps and `home/ramps` in docs.celo.org)
* You're moving funds between users entirely on-chain — use the Celo SDKs directly
* You serve only EEA consumers and need USDT specifically — Bridge can't serve that route

### Useful Bridge endpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /v0/kyc_links` | Onboard a customer with hosted KYC |
| `POST /v0/customers/<id>/virtual_accounts` | Issue a fiat deposit account |
| `POST /v0/customers/<id>/external_accounts` | Register a payout bank account |
| `POST /v0/transfers` | Move money fiat ↔ stablecoin or stablecoin ↔ stablecoin |
| `POST /v0/customers/<id>/liquidation_addresses` | Auto-forward incoming crypto to a destination |
| `POST /v0/customers/<id>/wallets` | Create a Bridge-custodied wallet |

### Authentication & sandbox

* Base URL (production): `https://api.bridge.xyz/v0/`
* Sandbox is available with separate API keys and a `simulate KYC approval` endpoint
* All requests require `Api-Key` header; mutating requests also require `Idempotency-Key`

### Webhooks

Bridge sends webhooks for transfer state changes, KYC status updates, virtual account activity,
and card events. Signature verification is supported via HMAC-SHA256. See
<https://apidocs.bridge.xyz/platform/additional-information/webhooks/overview>.

### Celo-specific integration tips

1. **Pair Bridge with fee abstraction.** If you're paying users in USDT on Celo, they can also
   *pay gas* in USDT via Celo's fee abstraction. The combination = a fully USD-denominated UX with
   no native gas friction. See `builder-guide.md` for fee abstraction patterns.
2. **Treasury yield.** Hold operational stablecoin reserves in USDB rather than USDT/USDC to earn
   automatic on-chain yield with no claim or stake step.

### Related skills and references

* `ecosystem.md` — broader Celo ecosystem directory including consumer ramps
* `builder-guide.md` — Celo-specific dev patterns including fee abstraction

### Pricing

Bridge pricing depends on volume and product mix. See
<https://apidocs.bridge.xyz/platform/additional-information/pricing> or contact
sales@bridge.xyz for current rates. Developer fees can be added on top of Bridge fees and routed
to a developer-controlled external account.
