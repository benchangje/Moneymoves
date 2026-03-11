import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const ListingCard = ({ item, onCardClick }) => {
  const defaultPlaceholder =
    item.imageFallback ||
    `https://via.placeholder.com/640x360.png?text=${encodeURIComponent(item.title || "Listing")}`;

  const [imgSrc, setImgSrc] = useState(item.image || defaultPlaceholder);

  // update imgSrc when item changes (e.g. when rendering recommendations)
  useEffect(() => {
    setImgSrc(item.image || defaultPlaceholder);
  }, [item.image, item.title]);

  const handleImgError = () => {
    // replace with local/public image if you add one to public/images/placeholder.jpg
    setImgSrc(defaultPlaceholder);
  };

  const dateListed =
    item.dateListed ||
    new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const rating = typeof item.rating === "number" ? item.rating : 4.5; // placeholder default
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <div
      className="w-full sm:w-1/2 md:w-64 cursor-pointer border-1 border-gray-200 transition-all shadow-sm hover:shadow-lg hover:scale-101 hover:bg-gray-200 rounded-lg p-4"
      onClick={() => onCardClick(item.id)}
    >
      <img
        src={imgSrc}
        onError={handleImgError}
        alt={item.title || "Listing image"}
        className="w-full"
        style={{
          display: "block",
          height: "140px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "10px",
          backgroundColor: "#e5e5e5",
        }}
      />

      <h3 className="text-[1.15rem] font-bold mb-2 text-gray-900 line-clamp-1">
        {item.title}
      </h3>

      <p className="text-sm text-gray-600 mb-1.5 flex items-center gap-1">
        📍 {item.location}
      </p>

      <p className="text-sm font-semibold mb-1.5 text-gray-900">
        ${item.pricePerDay || item.price}/day
      </p>

      <p className="text-xs text-gray-700">
        Deposit: ${item.deposit || 50}
      </p>

      <div className="flex items-center gap-2 mt-2">
        <div className="flex gap-1 items-center">
          {Array.from({ length: fullStars }).map((_, i) => (
            <Star key={`f-${i}`} className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
          ))}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <Star key={`e-${i}`} className="w-3 h-3 fill-gray-300 stroke-gray-300" />
          ))}
        </div>

        <span className="text-xs text-gray-900">{rating.toFixed(1)}</span>
      </div>

      <p className="text-xs text-gray-700 mt-2">Listed: {dateListed}</p>
    </div>
  );
};

export default ListingCard;
