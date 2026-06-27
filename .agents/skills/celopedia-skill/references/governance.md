# Celo Governance Reference

> Source: docs.celo.org/home/protocol/governance/*

Celo uses on-chain governance where CELO holders can propose and vote on protocol changes.

---

## Key Contracts (Mainnet)

| Contract | Address |
|----------|---------|
| Governance | `0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972` |
| LockedCelo | `0x6cC083Aed9e3ebe302A6336dBC7c921C9f03349E` |
| Election | `0x8D6677192144292870907E3Fa8A5527fE55A7ff6` |
| Validators | `0xaEb865bCa93DdC8F47b8e29F40C5399cE34d0C58` |
| EpochManager | `0xF424B5e85B290b66aC20f8A9EAB75E25a526725E` |
| EpochRewards | `0x07F007d389883622Ef8D4d347b3f78007f28d8b7` |
| GovernanceSlasher | `0xf2a347F184b0Fef572C7CBd2c392359eCcf43F3c` |
| Reserve | `0x9380fA34Fd9e4Fd14c06305fd7B6199089eD4eb9` |
| Registry | `0x000000000000000000000000000000000000ce10` |

---

## Proposal Lifecycle

1. **Propose** — Submit a governance proposal (requires locked CELO as deposit)
2. **Upvote** — Proposals need upvotes to move to the queue
3. **Approval** — Approvers (multisig) approve the proposal for referendum
4. **Referendum** — CELO holders vote (Yes/No/Abstain)
5. **Execution** — If passed, the proposal executes on-chain

### Proposal Types

- **Constitution proposals** — Change protocol parameters
- **Community proposals** — Fund community initiatives
- **Smart contract upgrades** — Update protocol contracts

---

## Voting

### With Celo Mondo (Recommended)

Celo Mondo is the simplest way to vote: https://mondo.celo.org

Docs: https://docs.celo.org/home/protocol/governance/voting-in-governance-using-mondo

### With CeloCLI

```bash
# Lock CELO for voting
celocli lockedcelo:lock --value 10000000000000000000 --from $ADDRESS

# Vote on proposal
celocli governance:vote --proposalID <ID> --value Yes --from $ADDRESS

# Check proposal status
celocli governance:show --proposalID <ID>
```

### With ContractKit

```typescript
import { newKit } from "@celo/contractkit";

const kit = newKit("https://forno.celo.org");
const governance = await kit.contracts.getGovernance();

// Get pending proposals
const dequeue = await governance.getDequeue();

// Vote
await governance.vote(proposalId, "Yes").send({ from: voterAddress });
```

---

## Security Council

The Celo L2 Security Council manages protocol upgrades and emergency fixes since the L2 transition (block 31,056,500, March 26, 2025).

- **Structure**: 2/2 Safe Multisig requiring both a cLabs Multisig (6/8 threshold) and a Community Security Council (6/8 threshold)
- **Community members**: L2Beat, Hyperlane, Valora, Mento, Nitya Subramanian, Kris Kaczor, Tim Moreton, Aaron Boyd
- **Responsibilities**: Upgrading L1 protocol contracts, modifying role designations (sequencers, proposers, challengers), executing urgent security hotfixes
- **Note**: Regular governance for Core Contracts and Community Fund remains unchanged and is separate from the Security Council
- Details: https://docs.celo.org/home/protocol/security-council

---

## Epoch Rewards (L2)

On Celo L2, epoch rewards are distributed for:
- **Validator rewards** — Block production compensation
- **Community fund** — Treasury for ecosystem development
- **Carbon offsetting** — 10% of transaction fees + 0.1% of epoch rewards go to carbon offset fund

Docs: https://docs.celo.org/home/protocol/epoch-rewards/index

---

## Governance Parameters

Common governable parameters include:
- Block gas limit
- Base fee
- Validator set size
- Epoch duration
- Reward rates
- Fee handler configuration

Full cheat sheet: https://docs.celo.org/home/protocol/governance/governable-parameters

---

## Creating a Governance Proposal

Full guide: https://docs.celo.org/home/protocol/governance/create-governance-proposal

### Using the Governance Toolkit

The Governance Toolkit provides templates for common proposal types:
https://docs.celo.org/home/protocol/governance/governance-toolkit

### Smart Contract Upgrades via Governance

Protocol contracts use transparent proxies. Upgrades require governance approval:
https://docs.celo.org/home/protocol/governance/smart-contracts-upgrades

---

## Challengers

Celo has a challenger system for disputing invalid state roots as part of the OP Stack fault proof mechanism.

Details: https://docs.celo.org/home/protocol/challengers

---

## Useful Links

| Resource | URL |
|----------|-----|
| Governance Portal (Mondo) | https://mondo.celo.org |
| Governance Forum | https://forum.celo.org |
| Active Proposals | Check via CeloCLI or Mondo |
| Governance Docs | https://docs.celo.org/home/protocol/governance/overview |
