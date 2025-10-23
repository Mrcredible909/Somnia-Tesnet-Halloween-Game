let provider, signer, contract;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: 300, score: 0 };
let bullets = [];
let enemies = [];

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 400);

  ctx.fillStyle = "orange";
  ctx.fillRect(player.x, player.y, 40, 40);

  ctx.fillStyle = "red";
  for (let e of enemies) ctx.fillRect(e.x, e.y, 40, 40);

  ctx.fillStyle = "yellow";
  for (let b of bullets) ctx.fillRect(b.x, b.y, 10, 5);

  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${player.score}`, 10, 20);
}

function update() {
  bullets.forEach(b => b.x += 5);
  enemies.forEach(e => e.x -= 2);

  bullets.forEach(b => {
    enemies.forEach((e, i) => {
      if (b.x < e.x + 40 && b.x + 10 > e.x && b.y < e.y + 40 && b.y + 5 > e.y) {
        enemies.splice(i, 1);
        player.score += 10;
      }
    });
  });

  enemies = enemies.filter(e => e.x > -50);
  bullets = bullets.filter(b => b.x < 800);

  if (Math.random() < 0.02) enemies.push({ x: 800, y: Math.random() * 300 + 50 });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();

document.addEventListener("keydown", (e) => {
  if (e.key === " ") bullets.push({ x: player.x + 40, y: player.y + 20 });
});

document.getElementById("connectBtn").onclick = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    alert("✅ Connected to Somnia wallet!");
  }
};

async function submitScore() {
  if (!contract) return alert("Connect wallet first!");
  const name = prompt("Enter your player name:");
  const tx = await contract.addScore(name, player.score);
  await tx.wait();
  alert("🎯 Score submitted!");
  loadLeaderboard();
}

async function loadLeaderboard() {
  const players = await contract.getTopPlayers();
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";
  players.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} - ${p.score} pts`;
    list.appendChild(li);
  });
}

// tekan Enter untuk kirim skor ke blockchain
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitScore();
});
