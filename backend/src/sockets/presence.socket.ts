import {Socket} from "socket.io";

export const initPresenceSocket = (io: any, socket: Socket, onlineUsers: Map<string, string>) => {
    socket.on("addUser", (userId: string) => {
        onlineUsers.set(userId, socket.id);
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
};
