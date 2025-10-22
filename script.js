const CONTRACT_ADDRESS = "0x3294F61bD0B422EFAabB1a00A9d2857FFa409919";
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string","name": "_name","type": "string"},
               {"internalType": "uint256","name": "_score","type": "uint256"}],
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
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "uint256", "name": "score", "type": "uint256"}
        ],
        "internalType": "struct Leaderboard.Player[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let contract;
let walletAddress;

async function connectWallet() {
  if (window.ethereum) {
    try {
      const somniaChainId = "0xC509"; // 50341 in hex
      const chainId = await ethereum.request({ method: "eth_chainId" });

      if (chainId !== somniaChainId) {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: somniaChainId }],
        });
      }

      await ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      walletAddress = await signer.getAddress();
      document.getElementById("wallet").innerText = `Connected: ${walletAddress}`;

      alert("Wallet connected to Somnia Shannon Testnet!");
    } catch (error) {
      console.error(error);
      alert("Connection failed!");
    }
  } else {
    alert("MetaMask not found. Please install it first!");
  }
}

async function addScore() {
  const name = prompt("Enter your name:");
  const score = Math.floor(Math.random() * 1000); // random score
  try {
    const tx = await contract.addScore(name, score);
    await tx.wait();
    alert(`Score ${score} added for ${name}!`);
    loadLeaderboard();
  } catch (err) {
    console.error(err);
    alert("Error adding score!");
  }
}

async function loadLeaderboard() {
  try {
    const players = await contract.getTopPlayers();
    const leaderboardDiv = document.getElementById("leaderboard");
    leaderboardDiv.innerHTML = "<h3>🏆 Leaderboard 🏆</h3>";

    players.forEach((p, i) => {
      leaderboardDiv.innerHTML += `<p>${i + 1}. ${p.name} — ${p.score}</p>`;
    });
  } catch (err) {
    console.error(err);
  }
}


