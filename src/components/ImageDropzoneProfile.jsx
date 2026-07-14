import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Plus } from "lucide-react";
import { resizeImage, calculateBase64Size } from "../hooks/imageUtils.js";

// Re-exported for any other file still importing resizeImage from here.
export { resizeImage };

{/* IMAGE DROPZONE */}
export default function ImageDropzoneProfile({ onImageSelect, onExceedsLimitChange, initialImage = "" }) {

    const MAX_BASE64_BYTES = 500 * 1024; // 500 KB

    const [preview, setPreview] = useState(initialImage);
    const [error, setError] = useState("");

    const base64Size = calculateBase64Size(preview);
    const base64SizeKB = base64Size / 1024;
    const exceedsLimit = base64Size > MAX_BASE64_BYTES;

    const handleClearImage = (event) => {
        event.stopPropagation();
        setPreview(null);
        setError("");
        if (onImageSelect) onImageSelect('');
        if (onExceedsLimitChange) {
            onExceedsLimitChange(false);
        }
    };
    
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setError("");
        // Avatars render small (a few dozen px), so 300px/WebP keeps these tiny
        // while still looking crisp on retina displays.
        resizeImage(file, { maxDimension: 300, quality: 0.60, format: "image/webp" })
            .then((imageDataUrl) => {
                const imageSize = calculateBase64Size(imageDataUrl);
                if (onExceedsLimitChange) {
                    onExceedsLimitChange(imageSize > MAX_BASE64_BYTES);
                }
                if (imageSize > MAX_BASE64_BYTES) {
                    setError("Image is too large. Please choose a smaller image.");
                    return;
                }
                setPreview(imageDataUrl);
                if (onImageSelect) {
                    onImageSelect(imageDataUrl);
                }
            })
            .catch((err) => {
                setError(err.message || "That image couldn't be processed.");
            });
    }, [onImageSelect, onExceedsLimitChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
            "image/heic": [".heic"],
            "image/heif": [".heif"],
        },
        maxFiles: 1,
        multiple: false
    });

    useEffect(() => {
        setPreview(initialImage || "");
        setError("");
    }, [initialImage]);

    return (
    <div className="w-full">
        <div className="relative w-23 h-23 overflow-visible">
            {preview && (
                <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute -top-0.5 -right-0.5 z-20 rounded-full bg-gray-500 p-1 text-white transition-colors hover:bg-gray-700"
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
        </div>
        <div className="mt-3.5 ml-1">
            {error ? (
                <p className="text-xs text-red-500">
                    {error}
                </p>
            ) : (
                <p className="text-xs text-gray-500 leading-4">
                    Image size:<br/>
                    {preview
                        ? `${base64SizeKB.toFixed(1)} KB / 500 KB`
                        : "0.0 KB / 500 KB"
                    }
                </p>
            )}
        </div>
    </div>
    );
}
