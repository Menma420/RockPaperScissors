# ✊ ✋ ✌️ Rock-Paper-Scissors Ethereum DApp

This is a fully on-chain 2-player Rock-Paper-Scissors game built using React and Solidity, where players can wager ETH and compete in a fair, verifiable manner via smart contracts.

---

## 🚀 Features

- 🔗 Connect via MetaMask
- 🎮 Join game as Player 1 or Player 2
- 💰 Dynamic bet amount (set in the smart contract)
- ⚔️ Make moves: Rock, Paper, or Scissors
- 🧠 Winner logic handled on-chain
- ⛓️ Built with Ethers.js, Solidity, and React

---

## 🧱 Smart Contract Details

- **Players**: 2 per round (`player1`, `player2`)
- **Bet Amount**: Fetched dynamically from the contract via `betAmount()`
- **Moves**: Represented as numbers — `1 = Rock`, `2 = Paper`, `3 = Scissors`
- **Winner Logic**: Determined by the contract once both players have made their moves
- **Payouts**: Winner takes the entire pool; in case of a draw, bets are refunded

---

## 🛠️ Technologies Used

- **Frontend**: React, Ethers.js
- **Blockchain**: Solidity Smart Contract on Ethereum-compatible network
- **Wallet**: MetaMask

---

## 🧪 Local Setup

1. **Clone the repo**

```bash
git clone https://github.com/yourusername/rock-paper-scissors-dapp.git
cd rock-paper-scissors-dapp
```

2. **Install dependencies**

```bash
npm install
```

3. **Add contract details**

Make sure the following are correct in your code:
- `contractAddress` — Your deployed contract address
- `contractABI.json` — ABI file exported from Remix or Hardhat

4. **Run the app**

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 📸 Screenshots

> Add screenshots of the UI with wallet connected, game status, and move buttons

---

## 📄 Contract Deployment

Deploy the smart contract using Remix or Hardhat and update your frontend with:
- ✅ ABI (`contractABI.json`)
- ✅ Address (`contractAddress` in React app)

---

## ❗ Warnings

- This is a basic demo for learning. **Do not use in production with real funds** without security audits.
- Frontend assumes only one game instance at a time — further logic needed for concurrent games.

---

## 🧠 License

MIT License — feel free to use, modify, or fork for your own learning.

---

## 👨‍💻 Author

Built by Uttkarsh Malviya — feel free to connect and drop a ⭐ on GitHub!
```

---

Let me know if you'd like a version with deploy instructions (Remix or Hardhat), environment setup, or if you're uploading the ABI from Hardhat.
