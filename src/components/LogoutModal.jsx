import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function LogoutModal({ onClose, onCancel, onLogout }) {
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-60">
            <motion.div 
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 0, opacity: 0 }}
                transition={{
                    duration: 0.4,
                    ease: "easeInOut"
                }}
                className="relative bg-white rounded-lg p-3 pb-5 px-5 flex flex-col items-start gap-4 mb-10 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3.5 right-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    aria-label="Close logout modal"
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-semibold text-gray-900">Confirm Logout</h2>
                <p className="text-base text-gray-900">
                    Are you sure you want to logout?
                </p>
                <div className="flex flex-row gap-4 mt-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >
                        Log out
                    </button>
                </div>
            </motion.div>
        </div>
    );
}