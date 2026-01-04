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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="animate-fadeIn w-full max-w-md rounded-2xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h2 className="text-lg font-semibold text-gray-800">Create Group</h2>
                    <button onClick={onClose} className="text-xl text-gray-400 hover:text-gray-600">
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4 p-5">
                    {/* Group Name */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">Group name</label>
                        <input
                            type="text"
                            placeholder="e.g. Project Team"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                    </div>

                    {/* Users */}
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">Add members</p>

                        <div className="max-h-48 divide-y overflow-y-auto rounded-lg border">
                            {users.map((u) => (
                                <label
                                    key={u._id}
                                    className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(u._id)}
                                        onChange={() => toggle(u._id)}
                                        className="accent-green-600"
                                    />
                                    <span className="text-sm text-gray-800">{u.username}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-5 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={createGroup}
                        className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
