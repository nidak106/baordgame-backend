const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Initial game state
let game = {
  playerPositions: [1, 1],
  turn: 0,
  dice: null,
  winner: null
};

const snakes = {
  16: 5,
  57: 22,
  86: 66,
  98: 27,
  92: 71
};

const ladders = {
  13: 49,
  42: 79,
  52: 71
};

// Get current game state
app.get('/api/game', (req, res) => {
  res.json(game);
});

// Roll dice and update state
app.post('/api/roll', (req, res) => {
  if (game.winner) return res.json(game);

  const roll = Math.floor(Math.random() * 6) + 1;
  let positions = [...game.playerPositions];
  let turn = game.turn;
  let nextPos = positions[turn] + roll;

  if (nextPos <= 100) {
    positions[turn] = nextPos;
    const snakeTarget = snakes[nextPos];
    const ladderTarget = ladders[nextPos];
    if (snakeTarget || ladderTarget) {
      positions[turn] = snakeTarget || ladderTarget;
    }
  }

  let winner = null;
  if (positions[0] === 100) winner = "Nida Wins 🎉";
  if (positions[1] === 100) winner = "Ivan Wins 🎉";

  game = {
    playerPositions: positions,
    turn: turn === 0 ? 1 : 0,
    dice: roll,
    winner
  };

  res.json(game);
});

// Reset game
app.post('/api/reset', (req, res) => {
  game = {
    playerPositions: [1, 1],
    turn: 0,
    dice: null,
    winner: null
  };
  res.json(game);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));