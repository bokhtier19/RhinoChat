import React from "react";
import { BiChat } from "react-icons/bi";

const Navbar = () => {
    return (
        <div className="px-4 flex py-2 gap-2 justify-start items-center bg-gray-300">
            <img src="/rhino1.svg" className="w-10" alt="" />
            <p className="font-bold text-2xl text-green-500">RhinoChat</p>
        </div>
    );
};

export default Navbar;
