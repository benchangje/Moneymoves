import { useState, useEffect } from "react";
import { Star, Send, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useReviews } from "../hooks/useReviews";
import { useOwnerProfile } from "../hooks/useOwnerProfile";
import ReviewForm from "./ReviewForm";
import Modal from "./Modal";

const ListingCard = ({ item, onCardClick = () => {}, onDelete = null }) => {
    const defaultPlaceholder =
        item.imageFallback ||
        `https://via.placeholder.com/640x360.png?text=${encodeURIComponent(item.title || "Listing")}`;

    const [imgSrc, setImgSrc] = useState(item.image || defaultPlaceholder);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const { averageRating, reviewCount } = useReviews("listing", item.id, Boolean(item?.id));
    const { teleHandle, loading: loadingOwner } = useOwnerProfile(item.ownerUid);
    const isOwnListing = Boolean(item.ownerUid && user?.uid && item.ownerUid === user.uid);

    useEffect(() => {
        setImgSrc(item.image || defaultPlaceholder);
    }, [item.image, item.title]);

    const handleImgError = () => {
        setImgSrc(defaultPlaceholder);
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

  return (
    <>
    <div className="relative w-full sm:w-1/2 md:w-64 cursor-pointer transition-all bg-white shadow-[0_0_8px_rgba(0,0,0,0.08)] hover:shadow-xl hover:scale-101 duration-300 ease-in-out hover:bg-gray-200 rounded-lg p-4 pb-3" onClick={handleCardClick}>
        <img
            src={imgSrc}
            onError={handleImgError}
            alt={item.title || "Listing image"}
            className="w-full rounded-md"
            style={{
                display: "block",
                height: "140px",
                objectFit: "cover",
                marginBottom: "10px",
                backgroundColor: "#e5e5e5",
          }}
        />
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
            {onDelete && (
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					onDelete(item.id);
				}}
                className="absolute bottom-3.5 right-3 text-gray-500 hover:text-red-600 transition-colors duration-400 ease-in-out"
				aria-label="Delete listing"
				title="Delete listing"
			>
				<Trash2 className="w-6 h-6" />
			</button>
        )}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <img
                src={imgSrc}
                alt={item.title || "Listing image"}
                className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h2>
            <p className="text-xl font-bold text-gray-900 mb-4">${item.pricePerDay || item.price}/day</p>
            <p className="text-md text-gray-700 mb-4">Deposit: ${item.deposit}</p>

            {item.description && item.description.trim() !== "" && (
                <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Description</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.description}</p>
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
                    <p className="text-xs text-gray-500 mb-4">Owner has not verified Telegram contact.</p>
                )
            )}

            <p className="text-xs text-gray-700 mb-4">Listed: {dateListed}</p>
            <ReviewForm listing={item} />
        </Modal>
    </>
  );
};

export default ListingCard;