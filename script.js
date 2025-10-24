// script.js
// Uses ethers v5 loaded in index.html

let provider, signer, contract;
let account = null;

// UI elements
const btnConnect = document.getElementById("btnConnect");
const btnStart = document.getElementById("btnStart");
const btnSubmit = document.getElementById("btnSubmit");
const btnLoad = document.getElementById("btnLoad");
const walletInfo = document.getElementById("walletInfo");
const boardDiv = document.getElementById("board");

/////////////////////////////////////////////////////
// --- WALLET / CHAIN Helpers -----------------------
/////////////////////////////////////////////////////

async function ensureSomniaChain() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const currentChain = await window.ethereum.request({ method: "eth_chainId" });
  if (currentChain === SOMNIA_CHAIN_ID_HEX) return true;

  // Try switching
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SOMNIA_CHAIN_ID_HEX }]
    });
    return true;
  } catch (switchErr) {
    // If the chain hasn't been added, try to add it
    if (switchErr.code === 4902 || switchErr.message?.includes("Unrecognized chain")) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: SOMNIA_CHAIN_ID_HEX,
            chainName: SOMNIA_NAME,
            rpcUrls: [SOMNIA_RPC],
            nativeCurrency: { name: "Somnia Test Token", symbol: SOMNIA_SYMBOL, decimals: 18 },
            blockExplorerUrls: [SOMNIA_EXPLORER]
          }]
        });
        return true;
      } catch (addErr) {
        console.error("Failed to add chain:", addErr);
        throw addErr;
      }
    } else {
      throw switchErr;
    }
  }
}

async function connectWallet() {
  try {
    if (!window.ethereum) { alert("Please install MetaMask"); return; }

    // ensure user on Somnia
    await ensureSomniaChain();

    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    account = await signer.getAddress();

    // Connect contract
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    walletInfo.textContent = `Wallet: ${account}`;
    btnStart.disabled = false;
    btnSubmit.disabled = false;

    console.log("Connected:", account);
    alert("✅ Wallet connected to Somnia Testnet");
  } catch (err) {
    console.error(err);
    alert("Connection failed: " + (err.message || err));
  }
}

btnConnect.addEventListener("click", connectWallet);

/////////////////////////////////////////////////////
// --- SIMPLE GAME (canvas-based) -------------------
/////////////////////////////////////////////////////

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player & game state
const PLAYER_W = 36, PLAYER_H = 36;
const ENEMY_W = 36, ENEMY_H = 36;
const BULLET_W = 8, BULLET_H = 6;

let player = { x: 40, y: canvas.height - 80, w: PLAYER_W, h: PLAYER_H };
let bullets = [];
let enemies = [];
let score = 0;
let running = false;
let lastSpawn = 0;

function spawnEnemy() {
  const y = 40 + Math.random() * (canvas.height - 120);
  enemies.push({ x: canvas.width + 40, y, w: ENEMY_W, h: ENEMY_H, vx: -2 - Math.random()*2 });
}

function update(dt) {
  bullets.forEach(b => b.x += 8);
  enemies.forEach(e => e.x += e.vx);

  // collisions
  for (let i = bullets.length - 1; i >= 0; --i) {
    for (let j = enemies.length - 1; j >= 0; --j) {
      const b = bullets[i], e = enemies[j];
      if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
        bullets.splice(i,1);
        enemies.splice(j,1);
        score += 25;
        break;
      }
    }
  }

  bullets = bullets.filter(b => b.x < canvas.width + 20);
  enemies = enemies.filter(e => e.x > -60);

  // spawn enemies periodically
  if (Date.now() - lastSpawn > 900 - Math.min(700, score*2)) {
    spawnEnemy();
    lastSpawn = Date.now();
  }
}

function draw() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // player
  ctx.fillStyle = "#ff9f1c";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // bullets
  ctx.fillStyle = "#fff047";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

  // enemies
  ctx.fillStyle = "#ff2b2b";
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h));

  // score
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Inter, Arial";
  ctx.fillText(`Score: ${score}`, 8, 18);
}

function loop() {
  if (!running) return;
  update();
  draw();
  requestAnimationFrame(loop);
}

btnStart.addEventListener("click", () => {
  if (!account) { alert("Connect wallet first"); return; }
  // reset
  score = 0;
  enemies = [];
  bullets = [];
  running = true;
  lastSpawn = Date.now();
  loop();
});

document.addEventListener("keydown", (e) => {
  if (!running) return;
  if (e.code === "ArrowUp") player.y = Math.max(8, player.y - 24);
  if (e.code === "ArrowDown") player.y = Math.min(canvas.height - player.h - 8, player.y + 24);
  if (e.code === "Space") {
    bullets.push({ x: player.x + player.w, y: player.y + player.h/2 - 4, w: BULLET_W, h: BULLET_H });
  }
});

/////////////////////////////////////////////////////
// --- INTERACTION WITH CONTRACT --------------------
/////////////////////////////////////////////////////

btnSubmit.addEventListener("click", async () => {
  if (!contract) return alert("Connect wallet first");
  const name = prompt("Player name (max 20 chars):", "Player");
  if (!name) return;
  try {
    const tx = await contract.addScore(name.slice(0,20), score);
    alert("Transaction sent. Waiting for confirmation...");
    await tx.wait();
    alert("Score saved on chain!");
    loadLeaderboard();
  } catch (err) {
    console.error(err);
    alert("Submit failed: " + (err.message || err));
  }
});

btnLoad.addEventListener("click", loadLeaderboard);

async function loadLeaderboard() {
  try {
    // use a read-only provider if no wallet connected
    const readProvider = provider ? provider : new ethers.providers.JsonRpcProvider(SOMNIA_RPC);
    const readContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, readProvider);
    const arr = await readContract.getTopPlayers();

    if (!arr || arr.length === 0) {
      boardDiv.innerHTML = "<em>No scores yet</em>";
      return;
    }

    // Build a simple list
    boardDiv.innerHTML = "";
    // sort by score desc (just in case contract returns unsorted)
    const sorted = arr.slice().sort((a,b) => Number(b.score) - Number(a.score));
    sorted.forEach((p, i) => {
      const div = document.createElement("div");
      div.style.padding = "6px 4px";
      div.style.borderBottom = "1px solid rgba(255,255,255,0.03)";
      div.innerHTML = `<strong>${i+1}. ${escapeHtml(p.name)}</strong> — ${p.score} pts <br/><small>${shortAddr(p.player)}</small>`;
      boardDiv.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    boardDiv.innerHTML = "<em>Failed to load leaderboard</em>";
  }
}

function shortAddr(a){
  if(!a) return "";
  return `${a.slice(0,6)}...${a.slice(-4)}`;
}
function escapeHtml(s){
  if(!s) return "";
  return s.replace(/[&<>"'`]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;',"`":'&#096;'})[c]);
}

/////////////////////////////////////////////////////
// Auto-load leaderboard on page open
window.addEventListener("load", () => {
  loadLeaderboard();
  // handle account/network changes
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (acc) => {
      account = acc && acc.length ? acc[0] : null;
      walletInfo.textContent = account ? `Wallet: ${account}` : "Wallet: Not connected";
      if(account) { btnStart.disabled = false; btnSubmit.disabled = false; }
    });
    window.ethereum.on("chainChanged", (chainId) => {
      // refresh (simple approach)
      setTimeout(()=> location.reload(), 300);
    });
  }
});
