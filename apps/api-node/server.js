const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Configure properly for production
        methods: ["GET", "POST"]
    }
});

// In-memory leaderboard for demonstration (use Redis in prod)
let globalLeaderboard = [
    { id: '1', displayName: 'Ada L.', points: 1540 },
    { id: '2', displayName: 'Leonhard E.', points: 1420 },
    { id: '3', displayName: 'Carl G.', points: 1300 }
];

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send initial leaderboard state
    socket.emit('leaderboardUpdate', globalLeaderboard);

    // Listen for score submissions (from Django API or client directly)
    socket.on('scoreSubmitted', (data) => {
        console.log(`Score submitted by userId ${data.userId}: +${data.points}`);

        // Simulating DB/Redis update
        const userIndex = globalLeaderboard.findIndex(u => u.id === data.userId);
        if (userIndex !== -1) {
            globalLeaderboard[userIndex].points += data.points;
        } else {
            globalLeaderboard.push({
                id: data.userId,
                displayName: data.displayName || 'New Scholar',
                points: data.points
            });
        }

        // Sort leaderboard descending
        globalLeaderboard.sort((a, b) => b.points - a.points);

        // Broadcast new leaderboard to all connected clients
        io.emit('leaderboardUpdate', globalLeaderboard);

        // Send specific streak notification back to the user who scored
        socket.emit('streakNotification', {
            message: `Awesome! You earned ${data.points} points. Keep your streak alive!`,
            currentStreak: data.streak || 1
        });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`MathPath WebSocket Server running on port ${PORT}`);
});
