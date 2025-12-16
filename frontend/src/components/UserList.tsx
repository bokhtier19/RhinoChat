import { User } from "./../types/User";

interface UserListProps {
    users: User[];
    onUserClick: (user: User) => void;
    onClose: () => void;
    currentUser: User | null;
}

const UserList = ({ users, onUserClick, onClose, currentUser }: UserListProps) => {
    return (
        <div className="fixed items-center z-50 justify-center inset-0 bg-black/60 flex" onClick={onClose}>
            <div className=" w-64 border-r rounded-2xl overflow-y-auto bg-white " onClick={(e) => e.stopPropagation()}>
                <div className="p-4 font-bold text-xl border-b">Contacts</div>

                {users
                    .filter((u) => u._id !== currentUser?._id)
                    .map((user) => (
                        <div key={user._id} onClick={() => onUserClick(user)} className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 border-b">
                            <div className="w-10 h-10 rounded-full bg-green-300 flex items-center justify-center">{user.username[0].toUpperCase()}</div>

                            <div>
                                <p className="font-semibold">{user.username}</p>
                                <p className="text-xs text-green-600">online</p>
                            </div>
                        </div>
                    ))}

                <div className="flex justify-end">
                    <button onClick={onClose} className="m-2 px-2 py-1 items-center flex justify-end border">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserList;
