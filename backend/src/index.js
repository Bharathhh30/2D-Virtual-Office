const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: "*"
}));
app.use(bodyParser.json());
app.use(express.json());

const rooms = {};

app.get('/', (req, res) => {
    res.send('Server is running....');
})

app.post('/create-room', (req, res) => {
    const { roomName } = req.body;
    const roomId = uuidv4();
    rooms[roomId] = { name: roomName, users: [] }; // Important: Initialize with empty users array

    res.json({ roomId });
});

app.get('/rooms', (req, res) => {
    res.json(rooms);
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', (roomId, userName) => {
        if (rooms[roomId]) {
            socket.join(roomId);
            rooms[roomId].users.push({ socketId: socket.id, name: userName });
            console.log(`User ${socket.id} (${userName}) joined room ${roomId}`);

            // Emit the *entire* user list to *all* clients in the room
            io.to(roomId).emit('update-user-list', rooms[roomId].users); // Send the whole list

        } else {
            socket.emit('room-join-error', 'Room not found.');
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        for (const roomId in rooms) {
            rooms[roomId].users = rooms[roomId].users.filter(user => user.socketId !== socket.id);
            io.to(roomId).emit('update-user-list', rooms[roomId].users); // Send the whole list on disconnect
        }
    });

    socket.on('exit-room', (roomId) => {
        if (rooms[roomId]) {
            rooms[roomId].users = rooms[roomId].users.filter(user => user.socketId !== socket.id);
            io.to(roomId).emit('update-user-list', rooms[roomId].users); // Send the whole list on exit
            socket.leave(roomId);
        }
    });

});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});