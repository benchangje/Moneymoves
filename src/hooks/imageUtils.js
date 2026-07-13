// Shared image resize/compress utilities.
// Used by ImageDropzone (listings), ImageDropzoneProfile (avatar), and BannerDropzoneProfile (banner).
 
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB, matches the dropzone UI copy
 
/**
 * Reads a File and returns an HTMLImageElement once loaded.
 */
const loadImage = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("Unable to load image."));
            image.src = reader.result;
        };
        reader.onerror = () => reject(new Error("Unable to read image file."));
        reader.readAsDataURL(file);
    });
 
/**
 * Resizes + compresses an image file to a data URL.
 *
 * @param {File} file - the source image file
 * @param {Object} options
 * @param {number} options.maxDimension - max width/height in pixels (longest edge)
 * @param {number} options.quality - 0-1 compression quality
 * @param {string} options.format - "image/webp" | "image/jpeg" | "image/png"
 * @returns {Promise<string>} data URL
 */
export const resizeImage = async (file, { maxDimension = 1440, quality = 0.82, format = "image/webp" } = {}) => {
    if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error(`File "${file.name}" is larger than 5MB. Please choose a smaller image.`);
    }
 
    const image = await loadImage(file);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
 
    if (!context) {
        throw new Error("Unable to resize image.");
    }
 
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
 
    return canvas.toDataURL(format, quality);
};
 
/**
 * Produces both a full-size (for detail/modal views) and a small thumbnail
 * (for grid/card views) data URL from a single source file, in one decode pass.
 *
 * @param {File} file
 * @returns {Promise<{ full: string, thumbnail: string }>}
 */
export const generateImageVariants = async (file) => {
    if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error(`File "${file.name}" is larger than 5MB. Please choose a smaller image.`);
    }
 
    const image = await loadImage(file);
 
    const render = (maxDimension, quality, format) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL(format, quality);
    };
 
    return {
        full: render(1080, 0.60, "image/webp"),      // for the modal carousel / detail view
        thumbnail: render(320, 0.65, "image/webp"),  // for the homepage listing card
    };
};
 
/**
 * Converts a data URL into a File object, so resized images can still be
 * uploaded/stored using the same File-based flow as the original.
 */
export const dataUrlToFile = async (dataUrl, filename) => {
    const blob = await fetch(dataUrl).then((res) => res.blob());
    const ext = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
    const baseName = filename.replace(/\.[^/.]+$/, "");
    return new File([blob], `${baseName}.${ext}`, { type: blob.type });
};

export const calculateBase64Size = (dataUrl) => {
    if (!dataUrl) return 0;
    const base64 = dataUrl.split(",")[1] ?? "";
    return Math.ceil(base64.length * 3 / 4);
};