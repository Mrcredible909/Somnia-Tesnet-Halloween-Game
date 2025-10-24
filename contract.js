const CONTRACT_ADDRESS = "0x327C66Fecd146CdFD18BA1da76e58eF8D09de18a";

const CONTRACT_ABI = 0x327C66Fecd146CdFD18BA1da76e58eF8D09de18a
  {
    "inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_score","type":"uint256"}],
    "name":"addScore","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[],"name":"getTopPlayers","outputs":[{"components":[{"internalType":"address","name":"player","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"score","type":"uint256"}],"internalType":"struct HalloweenLeaderboard.Player[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"
  }
];
