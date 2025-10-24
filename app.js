let provider, signer, contract;
let score = 0;

// 🧠 Connect Wallet
document.getElementById("connectBtn").onclick = async () => {
  if (!window.ethereum) {
    alert("Install MetaMask dulu!");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  const network = await provider.getNetwork();
  if (network.chainId !== 50312) {
    alert("Please switch to Somnia Testnet (Chain ID 50312)");
    return;
  }

  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  document.getElementById("gameArea").style.display = "block";
  alert("Wallet connected to Somnia Testnet 🎃");
};

// 🔫 Game Logic
document.getElementById("shootBtn").onclick = () => {
  const damage = Math.floor(Math.random() * 15) + 1;
  score += damage;
  document.getElementById("score").innerText = `Score: ${score}`;
};

// 🎯 Submit Score
document.getElementById("submitScoreBtn").onclick = async () => {
  if (!contract) {
    alert("Connect wallet dulu!");
    return;
  }

  const name = prompt("Masukkan nama pemain:");
  if (!name) return;

  try {
    const tx = await contract.addScore(name, score);
    await tx.wait();
    alert("Score submitted ke blockchain!");
    getLeaderboard();
  } catch (err) {
    alert("Gagal kirim score: " + err.message);
  }
};

// 🏆 Get Leaderboard
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
