import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import {Server} from "socket.io";

import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import roomRouter from "./routes/roomRoutes";
import messageRouter from "./routes/messageRoutes";

import {connectDB} from "./config/db";
import {initSocket} from "./sockets/initSocket";
dotenv.config();
connectDB();

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create socket.io server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Initialize socket handlers
initSocket(io);

// Register routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/messages", messageRouter);

// Start HTTP + socket server
server.listen(PORT, () => console.log("Server running:", PORT));
