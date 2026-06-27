# Development Templates for Celo

Ready-to-use configuration and code snippets for building on Celo.

> **Building a Mini App for MiniPay?**
> This file covers general Celo dev setup (Foundry, Hardhat, viem, wagmi). For a MiniPay-specific
> scaffold with detection, auto-connect, fee abstraction, and ngrok testing already wired, use:
>
> - `minipay-scaffold-from-scratch.md` — minimal Next.js + viem setup (recommended for Mini Apps)
> - `minipay-templates.md` — copy-paste code for 6 common patterns (payments, balances, deeplinks)
> - `minipay-app-fit.md` — scorecard to check if your idea is a good fit before you start building
>
> Or scaffold immediately with: `npx @celo/celo-composer@latest create -t minipay`

---

## Foundry Configuration

### `foundry.toml`

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.28"
evm_version = "cancun"

[profile.default.rpc_endpoints]
celo = "https://forno.celo.org"
celo_sepolia = "https://forno.celo-sepolia.celo-testnet.org"

[etherscan]
celo = { key = "${CELOSCAN_API_KEY}", url = "https://api.celoscan.io/api" }
celo_sepolia = { key = "${CELOSCAN_API_KEY}", url = "https://api-sepolia.celoscan.io/api" }
```

### Deploy Script

```solidity
// script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/MyContract.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MyContract myContract = new MyContract();
        console.log("Deployed at:", address(myContract));

        vm.stopBroadcast();
    }
}
```

### Deploy Commands

```bash
# Deploy to Celo Sepolia
forge script script/Deploy.s.sol --rpc-url celo_sepolia --broadcast

# Deploy to Celo Mainnet
forge script script/Deploy.s.sol --rpc-url celo --broadcast

# Verify on Celoscan
forge verify-contract <ADDRESS> MyContract \
  --chain-id 42220 \
  --etherscan-api-key $CELOSCAN_API_KEY \
  --verifier-url https://api.celoscan.io/api
```

### Fork Testing

```bash
# Run tests against Celo mainnet fork
forge test --fork-url https://forno.celo.org -vvv

# Run tests against Celo Sepolia fork
forge test --fork-url https://forno.celo-sepolia.celo-testnet.org -vvv
```

---

## Hardhat Configuration

### `hardhat.config.ts`

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun",
    },
  },
  networks: {
    celo: {
      url: "https://forno.celo.org",
      chainId: 42220,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    celoSepolia: {
      url: "https://forno.celo-sepolia.celo-testnet.org",
      chainId: 11142220,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      celo: process.env.CELOSCAN_API_KEY || "",
      celoSepolia: process.env.CELOSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io",
        },
      },
      {
        network: "celoSepolia",
        chainId: 11142220,
        urls: {
          apiURL: "https://api-sepolia.celoscan.io/api",
          browserURL: "https://sepolia.celoscan.io",
        },
      },
    ],
  },
};

export default config;
```

### Deploy & Verify

```bash
# Deploy
npx hardhat run scripts/deploy.ts --network celoSepolia

# Verify
npx hardhat verify --network celo <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

---

## Viem Client Setup

### Basic Public + Wallet Client

```typescript
import { createPublicClient, createWalletClient, http, custom } from "viem";
import { celo, celoSepolia } from "viem/chains";

// Read-only client
const publicClient = createPublicClient({
  chain: celo,
  transport: http("https://forno.celo.org"),
});

// Browser wallet client (MetaMask, MiniPay, etc.)
const walletClient = createWalletClient({
  chain: celo,
  transport: custom(window.ethereum),
});

// Server-side wallet client
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount("0x...");
const serverWalletClient = createWalletClient({
  account,
  chain: celo,
  transport: http("https://forno.celo.org"),
});
```

### Transaction with Fee Abstraction

```typescript
const txHash = await walletClient.sendTransaction({
  account: "0x...",
  to: "0x...",
  value: 0n,
  data: "0x...",
  feeCurrency: "0x765DE816845861e75A25fCA122bb6898B8B1282a", // Pay gas in USDm
});

const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
```

### Read Contract

```typescript
const balance = await publicClient.readContract({
  address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  abi: erc20Abi,
  functionName: "balanceOf",
  args: ["0xYourAddress"],
});
```

---

## Wagmi + RainbowKit Setup

### `wagmi.config.ts`

```typescript
import { http, createConfig } from "wagmi";
import { celo, celoSepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "My Celo App",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [celo, celoSepolia],
  transports: {
    [celo.id]: http("https://forno.celo.org"),
    [celoSepolia.id]: http("https://forno.celo-sepolia.celo-testnet.org"),
  },
});
```

### Provider Setup

```tsx
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { config } from "./wagmi.config";

const queryClient = new QueryClient();

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### Send Transaction with Fee Currency

```tsx
import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";

function SendCelo() {
  const { sendTransaction } = useSendTransaction();

  function handleSend() {
    sendTransaction({
      to: "0xRecipient",
      value: parseEther("0.01"),
      feeCurrency: "0x765DE816845861e75A25fCA122bb6898B8B1282a", // USDm
    });
  }

  return <button onClick={handleSend}>Send 0.01 CELO</button>;
}
```

---

## Scaffold a New Celo dApp

```bash
# Full dApp with MiniPay template
npx @celo/celo-composer@latest create -t minipay

# With Thirdweb
npx thirdweb create app --evm
```

---

## Environment Variables Template

```bash
# .env
PRIVATE_KEY=0x...                           # Deployer private key
CELOSCAN_API_KEY=...                        # From celoscan.io/myapikey
WALLETCONNECT_PROJECT_ID=...                # From cloud.walletconnect.com
CELO_RPC_URL=https://forno.celo.org         # Or your Alchemy/QuickNode URL
```
