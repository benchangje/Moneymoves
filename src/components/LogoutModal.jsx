import { X } from "lucide-react";

export default function LogoutModal({ onClose, onCancel, onLogout }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 pt-4 pb-6.5 flex flex-col items-start gap-4 mb-10 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                <div className="flex flex-row items-start gap-20">
                    <h2 className="text-2xl font-semibold text-gray-900">Confirm Logout</h2>
                    <X 
                        onClick={onClose} 
                        className="h-6 w-6 text-gray-400 mt-1 cursor-pointer hover:text-gray-600 transition-colors" 
                    />
                </div>
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
            </div>
        </div>
    );
}