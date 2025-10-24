let provider, signer, contract;
let score = 0;

// tombol connect wallet
const connectBtn = document.getElementById("connectBtn");
const shootBtn = document.getElementById("shootBtn");
const submitBtn = document.getElementById("submitScoreBtn");
const leaderboardList = document.getElementById("leaderboard");

// koneksi wallet
connectBtn.onclick = async () => {
  if (typeof window.ethereum === "undefined") {
    alert("Install MetaMask dulu!");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    const network = await provider.getNetwork();
    if (network.chainId !== 50312) {
      alert("Switch dulu ke Somnia Testnet (Chain ID: 50312)");
      return;
    }

    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    document.getElementById("gameArea").style.display = "block";
    alert("Wallet connected ke Somnia Testnet 🎃");
  } catch (err) {
    console.error(err);
    alert("Gagal konek ke wallet");
  }
};

// tombol shoot
shootBtn.onclick = () => {
  score += Math.floor(Math.random() * 15) + 1;
  document.getElementById("score").innerText = `Score: ${score}`;
};

// kirim skor ke kontrak
submitBtn.onclick = async () => {
  if (!contract) {
    alert("Hubungkan wallet dulu!");
    return;
  }

  const name = prompt("Masukkan nama kamu:");
  if (!name) return;

  try {
    const tx = await contract.addScore(name, score);
    await tx.wait();
    alert(`Score ${score} dikirim ke blockchain!`);
    await loadLeaderboard();
  } catch (err) {
    console.error(err);
    alert("Gagal kirim skor: " + err.message);
  }
};

// leaderboard
async function loadLeaderboard() {
  try {
    const players = await contract.getTopPlayers();
    leaderboardList.innerHTML = "";
    players.forEach((p, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${p.name} - ${p.score}`;
      leaderboardList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}
