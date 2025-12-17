import {Server, Socket} from "socket.io";
import {Message} from "../models/Message";

export const initChatSocket = (io: Server, socket: Socket) => {
    console.log("chat socket attached:", socket.id);

    socket.on("joinRoom", (roomId: string) => {
        socket.join(roomId);
    });

    socket.on("sendMessage", async ({roomId, senderId, text}) => {
        const message = await Message.create({
            room: roomId,
            sender: senderId,
            text
        });

        const populated = await message.populate("sender", "username _id");

        io.to(roomId).emit("receiveMessage", {
            ...populated.toObject(),
            room: roomId
        });
    });
};
