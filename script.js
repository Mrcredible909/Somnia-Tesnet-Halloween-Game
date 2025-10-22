// Somnia Halloween Game Script
console.log("🎃 Somnia Halloween Game Loaded!");

// Simulasi login wallet
async function connectWallet() {
    alert("🔗 Connecting to Somnia Wallet (Testnet)...");
    // Simulasi wallet address
    const walletAddress = "0x" + Math.random().toString(16).substr(2, 8);
    localStorage.setItem("wallet", walletAddress);
    document.getElementById("wallet").innerText = "Connected: " + walletAddress;
}

// Leaderboard dummy (sementara)
const leaderboard = [];

function addScore(player, score) {
    leaderboard.push({ player, score });
    leaderboard.sort((a, b) => b.score - a.score);
    updateLeaderboard();
}

function updateLeaderboard() {
    const board = document.getElementById("leaderboard");
    board.innerHTML = "";
    leaderboard.forEach((entry, index) => {
        const row = document.createElement("p");
        row.textContent = `${index + 1}. ${entry.player} — ${entry.score} pts`;
        board.appendChild(row);
    });
}

// Simulasi permainan
function playGame() {
    const wallet = localStorage.getItem("wallet");
    if (!wallet) {
        alert("Please connect your wallet first!");
        return;
    }

    const score = Math.floor(Math.random() * 100);
    addScore(wallet, score);
    alert(`👻 You scored ${score} points!`);
}
