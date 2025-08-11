import { useState, useEffect, useRef } from "react";
import socket from "./socket";
import { formatDistanceToNow } from "date-fns";

function App() {
    const [message, setMessage] = useState("");
    const [publicChat, setPublicChat] = useState([]);
    const [privateChat, setPrivateChat] = useState([]);
    const [chat, setChat] = useState([]);
    const [username, setUsername] = useState("");
    const [online, setOnline] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [notifications, setNotifications] = useState({});
    const bottomRef = useRef(null);
    let typingTimeout;

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat]);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
            socket.emit("new_user", storedUsername);
        } else {
            const newUsername = prompt("Enter your username:");
            if (newUsername) {
                setUsername(newUsername);
                localStorage.setItem("username", newUsername);
                socket.emit("new_user", newUsername);
            }
        }
    }, []);

    useEffect(() => {
        fetch("http://localhost:3000/messages")
            .then((res) => res.json())
            .then((data) => {
                setPublicChat(data);
                setChat(data);
            });

        socket.on("receive_message", (msg) => {
            setPublicChat((prev) => [...prev, msg]);
            if (!selectedUser) {
                setChat((prev) => [...prev, msg]);
            }
        });

        socket.on("receive_private_message", (msg) => {
            const room = [msg.from, msg.to].sort().join("_");
            const activeRoom = selectedUser && [username, selectedUser].sort().join("_");

            if (room === activeRoom) {
                setPrivateChat((prev) => [...prev, msg]);
                setChat((prev) => [...prev, msg]);
            } else {
                setNotifications((prev) => ({
                    ...prev,
                    [msg.from]: (prev[msg.from] || 0) + 1,
                }));
            }
        });

        socket.on("online_users", (users) => {
            setOnline(users);
        });

        socket.on("display_typing", (user) => {
            setTypingUser(user);
        });

        socket.on("remove_typing", () => {
            setTypingUser(null);
        });

        return () => {
            socket.off("receive_message");
            socket.off("receive_private_message");
            socket.off("online_users");
            socket.off("display_typing");
            socket.off("remove_typing");
        };
    }, [selectedUser]);

    const sendMessage = () => {
        if (!message.trim()) return;
        if (selectedUser) {
            socket.emit("send_private_message", {
                from: username,
                to: selectedUser,
                text: message,
            });
        } else {
            socket.emit("send_message", {
                text: message,
                username,
            });
        }
        setMessage("");
        socket.emit("stop_typing", username);
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);
        socket.emit("typing", username);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socket.emit("stop_typing", username);
        }, 3000);
    };

    const startPrivateChat = (user) => {
        setSelectedUser(user);
        const room = [username, user].sort().join("_");
        setPrivateChat([]);
        setChat([]);
        fetch(`http://localhost:3000/messages/private/${room}`)
            .then((res) => res.json())
            .then((data) => {
                setPrivateChat(data);
                setChat(data);
            });
        socket.emit("start_private_chat", { from: username, to: user });
    };

    const isOwnMessage = (msg) => {
        return msg.username === username || msg.from === username;
    };

    return (
        <div className="h-screen w-screen p-4 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-4">💬 RhinoChat</h1>
            <div className="flex w-full px-4 h-[80vh] gap-4">
                <div className="w-1/4 bg-white shadow rounded p-4 flex flex-col overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-2">🟢 Online Users</h2>
                    {online
                        .filter((u) => u.username !== username)
                        .map((user, i) => (
                            <button key={i} onClick={() => startPrivateChat(user.username)} className="text-left p-2 rounded hover:bg-blue-100 w-full flex justify-between">
                                👤 {user.username}
                                {notifications[user.username] && <span className="bg-red-500 text-white text-xs px-2 rounded-full">{notifications[user.username]}</span>}
                            </button>
                        ))}
                    {typingUser && typingUser !== username && <div className="italic text-sm mt-4 text-gray-500">{typingUser} is typing...</div>}
                </div>

                <div className="w-3/4 flex flex-col bg-white shadow rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">{selectedUser ? `🕵️ Chat with ${selectedUser}` : "🌍 Public Chat Room"}</h2>
                        {selectedUser && (
                            <button
                                onClick={() => {
                                    setSelectedUser(null);
                                    setChat(publicChat);
                                }}
                            >
                                ← Back to Public Chat
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 px-2 py-1">
                        {chat.length === 0 && <div className="text-center text-gray-400 mt-4">No messages yet...</div>}
                        {chat.map((msg, i) => (
                            <div key={i} className={`max-w-[75%] px-4 py-2 rounded-lg shadow ${isOwnMessage(msg) ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-100 text-black self-start"}`}>
                                <div className="text-sm font-semibold">{msg.username || msg.from}</div>
                                <div>{msg.text}</div>
                                <div className="text-xs text-gray-700 mt-1">{formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}</div>
                            </div>
                        ))}
                        <div ref={bottomRef}></div>
                    </div>

                    <div className="mt-2 flex gap-2">
                        <input
                            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-blue-400"
                            type="text"
                            value={message}
                            onChange={handleTyping}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
