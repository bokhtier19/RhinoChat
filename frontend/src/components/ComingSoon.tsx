import { useState } from "react";

interface Props {
    onClose: () => void;
}

export default function ComingSoon({ onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div className="w-80 rounded bg-white p-6 text-center shadow" onClick={(e) => e.stopPropagation()}>
                <h2 className="mb-4 text-2xl font-bold">Coming Soon!</h2>
                <p className="mb-6">This feature is under development. Stay tuned for updates!</p>
                <button onClick={onClose} className="rounded bg-green-600 px-4 py-2 text-white">
                    Close
                </button>
            </div>
        </div>
    );
}
