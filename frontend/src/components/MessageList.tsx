import { Message } from "./../types/Message";
import { User } from "./../types/User";

interface MessageListProps {
    messages: Message[];
    user: User | null;
}

const MessageList = ({ messages, user }: MessageListProps) => {
    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => {
                const isMe = m.sender._id === user?._id;

                return (
                    <div key={m._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`p-3 rounded-lg max-w-xs shadow
                ${isMe ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                            <p className="text-sm whitespace-pre-wrap">{m.text}</p>

                            {/* Username */}
                            <p className={`text-[10px] mt-1 ${isMe ? "text-gray-200" : "text-gray-600"}`}>{m.sender.username}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MessageList;
