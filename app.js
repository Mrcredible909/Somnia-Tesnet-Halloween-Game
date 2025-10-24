let provider, signer, contract;
let score = 0;

// 👉 GANTI DENGAN ADDRESS KONTRAK KAMU
const CONTRACT_ADDRESS = "0x327C66Fecd146CdFD18BA1da76e58eF8D09de18a";

// 👉 GANTI DENGAN ABI DARI KONTRAK KAMU (copy dari Remix)
const CONTRACT_ABI = 0x327C66Fecd146CdFD18BA1da76e58eF8D09de18a
  {
    "inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_score","type":"uint256"}],
    "name":"addScore","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[],"name":"getTopPlayers","outputs":[{"components":[{"internalType":"address","name":"player","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"score","type":"uint256"}],"internalType":"struct HalloweenLeaderboard.Player[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"
  }
];

// 🔗 Connect Wallet
async function connectWallet() {
  if (!window.ethereum) return alert("Install MetaMask!");
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  alert("Wallet connected!");
}

document.getElementById("connectBtn").onclick = connectWallet;

// 🔫 Tembak musuh (nambah score)
document.getElementById("shootBtn").onclick = () => {
  score += Math.floor(Math.random() * 10) + 1;
  document.getElementById("score").innerText = "Score: " + score;
};

// 📤 Submit skor ke blockchain
document.getElementById("submitScoreBtn").onclick = async () => {
  if (!contract) return alert("Connect wallet first!");
  const name = prompt("Enter your player name:");
  if (!name) return;
  const tx = await contract.addScore(name, score);
  await tx.wait();
  alert("Score submitted!");
  getLeaderboard();
};

// 🏆 Ambil leaderboard
async function getLeaderboard() {
  if (!contract) return;
  const players = await contract.getTopPlayers();
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";
  players.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name}: ${p.score}`;
    list.appendChild(li);
  });
}
