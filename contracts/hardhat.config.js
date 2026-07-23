require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../.env.local" });

const CELO_MAINNET_CHAIN_ID = 42220;

/** @type import('hardhat/config').HardhatUserConfig Configuration for Celo Mainnet and Alfajores deployments */
module.exports = {
  solidity: "0.8.20",
  networks: {
    celo: {
      url: "https://forno.celo.org",
      chainId: CELO_MAINNET_CHAIN_ID,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      chainId: 44787,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};
