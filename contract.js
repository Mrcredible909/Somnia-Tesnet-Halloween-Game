// contract.js
// Put your contract address here (replace the placeholder)
const CONTRACT_ADDRESS = "0x327C66Fecd146CdFD18BA1da76e58eF8D09de18a";

// ABI for the HalloweenLeaderboard contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType":"string","name":"_name","type":"string"},
      {"internalType":"uint256","name":"_score","type":"uint256"}
    ],
    "name":"addScore",
    "outputs": [],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs": [],
    "name":"getTopPlayers",
    "outputs":[
      {
        "components":[
          {"internalType":"address","name":"player","type":"address"},
          {"internalType":"string","name":"name","type":"string"},
          {"internalType":"uint256","name":"score","type":"uint256"}
        ],
        "internalType":"struct HalloweenLeaderboard.Player[]",
        "name":"",
        "type":"tuple[]"
      }
    ],
    "stateMutability":"view",
    "type":"function"
  }
];

// Somnia Testnet RPC info (used when adding chain programmatically)
const SOMNIA_RPC = "https://dream-rpc.somnia.network/";
const SOMNIA_CHAIN_ID_HEX = "0xC488"; // 50312 decimal -> 0xC488 hex
const SOMNIA_NAME = "Somnia Testnet";
const SOMNIA_SYMBOL = "STT";
const SOMNIA_EXPLORER = "https://shannon-explorer.somnia.network/";
