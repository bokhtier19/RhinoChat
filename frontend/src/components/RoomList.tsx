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
        <div className="hidden w-72 flex-col overflow-y-auto border-r bg-white md:flex">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b bg-gray-50 p-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white">
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-lg font-bold">{user?.username}</p>
                </div>

                <div className="flex items-center gap-4 text-xl text-gray-600">
                    <IoChatbubbleEllipsesOutline className="cursor-pointer hover:text-black" />
                    <FiMoreVertical className="cursor-pointer hover:text-black" />
                </div>
            </div>

            {/* TITLE */}
            <div className="border-b bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-500 uppercase">Chats</div>

            {/* ROOM LIST */}
            <div className="flex-1">
                {rooms.map((room) => {
                    const roomName = getRoomName(room, user?._id);

                    return (
                        <div
                            key={room._id}
                            onClick={() => setActiveRoom(room)}
                            className={`cursor-pointer border-b p-4 transition hover:bg-gray-100 ${activeRoom?._id === room._id ? "bg-gray-200" : ""}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
                                    {roomName?.charAt(0).toUpperCase()}
                                </div>

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
