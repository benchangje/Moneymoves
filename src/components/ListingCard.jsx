import { useState, useEffect } from "react";

const ListingCard = ({ item, onCardClick }) => {
  const defaultPlaceholder =
    item.imageFallback ||
    `https://via.placeholder.com/640x360.png?text=${encodeURIComponent(item.title || "Listing")}`;

  const [imgSrc, setImgSrc] = useState(item.image || defaultPlaceholder);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // update imgSrc when item changes (e.g. when rendering recommendations)
  useEffect(() => {
    setImgSrc(item.image || defaultPlaceholder);
  }, [item.image, item.title]);

  const handleImgError = () => {
    // replace with local/public image if you add one to public/images/placeholder.jpg
    setImgSrc(defaultPlaceholder);
  };

  const handleClick = () => {
    if (!isClicked) {
      onCardClick(item.id);
      setIsClicked(true);
    }
  };

  const dateListed =
    item.dateListed ||
    new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const rating = typeof item.rating === "number" ? item.rating : 4.0; // placeholder default
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <div
      className="w-full sm:w-1/2 md:w-64 cursor-pointer transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        border: "1px solid rgba(200, 200, 200, 0.3)",
        borderRadius: "10px",
        padding: "16px",
        margin: "12px",
        background: isHovered || isClicked ? "#e0f2fe" : "transparent",
        boxShadow: isHovered || isClicked ? "0 8px 24px rgba(14, 165, 233, 0.2)" : "none",
        color: "#1a1a1a",
        transition: "all 0.2s ease-in-out",
      }}
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

      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "8px", color: "#1a1a1a" }}>
        {item.title}
      </h3>

      <p style={{ fontSize: "0.9rem", color: "#555555", marginBottom: "6px" }}>
        📍 {item.location}
      </p>

      <p style={{ fontSize: "1rem", color: "#1a1a1a", fontWeight: 600 }}>
        ${item.pricePerDay || item.price}/day
      </p>

      <p style={{ fontSize: "0.9rem", color: "#1a1a1a" }}>
        Deposit: ${item.deposit || 50}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {Array.from({ length: fullStars }).map((_, i) => (
            <svg key={`f-${i}`} width="14" height="14" viewBox="0 0 20 20" fill="#facc15" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1.5l2.4 4.86 5.36.78-3.88 3.78.92 5.34L10 14.9 4.2 16.26l.92-5.34L1.24 7.14l5.36-.78L10 1.5z" />
            </svg>
          ))}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <svg key={`e-${i}`} width="14" height="14" viewBox="0 0 20 20" fill="#cccccc" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1.5l2.4 4.86 5.36.78-3.88 3.78.92 5.34L10 14.9 4.2 16.26l.92-5.34L1.24 7.14l5.36-.78L10 1.5z" />
            </svg>
          ))}
        </div>

        <span style={{ fontSize: "0.95rem", color: "#1a1a1a" }}>{rating.toFixed(1)}</span>
      </div>

      <p style={{ fontSize: "0.85rem", color: "#666666", marginTop: "8px" }}>Listed: {dateListed}</p>
    </div>
  );
};

export default ListingCard;
