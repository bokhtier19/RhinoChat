import {Server, Socket} from "socket.io";
import {Message} from "../models/Message";

export const initSeenSocket = (io: Server, socket: Socket) => {
    /**
     * Mark messages as seen by a user
     * payload:
     * {
     *   roomId: string,
     *   userId: string
     * }
     */
    socket.on("markAsSeen", async ({roomId, userId}) => {
        if (!roomId || !userId) return;

        // Update only messages NOT sent by this user
        await Message.updateMany(
            {
                room: roomId,
                sender: {$ne: userId},
                seenBy: {$ne: userId}
            },
            {
                $addToSet: {seenBy: userId}
            }
        );

        // Notify others in the room
        socket.to(roomId).emit("messagesSeen", {
            roomId,
            userId
        });
    });
};
