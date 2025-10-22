// 🎃 Somnia Halloween Game - Web3 Version
console.log("Somnia Halloween Game loaded...");

let walletAddress = null;

// Connect wallet using MetaMask
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            walletAddress = accounts[0];
            document.getElementById("wallet").innerText = "Connected: " + walletAddress;
            alert("🎃 Wallet connected: " + walletAddress);
        } catch (error) {
            alert("Connection rejected!");
            console.error(error);
        }
    } else {
        alert("MetaMask not found! Please install it to play.");
    }
}

// Leaderboard (temporary local)
let leaderboard = [];

function playGame() {
    if (!walletAddress) {
        alert("Please connect your wallet first!");
        return;
    }

    const score = Math.floor(Math.random() * 100);
    leaderboard.push({ player: walletAddress, score });
    leaderboard.sort((a, b) => b.score - a.score);

    updateLeaderboard();
    alert(`👻 You scored ${score} points!`);
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
