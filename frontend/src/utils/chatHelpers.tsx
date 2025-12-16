import { Room } from "../types/Room";
import { User } from "../types/User";

// Find the other user in a 1v1 room
export function getOtherMember(room: Room, currentUserId?: string) {
    if (!room || !Array.isArray(room.members)) return null;
    return (
        room.members.find((m: any) => {
            if (!m) return false;

            if (typeof m === "string") {
                return m !== currentUserId;
            }

            return m._id !== currentUserId;
        }) || null
    );
}

//find all members except current user
export function getGroupMembers(room: Room, currentUserId?: string): string {
    if (!room || !Array.isArray(room.members)) return "";

    return room.members
        .filter((m: any) => {
            if (!m) return false;

            // remove current user
            if (typeof m === "string") return m !== currentUserId;
            return m._id !== currentUserId;
        })
        .map((m: any) => {
            if (typeof m === "string") return "User";
            return m.username;
        })
        .join(", ");
}

// Avatar letter
export function getAvatar(room: Room, user?: User | null) {
    if (room.isGroup) {
        return (room.name ?? "G").charAt(0).toUpperCase();
    }

    const other = getOtherMember(room, user?._id);

    if (!other || typeof other === "string") return "U";

    return (other.username ?? "U").charAt(0).toUpperCase();
}

// Chat display name
export function getChatName(room: Room, user?: User | null) {
    if (room.isGroup) return room.name ?? "Group";

    const other = getOtherMember(room, user?._id);

    if (!other || typeof other === "string") return "Unknown";

    return other.username ?? "Unknown";
}
