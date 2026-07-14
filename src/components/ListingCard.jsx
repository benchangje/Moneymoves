import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { Star, Send, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useReviews } from "../hooks/useReviews";
import { useOwnerProfile } from "../hooks/useOwnerProfile";
import ReviewForm from "./ReviewForm";
import Modal from "./Modal";

const ListingCard = ({ item, onCardClick = () => {}, onDelete = null, onToggleAvailability = null }) => {
    const defaultPlaceholder =
        item.imageFallback ||
        `https://via.placeholder.com/640x360.png?text=${encodeURIComponent(item.title || "Listing")}`;

    const [imgSrc, setImgSrc] = useState(item.image || defaultPlaceholder);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [showRentForm, setShowRentForm] = useState(false);
    const [renterHandleInput, setRenterHandleInput] = useState("");
    const { user } = useAuth();
    const { averageRating, reviewCount } = useReviews("listing", item.id, Boolean(item?.id));
    const { teleHandle, loading: loadingOwner } = useOwnerProfile(item.ownerUid);
    const isOwnListing = Boolean(item.ownerUid && user?.uid && item.ownerUid === user.uid);
    const isAvailable = item.available !== false;
    const [rentFormError, setRentFormError] = useState("");

    useEffect(() => {
        setImgSrc(item.image || defaultPlaceholder);
    }, [item.image, item.title]);

    useEffect(() => {
        setCurrentImageIndex(0);
        setIsImageExpanded(false);
    }, [item.id]);

    // Close the expanded view with Escape, without also closing the modal underneath.
    useEffect(() => {
        if (!isImageExpanded) return;
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                setIsImageExpanded(false);
            }
        };
        document.addEventListener("keydown", handleEsc, true);
        return () => document.removeEventListener("keydown", handleEsc, true);
    }, [isImageExpanded]);

    const handleImgError = () => {
        setImgSrc(defaultPlaceholder);
    };

    const toDataUrl = (img) => {
        if (!img) return null;
        if (img.base64?.startsWith("data:")) return img.base64;
        return `data:${img.mimeType || "image/png"};base64,${img.base64}`;
    };

    const galleryImages =
        item.images && item.images.length > 0
            ? item.images.map(toDataUrl).filter(Boolean)
            : [imgSrc];

    const hasMultipleImages = galleryImages.length > 1;

    const currentModalImage =
        galleryImages[currentImageIndex] || galleryImages[0] || defaultPlaceholder;

    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    const dateListed =
        item.dateListed ||
        new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        });

    const rating = Number(averageRating) || (typeof item.rating === "number" ? item.rating : 0);
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    const handleCardClick = () => {
        setCurrentImageIndex(0);
        setIsImageExpanded(false);
        setIsModalOpen(true);
        onCardClick(item.id);
    };

    const handleContactClick = (e) => {
        e.stopPropagation();
        if (!teleHandle) return;

        const cleanHandle = teleHandle.replace(/^@/, "");
        const message = `Hi! I'm interested in your listing "${item.title}" on RentLa.`;
        const telegramUrl = `https://t.me/${cleanHandle}?text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, "_blank", "noopener,noreferrer");
    };

    const handleMarkRentedClick = (e) => {
        e.stopPropagation();
        setShowRentForm(true);
        setRenterHandleInput("");
        setRentFormError("");
    };

    const handleCancelRentForm = (e) => {
        e.stopPropagation();
        setShowRentForm(false);
        setRenterHandleInput("");
        setRentFormError("");
    };

    const handleConfirmRentOut = async (e) => {
        e.stopPropagation();
        if (!renterHandleInput.trim() || !onToggleAvailability) return;
        const cleanRenter = renterHandleInput.trim().replace(/^@/, "").toLowerCase();
        const cleanOwner = teleHandle?.trim().replace(/^@/, "").toLowerCase();

        if (cleanOwner && cleanRenter === cleanOwner) {
            setRentFormError("You cannot rent to yourself.");
            return;
        }
        setIsToggling(true);
        try {
            await onToggleAvailability(item, true, cleanRenter);
            setShowRentForm(false);
            setRenterHandleInput("");
        } finally {
            setIsToggling(false);
        }
    };

    const handleMarkAvailableClick = async (e) => {
        e.stopPropagation();
        if (!onToggleAvailability) return;
        setIsToggling(true);
        try {
            await onToggleAvailability(item, false, "");
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <>
        <div className="relative w-full sm:w-1/2 md:w-64 cursor-pointer transition-all bg-white shadow-[0_0_8px_rgba(0,0,0,0.08)] hover:shadow-xl hover:scale-101 duration-300 ease-in-out hover:bg-gray-200 rounded-lg p-4" onClick={handleCardClick}>
            <div className="relative w-full h-[140px] mb-3">
                {!imageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-md" />
                )}
                <img
                    src={imgSrc}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    onLoad={() => setImageLoaded(true)}
                    onError={handleImgError}
                    alt={item.title || "Listing image"}
                    className={`w-full h-full rounded-md object-cover transition-opacity duration-300 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                />
            </div>

            <div className="flex items-center justify-between mb-1.5 -ml-0.5">
                <span
                    className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                        isAvailable ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                    }`}
                >
                    {isAvailable ? "Available" : "Rented Out"}
                </span>

                {onDelete && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                        }}
                        className="text-gray-500 hover:text-red-600 transition-colors duration-400 ease-in-out"
                        aria-label="Delete listing"
                        title="Delete listing"
                    >
                        <Trash2 className="w-5.5 h-5.5" />
                    </button>
                )}
            </div>

            <h3 className="text-xl font-bold mb-1 text-gray-900 line-clamp-1">{item.title}</h3>
            <p className="text-lg font-bold mb-1.5 text-gray-900">${item.pricePerDay || item.price} / day</p>
            <p className="text-sm text-gray-700">Deposit: ${item.deposit}</p>

            <div className="flex items-center gap-2 mt-2.5">
                <div className="flex gap-1 items-center">
                    {Array.from({ length: fullStars }).map((_, i) => (
                    <Star key={`f-${i}`} className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                    ))}
                    {Array.from({ length: emptyStars }).map((_, i) => (
                    <Star key={`e-${i}`} className="w-4 h-4 fill-gray-300 stroke-gray-300" />
                    ))}
                </div>
                <span className="text-xs text-gray-900">
                    {rating > 0 ? rating.toFixed(1) : "No rating"}
                </span>
                {reviewCount > 0 && <span className="text-xs text-gray-600">({reviewCount})</span>}
            </div>
            <p className="text-[10px] text-gray-700 mt-2.5">Listed: {dateListed}</p>

            {onToggleAvailability && !showRentForm && (
                <>
                    <button
                        type="button"
                        onClick={isAvailable ? handleMarkRentedClick : handleMarkAvailableClick}
                        disabled={isToggling}
                        className={`w-full mt-3 text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50 ${
                            isAvailable
                                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                    >
                        {isToggling
                            ? "Updating..."
                            : isAvailable
                                ? "Mark as Rented Out"
                                : "Mark as Available"}
                    </button>

                    {!isAvailable && (
                        <p className="mt-2 -mb-1 text-xs text-gray-500">
                            Renter can no longer review once marked available.
                        </p>
                    )}
                </>
            )}

            {onToggleAvailability && showRentForm && (
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="text"
                        value={renterHandleInput}
                        onChange={(e) => setRenterHandleInput(e.target.value)}
                        placeholder="Renter's Telegram handle"
                        className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                    />
                    {rentFormError && (
                        <p className="text-xs text-red-600 mb-3 ml-0.5">{rentFormError}</p>
                    )}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleConfirmRentOut}
                            disabled={isToggling || !renterHandleInput.trim()}
                            className="flex-1 text-sm font-medium py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            {isToggling ? "Saving..." : "Confirm"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelRentForm}
                            className="flex-1 text-sm font-medium py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="relative w-full h-48 mb-4 group">
                    <img
                        src={currentModalImage}
                        onError={(e) => {
                            e.currentTarget.src = defaultPlaceholder;
                        }}
                        alt={item.title || "Listing image"}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsImageExpanded(true);
                        }}
                        className="w-full h-48 object-cover rounded-lg cursor-zoom-in"
                    />
                    {hasMultipleImages && (
                        <>
                            <button
                                type="button"
                                onClick={handlePrevImage}
                                aria-label="Previous image"
                                className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNextImage}
                                aria-label="Next image"
                                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            <div className="mb-1 bg-black/40 px-2 py-1.5 rounded-full absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {galleryImages.map((_, i) => (
                                    <button
                                        key={`dot-${i}`}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(i);
                                        }}
                                        aria-label={`Go to image ${i + 1}`}
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                            i === currentImageIndex ? "bg-white" : "bg-white/50"
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <span
                    className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-3 ${
                        isAvailable ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                    }`}
                >
                    {isAvailable ? "Available" : "Rented Out"}
                </span>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h2>
                <p className="text-xl font-bold text-gray-900 mb-4">${item.pricePerDay || item.price}/day</p>
                <p className="text-md text-gray-700 mb-4">Deposit: ${item.deposit}</p>

                {item.description && item.description.trim() !== "" && (
                    <div className="mb-4">
                        <h4 className="text-sm font-bold text-gray-900 mb-1">Description</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{item.description}</p>
                    </div>
                )}

                <div className="flex items-center gap-2 mb-6">
                    <div className="flex gap-1 items-center">
                        {Array.from({ length: fullStars }).map((_, i) => (
                        <Star key={`mf-${i}`} className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
                        ))}
                        {Array.from({ length: emptyStars }).map((_, i) => (
                        <Star key={`me-${i}`} className="w-5 h-5 fill-gray-300 stroke-gray-300" />
                        ))}
                    </div>
                    <span className="text-sm text-gray-900 ml-1">
                        {rating > 0 ? rating.toFixed(1) : "No rating"}
                    </span>
                    {reviewCount > 0 && <span className="text-sm text-gray-600">({reviewCount})</span>}
                </div>

                {isOwnListing && !isAvailable && item.renterTelegram && (
                    <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <p className="text-sm font-semibold text-blue-900 mb-1.5 ml-0.5">Rented to (visible only to you)</p>
                        <p className="text-sm text-blue-800">@{item.renterTelegram.replace(/^@/, "")}</p>
                    </div>
                )}

                {!isOwnListing && (
                    loadingOwner ? (
                        <div className="w-full bg-gray-100 text-gray-400 text-sm py-2.5 rounded-md mb-4 text-center">
                            Loading contact info...
                        </div>
                    ) : teleHandle ? (
                        <button
                            onClick={handleContactClick}
                            className="w-full flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1b87ba] text-white font-semibold py-2.5 rounded-md mb-5 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            Contact via Telegram
                        </button>
                    ) : (
                        <p className="text-xs text-gray-500 mb-4">Sign in to contact Owner via Telegram.</p>
                    )
                )}

                <p className="text-xs text-gray-700 mb-2">Listed: {dateListed}</p>
                <ReviewForm listing={item} telehandle={item.renterTelegram}/>
            </Modal>

            {isImageExpanded && createPortal(
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-6 cursor-zoom-out"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsImageExpanded(false);
                    }}
                >
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsImageExpanded(false);
                        }}
                        aria-label="Close expanded image"
                        className="absolute top-5 right-5 z-10 rounded-full p-2 text-white transition-colors"
                    >
                        <X className="h-8 w-8 hover:text-gray-400" />
                    </button>

                    {hasMultipleImages && (
                        <>
                            <button
                                type="button"
                                onClick={handlePrevImage}
                                aria-label="Previous image"
                                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNextImage}
                                aria-label="Next image"
                                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white bg-white/10 px-3 py-1.5 rounded-full">
                                {currentImageIndex + 1} / {galleryImages.length}
                            </span>
                        </>
                    )}

                    <img
                        src={currentModalImage}
                        onError={(e) => {
                            e.currentTarget.src = defaultPlaceholder;
                        }}
                        alt={item.title || "Listing image"}
                        className="max-w-full max-h-full object-contain rounded-md shadow-2xl cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>,
                document.body
            )}
        </>
    );
};

export default ListingCard;
