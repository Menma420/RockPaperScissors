import { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import contractABI from "./contractABI.json";

const contractAddress = "0x0e50d781af56fc299bA2b4a5D24dCfb2ba60ca2D";

export default function Game() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [betAmount, setBetAmount] = useState(null);
  const [gameStatus, setGameStatus] = useState("🔄 Loading...");

  useEffect(() => {
    if (window.ethereum) {
      const p = new BrowserProvider(window.ethereum);
      setProvider(p);
    } else {
      setGameStatus("⚠️ Install Metamask!");
    }
  }, []);

  useEffect(() => {
    const setup = async () => {
      if (!provider) return;
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);

      setAccount(accounts[0]);
      setContract(contract);
    };
    setup();
  }, [provider]);

  useEffect(() => {
    const fetch = async () => {
      if (!contract) return;
      const [p1, p2] = await contract.getPlayers();
      const bet = await contract.betAmount();
      setPlayer1(p1);
      setPlayer2(p2);
      setBetAmount(ethers.formatEther(bet));
    };

    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, [contract]);

  async function joinGame() {
    if (!contract || !account) return alert("⚠️ Connect to wallet first!");
  
    try {
      const p1 = await contract.player1();
      const p2 = await contract.player2();
      let value = "0";
  
      // PLAYER 1 joining
      if (p1 === ethers.ZeroAddress) {
        const input = prompt("🎮 You're the first player! Enter your bet amount (ETH):");
        if (!input || isNaN(parseFloat(input)) || parseFloat(input) <= 0) {
          return alert("❌ Invalid bet amount.");
        }
        value = input;
  
      // PLAYER 2 joining
      } else if (p2 === ethers.ZeroAddress && account.toLowerCase() !== p1.toLowerCase()) {
        const onChainBet = await contract.betAmount();
        value = ethers.formatEther(onChainBet); // match Player 1's bet
  
      } else {
        return alert("⚠️ Game already full or you're already in.");
      }
  
      const tx = await contract.joinGame({
        value: ethers.parseEther(value),
      });
      await tx.wait();
      setGameStatus("✅ Successfully joined the game!");
    } catch (error) {
      const message =
        error?.reason || error?.data?.message || error?.message || "Unknown error";
      console.error("Join game failed:", error);
      setGameStatus(`❌ Transaction failed: ${message}`);
    }
  }

  

  async function commitMove() {
    const move = prompt("Enter your move (1=Rock, 2=Paper, 3=Scissors):");
    const secret = prompt("Enter a secret:");
    const hash = ethers.keccak256(ethers.toUtf8Bytes(move + secret));

    const tx = await contract.commitMove(hash);
    await tx.wait();
    setGameStatus("✅ Move committed");
  }

  async function revealMove() {
    const move = prompt("Reveal your move (1=Rock, 2=Paper, 3=Scissors):");
    const secret = prompt("Enter the same secret:");
    const tx = await contract.revealMove(parseInt(move), secret);
    await tx.wait();
    setGameStatus("✅ Move revealed");
  }

  return (
    <div>
      <h1>🪨 📄 ✂️ Rock Paper Scissors</h1>
      <p>Wallet: {account}</p>
      <p>Status: {gameStatus}</p>
      <p>Player 1: {player1}</p>
      <p>Player 2: {player2}</p>
      <p>Bet: {betAmount} ETH</p>

      <button onClick={joinGame}>Join Game</button>
      <button onClick={commitMove}>Commit Move</button>
      <button onClick={revealMove}>Reveal Move</button>
    </div>
  );
}
