let provider, signer, contract;
let score = 0;

const CONTRACT_ADDRESS = "0x327C66Fecd146CdFD18BA1da76e58eF8D09de18a"; // Ganti dengan kontrakmu
const CONTRACT_ABI = [
  {
    "inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_score","type":"uint256"}],
    "name":"addScore","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[],"name":"getTopPlayers","outputs":[{"components":[{"internalType":"address","name":"player","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"score","type":"uint256"}],"internalType":"struct HalloweenLeaderboard.Player[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"
  }
];

// 🦊 Connect Wallet
async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    alert("Wallet connected successfully!");
  } catch (err) {
    console.error("Connection failed:", err);
    alert("Connection failed: " + err.message);
  }
}

document.getElementById("connectBtn").onclick = connectWallet;

// 🔫 Shoot button
document.getElementById("shootBtn").onclick = () => {
  score += Math.floor(Math.random() * 10) + 1;
  document.getElementById("score").innerText = "Score: " + score;
};

// 📤 Submit Score
document.getElementById("submitScoreBtn").onclick = async () => {
  if (!contract) {
    alert("Please connect your wallet first!");
    return;
  }

  const name = prompt("Enter your player name:");
  if (!name) return;

  try {
    const tx = await contract.addScore(name, score);
    await tx.wait();
    alert("Score submitted successfully!");
    getLeaderboard();
  } catch (err) {
    alert("Transaction failed: " + err.message);
  }
};

// 🏆 Load leaderboard
async function getLeaderboard() {
  if (!contract) return;
  try {
    const players = await contract.getTopPlayers();
    const list = document.getElementById("leaderboard");
    list.innerHTML = "";
    players.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.name}: ${p.score}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}
