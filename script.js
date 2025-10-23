const CONTRACT_ADDRESS = "0x9a710b33be7dEa1C0234B6F1Df33E876bae0A2FD"; // ganti dengan alamat kontrakmu
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
    "name": "getLeaderboard",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "player", "type": "address" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "uint256", "name": "score", "type": "uint256" }
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

let provider, signer, contract;
let walletAddress;
let score = 0;
let gameInterval = null;

const somniaChainId = "0xC488"; // 50312 in hex

// DOM elements
const walletEl = document.getElementById("wallet");
const gameArea = document.getElementById("gameArea");
const leaderboardEl = document.getElementById("leaderboard");

// Connect Wallet
async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask first!");
    return;
  }
  try {
    const chainId = await ethereum.request({ method: "eth_chainId" });

    if (chainId !== somniaChainId) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: somniaChainId }],
        });
      } catch (err) {
        if (err.code === 4902) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: somniaChainId,
                chainName: "Somnia Testnet",
                rpcUrls: ["https://dream-rpc.somnia.network/"],
                nativeCurrency: { name: "Somnia Token", symbol: "STT", decimals: 18 },
                blockExplorerUrls: ["https://shannon-explorer.somnia.network/"],
              },
            ],
          });
        }
      }
    }

    await ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    walletAddress = await signer.getAddress();
    walletEl.innerText = "Connected: " + walletAddress;
    document.getElementById("startBtn").disabled = false;
    document.getElementById("submitBtn").disabled = false;
  } catch (err) {
    console.error(err);
    alert("Failed to connect wallet");
  }
}

// Start Game
function startGame() {
  score = 0;
  gameArea.innerHTML = "";
  if (gameInterval) clearInterval(gameInterval);

  gameInterval = setInterval(() => spawnPumpkin(), 700);

  setTimeout(() => {
    clearInterval(gameInterval);
    alert("Game over! Your score: " + score);
  }, 10000);
}

// Spawn Pumpkin
function spawnPumpkin() {
  const pumpkin = document.createElement("div");
  pumpkin.classList.add("pumpkin");
  pumpkin.innerText = "🎃";
  pumpkin.style.left = Math.random() * (gameArea.clientWidth - 40) + "px";
  pumpkin.style.top = Math.random() * (gameArea.clientHeight - 40) + "px";
  pumpkin.onclick = () => {
    score++;
    pumpkin.remove();
  };
  gameArea.appendChild(pumpkin);
  setTimeout(() => pumpkin.remove(), 1000);
}

// Submit Score
async function submitScore() {
  const name = prompt("Enter your player name:");
  if (!name) return;
  try {
    const tx = await contract.addScore(name, score);
    await tx.wait();
    alert("Score submitted successfully!");
  } catch (err) {
    console.error(err);
    alert("Error submitting score");
  }
}

// Load Leaderboard
async function loadLeaderboard() {
  try {
    const players = await contract.getLeaderboard();
    leaderboardEl.innerHTML = "";
    players.forEach((p, i) => {
      const div = document.createElement("div");
      div.textContent = `${i + 1}. ${p.name} — ${p.score} pts`;
      leaderboardEl.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    leaderboardEl.textContent = "Failed to load leaderboard";
  }
}

// Event listeners
document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("submitBtn").addEventListener("click", submitScore);
document.getElementById("leaderboardBtn").addEventListener("click", loadLeaderboard);
