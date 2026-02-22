import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";

export default function ImageDropzone({ onImageSelect }) {
    
    const MAXFILES = 8;
    const [preview, setPreview] = useState([]);
    const [viewImage, setViewImage] = useState(null);
    
    const onDrop = useCallback((acceptedFiles) => {
            setPreview(prev => {
                const slotsLeft = MAXFILES - prev.length;
                if (slotsLeft <= 0) return prev; 
                const allowedFiles = acceptedFiles.slice(0, slotsLeft);
                const newFiles = allowedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                }));
                const updated = [...prev, ...newFiles];
                if (onImageSelect) onImageSelect(updated);
                return updated;
            });
        }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        disabled: preview.length >= MAXFILES,
        maxFiles: MAXFILES
    });

    const handleViewImage = (e, fileUrl) => {
        e.stopPropagation(); 
        setViewImage(fileUrl);
    };

    const removeImage = (e, index) => {
        e.stopPropagation(); 
        const newPreview = [...preview];
        newPreview.splice(index, 1);
        setPreview(newPreview);
        if (onImageSelect) {
            onImageSelect(newPreview);
    }
    };

    return (
    <div className="w-full h-full">
        {/* DROPZONE CONTAINER */}
        <div
            {...getRootProps()}
            className={`w-full h-64 items-center border-3 border-dashed hover:border-blue-400 hover:bg-blue-50 hover:scale-101 rounded-2xl cursor-pointer transition-all duration-400 ease-in-out overflow-hidden overflow-y-auto
            ${isDragActive ? "border-blue-400 bg-blue-100 scale-101" : "border-gray-400 bg-gray-200"}`}>
            {/* HIDDEN INPUT FIELD REQUIRED FOR LIBRARY */}
            <input {...getInputProps()} />

            {/* SHOW IMAGE PREVIEW */}
            {preview.length > 0 ? (
            <div className="flex flex-wrap content-start items-start gap-5 p-5">
                {preview.map((file, index) => (
                    <div key={index} onClick={(e) => handleViewImage(e, file.preview)} className="flex items-center justify-center w-28 h-28 group relative">
                        <img src={file.preview} alt="Preview" className="w-24 h-24 object-cover rounded-2xl group-hover:opacity-70 transition-opacity group-hover:scale-101 duration-300"/>
                        <button onClick={(e) => removeImage(e, index)} className="absolute top-0 right-0 p-1 bg-gray-400 text-white rounded-full hover:bg-gray-300 opacity-100 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
            ) : (
            <div className="group flex flex-col items-center transition-all duration-400 ease-in-out justify-center w-full h-full pt-5 pb-6 ">
                <UploadCloud className={`h-18 w-18 mb-4 ${isDragActive ? "text-blue-400" : "text-gray-400 group-hover:text-blue-400 transition-all duration-400"}`} />
                <p className="mb-2 text-base font-medium">
                    <span className="text-blue-500 hover:underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm font-medium text-gray-400">
                    PNG, JPG, or WEBP (MAX. 5MB)
                </p>
            </div>
            )}
        </div>

        {viewImage && (
        <div className="fixed w-full h-full inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out" onClick={() => setViewImage(null)} >
            <div className="relative w-4/5 h-4/5 flex p-10 justify-center items-center">
                <button onClick={() => setViewImage(null)} className="absolute -top-6 -right-6 p-4 text-gray-300 hover:text-white transition-colors">
                    <X className="h-8 w-8" />
                </button>
                <img 
                    src={viewImage} 
                    alt="Enlarged view" 
                    className="w-full h-full object-contain rounded-md shadow-2xl"
                    onClick={(e) => e.stopPropagation()} 
                />
            </div>
        </div>
        )}
    </div>
    );}