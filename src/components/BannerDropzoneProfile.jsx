import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Plus } from "lucide-react";
import { resizeImage } from "../hooks/imageUtils.js";

{/* BANNER DROPZONE */}
export default function BannerDropzoneProfile({ onImageSelect }) {
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");

    const handleClearImage = (event) => {
        event.stopPropagation();
        setPreview(null);
        setError("");
        if (onImageSelect) onImageSelect('');
    };
    
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setError("");
        // Banners are wide but short, so a taller max dimension keeps them sharp
        // across full-width layouts without ballooning file size.
        resizeImage(file, { maxDimension: 1000, quality: 0.6, format: "image/webp" })
            .then((imageDataUrl) => {
                setPreview(imageDataUrl);
                if (onImageSelect) onImageSelect(imageDataUrl);
            })
            .catch((err) => {
                console.error("Error resizing banner image:", err);
                setError(err.message || "That image couldn't be processed.");
            });
    }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
        },
        maxFiles: 1,
        multiple: false
    });

    return (
    <div className="relative w-full h-24 overflow-visible">

        {preview && (
            <button
                type="button"
                onClick={handleClearImage}
                className="absolute -top-2 -right-2 z-20 rounded-full bg-gray-500 p-1 text-white transition-colors hover:bg-gray-700"
                aria-label="Remove profile photo"
            >
                <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
        )}

        {/* DROPZONE CONTAINER */}
        <div
            {...getRootProps()}
            className={`relative flex items-center justify-center w-full h-full border border-gray-300 rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-400 ease-in-out overflow-hidden 
            ${!preview ? "hover:scale-101" : ""}
            ${isDragActive ? "scale-101" : ""}`}>
            {/* HIDDEN INPUT FIELD REQUIRED FOR LIBRARY */}
            <input {...getInputProps()} />

            {/* SHOW IMAGE FILLED IN CIRCLE */}
            {preview ? (
            <img
                src={preview}
                alt="Profile preview"
                className="absolute inset-0 h-full w-full object-cover"
            />
            ) : (
            <div className="group flex flex-col items-center justify-center w-full h-full p-2 text-center transition-all duration-400 ease-in-out">
                <Plus className={`h-8 w-8 mb-1  ${isDragActive ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500 transition-all duration-400"}`} strokeWidth={1.2}/>
            </div>
            )}
        </div>

        {error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
    </div>
    );
}
