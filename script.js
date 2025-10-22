async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const somniaChainId = "0xC509"; // 50341 dalam hex

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== somniaChainId) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: somniaChainId }],
        });
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const walletAddress = accounts[0];
      document.getElementById("wallet").innerText = `Connected wallet: ${walletAddress}`;
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet!");
    }
  } else {
    alert("MetaMask not found. Please install it first!");
  }
}

