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
            className="fixed inset-0 z-[100] bg-black/50 flex items-start justify-center overflow-y-auto p-6 sm:items-center sm:p-6"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain rounded-lg bg-white p-6 pb-2 shadow-xl [-webkit-overflow-scrolling:touch] sm:max-h-[calc(100dvh-3rem)]"
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