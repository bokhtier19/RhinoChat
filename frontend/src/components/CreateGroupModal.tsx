import { useState } from "react";
import { createGroupRoom } from "../api/room";
import { User } from "../types/User";

interface Props {
    users: User[];
    onClose: () => void;
    onCreated: (room: any) => void;
}

export default function CreateGroupModal({ users, onClose, onCreated }: Props) {
    const [name, setName] = useState("");
    const [selected, setSelected] = useState<string[]>([]);

    const toggle = (id: string) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const createGroup = async () => {
        if (!name || selected.length < 2) {
            alert("Enter a group name & select at least 2 members");
            return;
        }

        const res = await createGroupRoom(name, selected);
        onCreated(res.data);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white w-96 p-4 rounded shadow" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-2">Create Group</h2>

                <input type="text" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full mb-4 rounded" />

                <div className="max-h-48 overflow-y-auto border p-2 rounded">
                    {users.map((u) => (
                        <label key={u._id} className="flex items-center gap-2 py-1">
                            <input type="checkbox" checked={selected.includes(u._id)} onChange={() => toggle(u._id)} />
                            {u.username}
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-3 py-1 border rounded">
                        Cancel
                    </button>

                    <button onClick={createGroup} className="px-3 py-1 bg-green-600 text-white rounded">
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
