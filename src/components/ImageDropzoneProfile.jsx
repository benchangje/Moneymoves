import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Plus } from "lucide-react";

const MAX_SIZE = 100;
const QUALITY = 0.5;

{/* IMAGE RESIZER */}
const resizeImage = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();

            image.onload = () => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                if (!context) {
                    reject(new Error("Unable to resize image."));
                    return;
                }

                const scale = Math.min(1, MAX_SIZE / Math.max(image.width, image.height));
                const width = Math.round(image.width * scale);
                const height = Math.round(image.height * scale);

                canvas.width = width;
                canvas.height = height;
                context.drawImage(image, 0, 0, width, height);

                resolve(canvas.toDataURL("image/jpeg", QUALITY));
            };

            image.onerror = () => reject(new Error("Unable to load image."));
            image.src = reader.result;
        };

        reader.onerror = () => reject(new Error("Unable to read image file."));
        reader.readAsDataURL(file);
    });

{/* IMAGE DROPZONE */}
export default function ImageDropzoneProfile({ onImageSelect }) {
    const [preview, setPreview] = useState(null);

    const handleClearImage = (event) => {
        event.stopPropagation();
        setPreview(null);
        if (onImageSelect) onImageSelect('');
    };
    
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        resizeImage(file)
            .then((imageDataUrl) => {
                setPreview(imageDataUrl);
                if (onImageSelect) onImageSelect(imageDataUrl);
            })
            .catch((error) => {
                console.error("Error resizing profile image:", error);
            });
    }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
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
    </div>
    );}