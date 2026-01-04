import { User } from "./../types/User";

interface UserListProps {
    users: User[];
    onUserClick: (user: User) => void;
    onClose: () => void;
    currentUser: User | null;
}

const UserList = ({ users, onUserClick, onClose, currentUser }: UserListProps) => {
    return (
        <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm" onClick={onClose}>
            {/* Drawer */}
            <div
                className="animate-slideInLeft relative h-full w-72 bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
                    <h2 className="text-lg font-semibold text-gray-800">Contacts</h2>
                    <button onClick={onClose} className="text-xl text-gray-400 hover:text-gray-600">
                        ×
                    </button>
                </div>

                {/* Contact List */}
                <div className="overflow-y-auto">
                    {users
                        .filter((u) => u._id !== currentUser?._id)
                        .map((user) => (
                            <div
                                key={user._id}
                                onClick={() => onUserClick(user)}
                                className="flex cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-gray-100"
                            >
                                {/* Avatar */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-semibold text-white">
                                    {user.username[0].toUpperCase()}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{user.username}</p>
                                    <p className="text-xs text-green-600">Online</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default UserList;
