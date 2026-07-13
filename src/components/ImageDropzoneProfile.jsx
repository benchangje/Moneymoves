import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Plus } from "lucide-react";
import { resizeImage } from "../hooks/imageUtils.js";

// Re-exported for any other file still importing resizeImage from here.
export { resizeImage };

{/* IMAGE DROPZONE */}
export default function ImageDropzoneProfile({ onImageSelect }) {
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
        // Avatars render small (a few dozen px), so 300px/WebP keeps these tiny
        // while still looking crisp on retina displays.
        resizeImage(file, { maxDimension: 300, quality: 0.8, format: "image/webp" })
            .then((imageDataUrl) => {
                setPreview(imageDataUrl);
                if (onImageSelect) onImageSelect(imageDataUrl);
            })
            .catch((err) => {
                console.error("Error resizing profile image:", err);
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
    <div className="relative w-20 h-20 overflow-visible">

        {preview && (
            <button
                type="button"
                onClick={handleClearImage}
                className="absolute -top-1 -right-1 z-20 rounded-full bg-gray-500 p-1 text-white transition-colors hover:bg-gray-700"
                aria-label="Remove profile photo"
            >
                <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
        )}

        {/* DROPZONE CONTAINER */}
        <div
            {...getRootProps()}
            className={`relative flex items-center justify-center w-full h-full border border-gray-300 hover:bg-gray-100 rounded-full cursor-pointer transition-all duration-400 ease-in-out overflow-hidden 
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
            <p className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-32 text-center text-xs text-red-500">{error}</p>
        )}
    </div>
    );}
