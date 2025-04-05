// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RPSGame is ReentrancyGuard {
    enum Phase { WaitingForPlayers, CommitPhase, RevealPhase, Complete }

    address public player1;
    address public player2;
    uint256 public betAmount;

    bytes32 public commit1;
    bytes32 public commit2;

    uint8 public move1;
    uint8 public move2;

    string public secret1;
    string public secret2;

    Phase public currentPhase = Phase.WaitingForPlayers;

    mapping(address => bool) public hasCommitted;
    mapping(address => bool) public hasRevealed;

    event PlayerJoined(address player);
    event MoveCommitted(address player);
    event MoveRevealed(address player, uint8 move);
    event WinnerDecided(address winner);

    modifier onlyPlayers() {
        require(msg.sender == player1 || msg.sender == player2, "Not a player");
        _;
    }

    function joinGame() external payable nonReentrant {
        require(currentPhase == Phase.WaitingForPlayers, "Game already started or finished");

        if (player1 == address(0)) {
            require(msg.value > 0, "Must send ETH to set bet");
            player1 = msg.sender;
            betAmount = msg.value;
            emit PlayerJoined(player1);
        } else if (player2 == address(0)) {
            require(msg.sender != player1, "Same player cannot join twice");
            require(msg.value == betAmount, "Bet must match Player 1");
            player2 = msg.sender;
            currentPhase = Phase.CommitPhase;
            emit PlayerJoined(player2);
        } else {
            revert("Game full");
        }
    }

    function commitMove(bytes32 hashedMove) external onlyPlayers {
        require(currentPhase == Phase.CommitPhase, "Not commit phase");
        require(!hasCommitted[msg.sender], "Already committed");

        if (msg.sender == player1) {
            commit1 = hashedMove;
        } else {
            commit2 = hashedMove;
        }

        hasCommitted[msg.sender] = true;
        emit MoveCommitted(msg.sender);

        if (hasCommitted[player1] && hasCommitted[player2]) {
            currentPhase = Phase.RevealPhase;
        }
    }

    function revealMove(uint8 move, string memory secret) external onlyPlayers {
        require(currentPhase == Phase.RevealPhase, "Not reveal phase");
        require(!hasRevealed[msg.sender], "Already revealed");
        require(move >= 1 && move <= 3, "Invalid move");

        bytes32 computedHash = keccak256(abi.encodePacked(move, secret));

        if (msg.sender == player1) {
            require(computedHash == commit1, "Hash mismatch");
            move1 = move;
            secret1 = secret;
        } else {
            require(computedHash == commit2, "Hash mismatch");
            move2 = move;
            secret2 = secret;
        }

        hasRevealed[msg.sender] = true;
        emit MoveRevealed(msg.sender, move);

        if (hasRevealed[player1] && hasRevealed[player2]) {
            decideWinner();
        }
    }

    function decideWinner() internal {
        require(currentPhase == Phase.RevealPhase, "Not reveal phase");

        currentPhase = Phase.Complete;
        address winner;

        if (move1 == move2) {
            payable(player1).transfer(betAmount);
            payable(player2).transfer(betAmount);
        } else if (
            (move1 == 1 && move2 == 3) ||
            (move1 == 2 && move2 == 1) ||
            (move1 == 3 && move2 == 2)
        ) {
            winner = player1;
        } else {
            winner = player2;
        }

        if (winner != address(0)) {
            payable(winner).transfer(address(this).balance);
            emit WinnerDecided(winner);
        }
    }

    function getPlayers() external view returns (address, address) {
        return (player1, player2);
    }
}
