import React from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineCall } from "react-icons/md";
import { RiChat4Fill, RiChatNewFill } from "react-icons/ri";

interface SidebarProps {
    setShowGroupModal: (value: boolean) => void;
    setShowUserList: (value: boolean) => void;
    setShowComingSoon: (value: boolean) => void;
}

const SideBar = ({ setShowGroupModal, setShowUserList, setShowComingSoon }: SidebarProps) => {
    return (
        <div>
            <div className="flex h-[95vh] flex-col gap-2 bg-gray-300 px-2 py-4">
                {/* button for viewing room list */}
                <button onClick={() => setShowGroupModal(true)} className="m-2 rounded bg-green-600 p-2 text-white">
                    <RiChat4Fill size={25} />
                </button>
                {/* button for making group */}
                <button onClick={() => setShowGroupModal(true)} className="m-2 rounded bg-green-600 p-2 text-white">
                    <AiOutlineUsergroupAdd size={25} />
                </button>
                {/* button for coming soon features */}
                <button
                    onClick={() => setShowUserList(true)}
                    className="m-2 flex items-center justify-center rounded bg-green-600 p-2 text-white"
                >
                    <RiChatNewFill size={25} />
                </button>

                {/* button for calling */}
                <button
                    onClick={() => setShowComingSoon(true)}
                    className="m-2 flex items-center justify-center rounded bg-green-600 p-2 text-white"
                >
                    <MdOutlineCall size={25} />
                </button>
                {/* button for settings */}
                <button
                    onClick={() => setShowComingSoon(true)}
                    className="m-2 flex items-center justify-center rounded bg-green-600 p-2 text-white"
                >
                    <IoSettingsOutline size={25} />
                </button>
            </div>
        </div>
    );
};

export default SideBar;
