import { Server } from "socket.io";
import { Message } from "../models/Message";

export const initSocket = (io: Server) => {
    io.on("connection", (socket) => {
        console.log("a user connected", socket.id);

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({ roomId, senderId, text }) => {
            const message = await Message.create({
                room: roomId,
                sender: senderId,
                text,
            });

            // Populate sender so the frontend instantly gets sender._id & sender.username
            const populated = await message.populate("sender", "username _id");

            io.to(roomId).emit("receiveMessage", {
                ...populated.toObject(),
                room: roomId,
            });
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected!", socket.id);
        });
    });
};
