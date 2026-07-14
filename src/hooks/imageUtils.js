import { heicTo } from "heic-to";

// Shared image resize/compress utilities.
// Used by ImageDropzone (listings), ImageDropzoneProfile (avatar), and BannerDropzoneProfile (banner).

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
export const resizeImage = async (
    file,
    options = {}
) => {
    return processImage(file, options);
};
 
/**
 * Produces both a full-size (for detail/modal views) and a small thumbnail
 * (for grid/card views) data URL from a single source file, in one decode pass.
 *
 * @param {File} file
 * @returns {Promise<{ full: string, thumbnail: string }>}
 */
export const generateImageVariants = async (file) => {
    return {
        full: await processImage(file, {
            maxDimension: 720,
            quality: 0.4,
            format: "image/webp",
        }),
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

export const toRenderableImageSrc = (image) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    if (image.base64?.startsWith("data:")) return image.base64;
    if (image.base64) {
        return `data:${image.mimeType || "image/png"};base64,${image.base64}`;
    }
    return "";
};

/**
 * Detects HEIC/HEIF files (iPhone's default photo format) and converts them
 * to JPEG so the rest of the pipeline (loadImage, canvas, etc.) can handle them.
 * Browsers generally cannot decode HEIC natively via <img>/canvas.
 */
const isHeic = (file) => {
    const type = file.type?.toLowerCase() || "";
    const name = file.name?.toLowerCase() || "";
    return (
        type === "image/heic" ||
        type === "image/heif" ||
        name.endsWith(".heic") ||
        name.endsWith(".heif")
    );
};

export const normalizeToJpegIfHeic = async (file) => {
    if (!isHeic(file)) return file;

    const jpegBlob = await heicTo({
        blob: file,
        type: "image/jpeg",
        quality: 0.8,
    });

    const baseName = file.name.replace(/\.[^/.]+$/, "");

    return new File(
        [jpegBlob],
        `${baseName}.jpg`,
        { type: "image/jpeg" }
    );
};

export const processImage = async (
    file,
    {
        maxDimension = 1440,
        quality = 0.82,
        format = "image/webp",
    } = {}
) => {
    const normalizedFile = await normalizeToJpegIfHeic(file);

    const image = await loadImage(normalizedFile);

    const MAX_DIMENSION = 12000;
    const MAX_PIXELS = 100_000_000;

    if (
        image.width > MAX_DIMENSION ||
        image.height > MAX_DIMENSION ||
        image.width * image.height > MAX_PIXELS
    ) {
        throw new Error("Image resolution is too large.");
    }

    let currentDimension = maxDimension;
    let currentQuality = quality;

    while (true) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Unable to resize image.");
        }

        const scale = Math.min(
            1,
            currentDimension / Math.max(image.width, image.height)
        );

        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL(format, currentQuality);
        const size = calculateBase64Size(dataUrl);

        // Fits within Firestore budget
        if (size <= 200 * 1024) {
            return dataUrl;
        }

        // Reduce quality first
        if (currentQuality > 0.15) {
            currentQuality -= 0.05;
            continue;
        }

        // Then reduce dimensions
        if (currentDimension > 300) {
            currentDimension = Math.round(currentDimension * 0.9);
            currentQuality = quality; // Reset quality for the smaller image
            continue;
        }

        // Give up once we hit minimum size
        return dataUrl;
    }
}