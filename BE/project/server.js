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

// Core Logic

const players = {};
const waitingPlayers = new Set();
const matches = [];

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("nickname", (name) => {
        players[socket.id] = { name };
        waitingPlayers.add(socket.id);
    });

    socket.on("find_match", () => {
        console.log("Finding match for:", players[socket.id]);

        // remove self from queue before matching
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

            const match = {
                player1: players[socket.id],
                player2: players[matchPlayer],
                roomId: `${socket.id}-${matchPlayer}`,
            };

            matches.push(match);

            socket.emit("match_found", match);
            socket.to(matchPlayer).emit("match_found", match);

            console.log("Match found:", match);
        } else {
            waitingPlayers.add(socket.id);
        }
    });


    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        waitingPlayers.delete(socket.id);
        delete players[socket.id];
    });
});

app.get('/leaderboard', (req, res) => {
    res.json({ results: matches });
});

app.get('/health', (req, res) => {
    res.json({ condition: 'good' });
});

// running server
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});