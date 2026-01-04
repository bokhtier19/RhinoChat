import { use, useEffect, useState } from "react";
import { api } from "../api/api";
import { socket } from "../api/socket";

import { Room } from "../types/Room";
import { User } from "../types/User";
import { Message } from "../types/Message";
import { BiChat } from "react-icons/bi";

import { formatDay } from "../utils/dateHelpers";
import { getAvatar, getChatName, getOtherMember, getGroupMembers } from "../utils/chatHelpers";

interface ChatWindowProps {
    room: Room | null;
    user: User | null;
}

const ChatWindow = ({ room, user }: ChatWindowProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineusers, setOnlineUsers] = useState<string[]>([]);
    const [text, setText] = useState("");

    // Load messages when room changes
    useEffect(() => {
        if (!room) return;

        const loadMessages = async () => {
            const res = await api.get(`/messages/${room._id}`);
            setMessages(res.data);
        };

        loadMessages();

        socket.on("receiveMessage", (msg: Message) => {
            if (msg.room === room._id) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [room]);

    useEffect(() => {
        const el = document.getElementById("msg-container");
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages]);

    // Join socket room
    useEffect(() => {
        if (room) {
            socket.emit("joinRoom", room._id);
        }
    }, [room]);

    // Listen for online users

    useEffect(() => {
        socket.on("onlineUsers", (users: string[]) => {
            setOnlineUsers(users);
        });

        console.log(onlineusers);

        return () => {
            socket.off("onlineUsers");
        };
    }, []);

    const sendMessage = () => {
        if (!text.trim() || !user || !room) return;

        socket.emit("sendMessage", {
            roomId: room._id,
            senderId: user._id,
            text,
        });

        setText("");
    };

    if (!room) {
        return (
            <div className="flex h-[90vh] flex-1 flex-col items-center justify-center overflow-hidden text-gray-400">
                <BiChat size={40} />
                <h2>Welcome to RhinoChat</h2>
                <p>Send and Receive Messages with RhinoChat.</p>
                <p>Select a chat to start messaging.</p>
            </div>
        );
    }
    const otherMember = !room?.isGroup ? getOtherMember(room, user?._id) : null;

    const otherUserId = typeof otherMember === "string" ? otherMember : otherMember?._id;

    return (
        <div className="flex max-h-[90vh] flex-1 flex-col overflow-scroll bg-gray-100">
            {/* HEADER */}
            <div className="flex items-center gap-3 border-b bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
                    {getAvatar(room, user)}
                </div>
                <div>
                    <h2 className="text-lg font-semibold">{getChatName(room, user)}</h2>
                    <p className="text-xs text-green-600">
                        {room.isGroup
                            ? getGroupMembers(room, user?._id)
                            : onlineusers.includes(otherUserId ?? "")
                              ? "Online"
                              : "Offline"}
                    </p>
                </div>
            </div>

            {/* MESSAGES */}
            <div id="msg-container" className="flex-1 space-y-2 overflow-y-auto p-4">
                {messages.map((m, i) => {
                    const isMe = m.sender._id === user?._id;

                    const showDate = i === 0 || formatDay(m.createdAt) !== formatDay(messages[i - 1]?.createdAt);

                    const time = new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    });

                    return (
                        <div key={m._id}>
                            {showDate && (
                                <div className="my-3 text-center">
                                    <span className="rounded-full bg-gray-300 px-4 py-1 text-xs">
                                        {formatDay(m.createdAt)}
                                    </span>
                                </div>
                            )}

                            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`relative max-w-xs rounded-2xl p-3 shadow-md ${isMe ? "bg-[#DCF8C6]" : "bg-white"} ${isMe ? "rounded-br-none" : "rounded-bl-none"}`}
                                >
                                    <p className="text-sm text-gray-900">{m.text}</p>

                                    <span className="mt-1 block text-right text-[10px] text-gray-500">{time}</span>

                                    {isMe ? (
                                        <span className="absolute right-0 bottom-0 h-3 w-3 rounded-bl-full bg-[#DCF8C6]"></span>
                                    ) : (
                                        <span className="absolute bottom-0 left-0 h-3 w-3 rounded-br-full bg-white"></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* INPUT */}
            <div className="flex items-center gap-3 border-t bg-white p-3">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 rounded-full border bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <button
                    onClick={sendMessage}
                    className="rounded-full bg-blue-600 px-5 py-2 text-white shadow transition hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
