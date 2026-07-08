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
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative p-6 pb-4"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute rounded-[14px] bg-white top-2 right-2 text-gray-500 hover:text-gray-900 p-1.5"
                >
                    <X className="w-7 h-7" />
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
    };

    export default Modal;