import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Message from "./models/Message.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err));

// In-memory user storage
const users = {}; // { username: socketId }

io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    socket.on("new_user", (username) => {
        users[username] = socket.id;
        socket.username = username;

        const onlineUsers = Object.entries(users).map(([username, socketId]) => ({
            username,
            socketId,
        }));

        io.emit("online_users", onlineUsers);
    });

    socket.on("send_message", async ({ text, username }) => {
        const msg = {
            text,
            username: username || socket.username,
            timestamp: new Date(),
        };

        await Message.create(msg);
        io.emit("receive_message", msg);
    });

    socket.on("send_private_message", async ({ from, to, text }) => {
        const room = [from, to].sort().join("_");

        const msg = {
            from,
            to,
            text,
            room,
            timestamp: new Date(),
        };

        await Message.create(msg);

        const recipientSocket = users[to];
        if (recipientSocket) {
            io.to(recipientSocket).emit("receive_private_message", msg);
        }

        socket.emit("receive_private_message", msg);
    });

    socket.on("typing", (username) => {
        socket.broadcast.emit("display_typing", username);
    });

    socket.on("stop_typing", (username) => {
        socket.broadcast.emit("remove_typing", username);
    });

    socket.on("disconnect", () => {
        if (socket.username) {
            delete users[socket.username];

            const onlineUsers = Object.entries(users).map(([username, socketId]) => ({
                username,
                socketId,
            }));

            io.emit("online_users", onlineUsers);
        }

        console.log("Client disconnected:", socket.id);
    });
});

// REST API Routes

// Test route
app.get("/", (req, res) => {
    res.send("💬 RhinoChat server is running.");
});

// Get public messages
app.get("/messages", async (req, res) => {
    try {
        const messages = await Message.find({ room: { $exists: false } }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch public messages." });
    }
});

// Get private messages by room
app.get("/messages/private/:room", async (req, res) => {
    try {
        const room = req.params.room;
        const messages = await Message.find({ room }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch private messages." });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
