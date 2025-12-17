import { useState } from "react";

interface Props {
    onClose: () => void;
}

export default function ComingSoon({ onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white w-80 p-6 rounded shadow text-center" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
                <p className="mb-6">This feature is under development. Stay tuned for updates!</p>
                <button onClick={onClose} className="px-4 py-2 bg-green-600 text-white rounded">
                    Close
                </button>
            </div>
        </div>
    );
}
