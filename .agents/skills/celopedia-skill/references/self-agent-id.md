# Self Agent ID

> Source of truth: `https://app.ai.self.xyz/api/agent/bootstrap` returns a live OpenAPI spec of the registration-relevant endpoints. Always check it for the current contract / shape.

Self Agent ID is Self Protocol's **proof-of-human extension on top of ERC-8004**. It binds an AI agent's keypair to a real human via a zero-knowledge passport proof and mints a **soulbound ERC-721 NFT on Celo**. This is the Sybil-resistance layer some programs require (e.g. the Onchain Agents hackathon's *Verification* criterion).

| | ERC-8004 Identity Registry | Self Agent ID |
|---|---|---|
| What | Mints an agent NFT (open to anyone) | Adds a proof-of-human binding |
| Trust | None inherent | Soulbound NFT ↔ human nullifier via ZK passport |
| See | `ai-agents.md`, the `8004` skill | this file |

## Prerequisites

- **Self mobile app** with a scanned identity document. Mainnet (chain `42220`) needs a **real passport**; Celo Sepolia testnet (`11142220`) accepts mock documents in the app.
- The wallet you want as the agent identity / human owner. To link a Self Agent ID to an ERC-8004 agent, reuse the **same wallet** so the human owner matches.

## Flow

1. **`POST /api/agent/register`** → creates a session, returns `sessionToken`, `qrData`, `deepLink`, and `scanUrl`.
2. Open the `scanUrl` (QR) or `deepLink`, then **scan your passport in the Self app**. The ZK proof is generated on-device — only a proof + nullifier go on-chain.
3. **Poll `GET /api/agent/register/status`** until `stage` is `registered`.
4. (linked / wallet-free modes) **`POST /api/agent/register/export`** to export the server-generated agent private key.

### Registration modes

| Mode | `humanAddress` required? | Agent key |
|---|---|---|
| `linked` | yes | server-generated (exportable) |
| `wallet-free` | no | server-generated (exportable) |
| `ed25519` | no | bring-your-own Ed25519 (sign a challenge first) |
| `ed25519-linked` | yes | bring-your-own Ed25519 |
| `privy` / `smartwallet` | yes | provider-managed |

For `ed25519` modes, first call `POST /api/agent/register/ed25519-challenge` to get the challenge hash to sign.

## ⚠️ Gotchas

- **Status auth:** `GET /api/agent/register/status` requires `Authorization: Bearer <sessionToken>` — passing `token` as a query param returns `400` despite what the OpenAPI advertises.
- **Session TTL:** registration sessions expire in ~30 min. Poll promptly; expiry returns `410` but does **not** undo an on-chain registration that already completed — verify on-chain (or via a fresh session) rather than re-scanning.
- **`linked` creates a new agent key** bound to your `humanAddress`; it is *not* your wallet's key. If you need your existing key to be the agent, use an `ed25519` mode.

## Example

```bash
# 1. Start a session (linked mode, mainnet, your wallet as human owner)
curl -X POST https://app.ai.self.xyz/api/agent/register \
  -H "Content-Type: application/json" \
  -d '{"mode":"linked","network":"mainnet","humanAddress":"0xYourWallet"}'
# → { "sessionToken": "...", "scanUrl": "https://app.ai.self.xyz/scan/...", "deepLink": "...", ... }

# 2. Open scanUrl / deepLink and scan your passport in the Self app.

# 3. Poll until registered (NOTE the Bearer header)
curl -H "Authorization: Bearer <sessionToken>" \
  https://app.ai.self.xyz/api/agent/register/status
```

## Related
- `ai-agents.md` — ERC-8004 identity + reputation registries
- The `8004` skill — registering the ERC-8004 agent NFT with viem
