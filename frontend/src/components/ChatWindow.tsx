import { useEffect, useState } from "react";
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
            <div className="flex-1 flex flex-col items-center h-[90vh] overflow-hidden justify-center text-gray-400">
                <BiChat size={40} />
                <h2>Welcome to RhinoChat</h2>
                <p>Send and Receive Messages with RhinoChat.</p>
                <p>Select a chat to start messaging.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-100 max-h-[90vh] overflow-scroll">
            {/* HEADER */}
            <div className="p-4 border-b bg-white flex items-center gap-3 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">{getAvatar(room, user)}</div>
                <div>
                    <h2 className="text-lg font-semibold">{getChatName(room, user)}</h2>
                    <p className="text-xs text-green-600">{room.isGroup ? getGroupMembers(room, user?._id) : getOtherMember(room, user?._id) ? "Online" : "Offline"}</p>
                </div>
            </div>

            {/* MESSAGES */}
            <div id="msg-container" className="flex-1 p-4 overflow-y-auto space-y-2">
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
                                <div className="text-center my-3">
                                    <span className="px-4 py-1 text-xs bg-gray-300 rounded-full">{formatDay(m.createdAt)}</span>
                                </div>
                            )}

                            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`relative max-w-xs p-3 rounded-2xl shadow-md
                                            ${isMe ? "bg-[#DCF8C6]" : "bg-white"}
                                            ${isMe ? "rounded-br-none" : "rounded-bl-none"}`}>
                                    <p className="text-sm text-gray-900">{m.text}</p>

                                    <span className="text-[10px] text-gray-500 block text-right mt-1">{time}</span>

                                    {isMe ? (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#DCF8C6] rounded-bl-full"></span>
                                    ) : (
                                        <span className="absolute bottom-0 left-0 w-3 h-3 bg-white rounded-br-full"></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* INPUT */}
            <div className="p-3 border-t bg-white flex items-center gap-3">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 p-3 rounded-full border bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <button onClick={sendMessage} className="bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 transition">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
