import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../api/api";
import { Room } from "../types/Room";
import { User } from "../types/User";
import { getUsers } from "../api/users";

import RoomList from "../components/RoomList";
import ChatWindow from "../components/ChatWindow";

import { socket } from "../api/socket";
import UserList from "../components/UserList";
import CreateGroupModal from "../components/CreateGroupModal";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

const Chat = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [rooms, setRooms] = useState<Room[]>([]);
    const [activeRoom, setActiveRoom] = useState<Room | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const [users, setUsers] = useState<User[]>([]);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showUserList, setShowUserList] = useState(false);

    // Fetch users on mount
    useEffect(() => {
        const loadUsers = async () => {
            const res = await getUsers();
            setUsers(res.data);
        };
        loadUsers();
    }, []);

    // When clicking on a user
    const startDirectChat = async (otherUser: User) => {
        if (!user || otherUser._id === user._id) return;

        // Create OR get existing direct room
        const res = await api.post("/rooms/direct", {
            user2: otherUser._id,
        });

        const room = res.data;

        // Set as active chat
        setActiveRoom(room);

        // Add to room list if not already there
        setRooms((prev) => {
            const exists = prev.some((r) => r._id === room._id);
            return exists ? prev : [...prev, room];
        });
        setShowUserList(false);
    };

    // Redirect if not logged in
    useEffect(() => {
        if (!token) navigate("/login");
    }, [token, navigate]);

    // Load user from local storage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Load user rooms
    useEffect(() => {
        const fetchRooms = async () => {
            const res = await api.get("/rooms");
            setRooms(res.data);
        };
        fetchRooms();
    }, []);

    // Connect socket after login
    useEffect(() => {
        if (token && user) {
            socket.connect();
            console.log("Socket connected:", socket.id);
        }

        return () => {
            socket.disconnect();
        };
    }, [token, user]);

    // Join room in socket when selected
    useEffect(() => {
        if (activeRoom) {
            socket.emit("joinRoom", activeRoom._id);
        }
    }, [activeRoom]);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Navbar />
            <div className="flex">
                <SideBar setShowGroupModal={setShowGroupModal} setShowUserList={setShowUserList} />

                {showGroupModal && (
                    <CreateGroupModal
                        users={users}
                        onClose={() => setShowGroupModal(false)}
                        onCreated={(room) => {
                            setRooms((prev) => [...prev, room]);
                            setActiveRoom(room);
                        }}
                    />
                )}

                {showUserList && <UserList users={users} onUserClick={startDirectChat} onClose={() => setShowUserList(false)} currentUser={user} />}

                <RoomList rooms={rooms} activeRoom={activeRoom} setActiveRoom={setActiveRoom} user={user} />
                <ChatWindow room={activeRoom} user={user} />
            </div>
        </div>
    );
};

export default Chat;
