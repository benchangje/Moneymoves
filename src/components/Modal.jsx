import { createPortal } from "react-dom";
import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";
        return () => {
        document.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "auto";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6"
            onClick={onClose}
        >
            <div
                className="relative flex h-[700px] w-[600px] max-h-[82vh] max-w-[90vw] flex-col overflow-hidden rounded-lg bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 z-10 rounded-[14px] rounded-br-none rounded-tl-none bg-white p-1.5 text-gray-500 hover:text-gray-900"
                >
                    <X className="h-7 w-7" />
                </button>

                <div className="flex-1 overflow-y-auto p-6 pb-2">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;