import React from "react";
import { BiChat } from "react-icons/bi";

const Navbar = () => {
    return (
        <div className="flex items-center justify-start gap-2 bg-gray-300 px-4 py-2">
            <img src="/rhino1.svg" className="w-10" alt="" />
            <p className="text-2xl font-bold text-green-500">RhinoChat</p>
        </div>
    );
};

export default Navbar;
