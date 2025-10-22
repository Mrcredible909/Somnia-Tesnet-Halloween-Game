const connectWalletButton = document.getElementById("connectWallet");
const gameArea = document.getElementById("gameArea");
const pumpkinContainer = document.getElementById("pumpkinContainer");
const scoreDisplay = document.getElementById("score");

let score = 0;

connectWalletButton.addEventListener("click", async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      connectWalletButton.style.display = "none";
      gameArea.style.display = "block";
      generatePumpkins();
    } catch (error) {
      alert("Wallet connection failed!");
    }
  } else {
    alert("Please install MetaMask!");
  }
});

function generatePumpkins() {
  pumpkinContainer.innerHTML = "";
  const correctIndex = Math.floor(Math.random() * 5);
  for (let i = 0; i < 5; i++) {
    const pumpkin = document.createElement("div");
    pumpkin.classList.add("pumpkin");
    pumpkin.addEventListener("click", () => {
      if (i === correctIndex) {
        score++;
        scoreDisplay.textContent = `Your score: ${score}`;
        generatePumpkins();
      } else {
        alert("Wrong pumpkin! Try again...");
      }
    });
    pumpkinContainer.appendChild(pumpkin);
  }
}
