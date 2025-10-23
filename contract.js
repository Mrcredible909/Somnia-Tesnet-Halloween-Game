const CONTRACT_ADDRESS = "0x327C686Fec6146CdFD18BAlD76e58eF8D09de18a"; // ganti sesuai alamatmu

const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "uint256", "name": "_score", "type": "uint256" }
    ],
    "name": "addScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTopPlayers",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "player", "type": "address" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "uint256", "name": "score", "type": "uint256" }
        ],
        "internalType": "struct HalloweenLeaderboard.Player[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
