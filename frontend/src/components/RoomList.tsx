import { FiMoreVertical } from "react-icons/fi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { User } from "../types/User";
import { Room } from "../types/Room";

interface RoomListProps {
    rooms: Room[];
    activeRoom: Room | null;
    setActiveRoom: (room: Room) => void;
    user: User | null;
}

function getRoomName(room: Room, currentUserId: string | undefined) {
    // Group name
    if (room.isGroup) return room.name || "Group";

    // If no members → fallback
    if (!Array.isArray(room.members) || room.members.length === 0) {
        return "Unknown";
    }

    // Find the other user
    const other = room.members.find((m: any) => {
        if (!m) return false; // m is null
        if (typeof m === "string") return m !== currentUserId; // plain string id
        return m._id !== currentUserId; // populated object
    });

    // Return username or fallback
    if (other && typeof other !== "string") {
        return other.username || "Unknown";
    }

    return "Unknown";
}

const RoomList = ({ rooms, activeRoom, setActiveRoom, user }: RoomListProps) => {
    return (
        <div className="w-72 bg-white border-r overflow-y-auto flex flex-col">
            {/* HEADER */}
            <div className="p-4 flex items-center justify-between border-b shadow-sm bg-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg">{user?.username.charAt(0).toUpperCase()}</div>
                    <p className="font-bold text-lg">{user?.username}</p>
                </div>

                <div className="flex items-center gap-4 text-gray-600 text-xl">
                    <IoChatbubbleEllipsesOutline className="cursor-pointer hover:text-black" />
                    <FiMoreVertical className="cursor-pointer hover:text-black" />
                </div>
            </div>

            {/* TITLE */}
            <div className="px-4 py-2 text-sm uppercase font-semibold text-gray-500 border-b bg-gray-50">Chats</div>

            {/* ROOM LIST */}
            <div className="flex-1">
                {rooms.map((room) => {
                    const roomName = getRoomName(room, user?._id);

                    return (
                        <div
                            key={room._id}
                            onClick={() => setActiveRoom(room)}
                            className={`p-4 cursor-pointer border-b hover:bg-gray-100 transition
                                ${activeRoom?._id === room._id ? "bg-gray-200" : ""}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">{roomName?.charAt(0).toUpperCase()}</div>

                                <div>
                                    <p className="font-semibold">{roomName}</p>
                                    <p className="text-xs text-gray-500">Last message…</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RoomList;
