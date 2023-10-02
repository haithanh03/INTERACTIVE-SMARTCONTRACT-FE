require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const JSON_RPC = "https://rpc-mumbai.maticvigil.com"
const PRIVATE_KEY = "76b85b0fbb09456e5be0607dc4eb02f7183e9989bfe14203d62c9c52e3a4938b"
const API_KEY = "CR85Z4ADNSQM9574QTYCP6RHV23J9ABAZT"
module.exports = {
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: JSON_RPC,
      accounts: [PRIVATE_KEY],
    },
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: API_KEY,
  },

};