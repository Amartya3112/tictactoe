const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Game state storage
const games = {};

// Generate random room code
function generateRoomCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Check for win
function checkWin(board, player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

// Check for draw
function checkDraw(board) {
  return board.every(cell => cell !== "");
}

// Get winning pattern
function getWinningPattern(board, player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    if (pattern.every(index => board[index] === player)) {
      return pattern;
    }
  }
  return null;
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Get room from URL or create new
  socket.on("join", (data) => {
    const { room } = data;

    // Create game if doesn't exist
    if (!games[room]) {
      games[room] = {
        board: ["", "", "", "", "", "", "", "", ""],
        currentPlayer: "X",
        players: [],
        gameActive: true,
        winner: null,
        scores: { X: 0, O: 0 },
        playAgainRequests: []
      };
    }

    const game = games[room];

    // Check if room is full
    if (game.players.length >= 2) {
      socket.emit("error", { message: "Room is full" });
      return;
    }

    // Join room
    socket.join(room);

    // Assign player symbol correctly based on who is already in the room
    const takenSymbols = game.players.map(p => p.symbol);
    const playerSymbol = takenSymbols.includes("X") ? "O" : "X";
    
    game.players.push({
      id: socket.id,
      symbol: playerSymbol
    });

    // Send player info
    socket.emit("playerAssigned", {
      symbol: playerSymbol,
      room: room
    });

    // Notify room
    io.to(room).emit("playerJoined", {
      playerCount: game.players.length,
      playerSymbol: playerSymbol
    });

    // If 2 players, start game
    if (game.players.length === 2) {
      io.to(room).emit("gameStart", {
        currentPlayer: game.currentPlayer,
        board: game.board,
        scores: game.scores
      });
    } else {
      socket.emit("waitingForOpponent", { board: game.board });
    }

    console.log(`Player ${playerSymbol} joined room ${room}`);
  });

  // Handle move
  socket.on("move", (data) => {
    const { room, index, player } = data;

    if (!games[room]) {
      socket.emit("error", { message: "Game not found" });
      return;
    }

    const game = games[room];

    // Validate move
    if (!game.gameActive) {
      socket.emit("error", { message: "Game is over" });
      return;
    }

    if (game.currentPlayer !== player) {
      socket.emit("error", { message: "Not your turn" });
      return;
    }

    if (game.board[index] !== "") {
      socket.emit("error", { message: "Cell already taken" });
      return;
    }

    // Make move
    game.board[index] = player;

    // Broadcast move to room
    io.to(room).emit("move", {
      index: index,
      player: player,
      board: game.board
    });

    // Check for win
    if (checkWin(game.board, player)) {
      game.gameActive = false;
      game.winner = player;
      game.scores[player]++; // maintain score on server
      io.to(room).emit("gameOver", {
        winner: player,
        board: game.board,
        winningPattern: getWinningPattern(game.board, player),
        scores: game.scores
      });
      return;
    }

    // Check for draw
    if (checkDraw(game.board)) {
      game.gameActive = false;
      io.to(room).emit("gameOver", {
        winner: "draw",
        board: game.board,
        scores: game.scores
      });
      return;
    }

    // Switch turns
    game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";
    io.to(room).emit("turnChange", {
      currentPlayer: game.currentPlayer
    });
  });

  // Handle play again request
  socket.on("playAgain", (data) => {
    const { room, player } = data;

    if (!games[room]) {
      return;
    }

    const game = games[room];

    // Ensure array exists
    if (!game.playAgainRequests) {
      game.playAgainRequests = [];
    }

    // Add player request if not already there
    if (!game.playAgainRequests.includes(player)) {
      game.playAgainRequests.push(player);
    }

    // If both players want to play again
    if (game.playAgainRequests.length === 2) {
      // Reset game state
      game.board = ["", "", "", "", "", "", "", "", ""];
      game.currentPlayer = "X";
      game.gameActive = true;
      game.winner = null;
      game.playAgainRequests = []; // Clear for next round

      // Broadcast reset to room
      io.to(room).emit("gameReset", {
        board: game.board,
        currentPlayer: game.currentPlayer,
        scores: game.scores
      });
    } else {
      // Only one player wants to play again, notify everyone
      io.to(room).emit("playAgainRequest", {
        player: player
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Find and clean up games
    for (const room in games) {
      const game = games[room];
      const playerIndex = game.players.findIndex(p => p.id === socket.id);

      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1);

        // Notify remaining player
        if (game.players.length === 1) {
          io.to(room).emit("opponentLeft");
        }

        // Delete empty games
        if (game.players.length === 0) {
          delete games[room];
          console.log(`Room ${room} deleted`);
        }

        break;
      }
    }
  });
});

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "tictactoe.html"));
});

// Generate new room
app.get("/new-room", (req, res) => {
  const room = generateRoomCode();
  res.redirect(`/?room=${room}`);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
