import React from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineCall } from "react-icons/md";
import { RiChat4Fill, RiChatNewFill } from "react-icons/ri";

interface SidebarProps {
    setShowGroupModal: (value: boolean) => void;
    setShowUserList: (value: boolean) => void;
}

const SideBar = ({ setShowGroupModal, setShowUserList }: SidebarProps) => {
    return (
        <div>
            <div className="flex flex-col gap-2 px-2 py-4 bg-gray-300 h-[95vh]">
                <button onClick={() => setShowGroupModal(true)} className="p-2 bg-green-600 text-white rounded m-2">
                    <RiChat4Fill size={25} />
                </button>
                <button onClick={() => setShowGroupModal(true)} className="p-2 bg-green-600 text-white rounded m-2">
                    <AiOutlineUsergroupAdd size={25} />
                </button>
                <button onClick={() => setShowUserList(true)} className="flex justify-center items-center p-2 bg-green-600 text-white rounded m-2">
                    <RiChatNewFill size={25} />
                </button>
                <button onClick={() => setShowUserList(true)} className="flex justify-center items-center p-2 bg-green-600 text-white rounded m-2">
                    <MdOutlineCall size={25} />
                </button>
                <button onClick={() => setShowUserList(true)} className="flex justify-center items-center p-2 bg-green-600 text-white rounded m-2">
                    <IoSettingsOutline size={25} />
                </button>
            </div>
        </div>
    );
};

export default SideBar;
