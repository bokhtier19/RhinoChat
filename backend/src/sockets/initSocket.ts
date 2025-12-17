import {initChatSocket} from "./chat.socket";
import {initSeenSocket} from "./seen.socket";
import {initPresenceSocket} from "./presence.socket";

export const initSocket = (io: any) => {
    const onlineUsers = new Map<string, string>();

    io.on("connection", (socket: any) => {
        console.log("socket connected:", socket.id);

        initPresenceSocket(io, socket, onlineUsers);
        initChatSocket(io, socket);
        initSeenSocket(io, socket);

        socket.on("disconnect", () => {
            console.log("socket disconnected:", socket.id);
        });
    });
};
