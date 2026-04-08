require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

//cors
app.use(cors());
app.use(express.json());

// socket io
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});



// Core Data
const players = {};
const waitingPlayers = new Set();
const rooms = {};

function checkBoard(board,id) {
    return true
}

// Socket Logic
io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    socket.on("nickname", (name) => {
        players[socket.id] = { name, matched: false };
        waitingPlayers.add(socket.id);
    });

    // Matchmaking
    socket.on("find_match", () => {
        const currentPlayer = players[socket.id];
        if (!currentPlayer || currentPlayer.matched) return;

        // console.log("Finding match for:", currentPlayer.name);

        waitingPlayers.delete(socket.id);

        let matchPlayer = null;

        for (let id of waitingPlayers) {
            if (id !== socket.id) {
                matchPlayer = id;
                break;
            }
        }

        if (matchPlayer) {
            waitingPlayers.delete(matchPlayer);

            const player1 = socket.id;
            const player2 = matchPlayer;

            if (players[player1].matched || players[player2].matched) return;

            const ids = [player1, player2].sort();
            const roomId = `${ids[0]}-${ids[1]}`;

            players[player1].matched = true;
            players[player2].matched = true;

            const match = {
                player1: {
                    name: players[player1].name,
                    socketId: player1,
                    symbol: "X",
                },
                player2: {
                    name: players[player2].name,
                    socketId: player2,
                    symbol: "O",
                },
                roomId,
            };

            rooms[roomId] = match;

            socket.join(roomId);
            io.sockets.sockets.get(player2)?.join(roomId);

            socket.emit("match_found", match);
            io.to(player2).emit("match_found", match);
            io.to(roomId).emit("room_joined", match);

            // console.log("Match found:", match);
        } else {
            waitingPlayers.add(socket.id);
        }
    });

    // Handle move
    socket.on("move", (data) => {
        const { roomId , board } = data;
        const match = rooms[roomId];
        if (!match) return;
    
        checkBoard(board, socket.id);
        socket.to(roomId).emit("opponent_move", data);
    });

    // Disconnect
    socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.id);

        waitingPlayers.delete(socket.id);

        const player = players[socket.id];

        if (player?.matched) {
            for (let roomId in rooms) {
                const match = rooms[roomId];

                if (
                    match.player1.socketId === socket.id ||
                    match.player2.socketId === socket.id
                ) {
                    socket.to(roomId).emit("opponent_left");
                    delete rooms[roomId];
                }
            }
        }

        delete players[socket.id];
    });
});

app.get('/leaderboard', (req, res) => {
    res.json({ results: rooms });
});

app.get('/health', (req, res) => {
    res.json({ condition: 'good' });
});

// running server
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});