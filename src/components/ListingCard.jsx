const ListingCard = ({ item }) => {
  const imageUrl =
    item.image ||
    `https://via.placeholder.com/320x180.png?text=${encodeURIComponent(
      item.title || "Listing"
    )}`;

  const dateListed =
    item.dateListed ||
    new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const rating = typeof item.rating === "number" ? item.rating : 4.0; // placeholder default

  return (
    <div
      style={{
        border: "1px solid rgba(14,165,233,0.12)", // subtle blue border
        borderRadius: "10px",
        padding: "16px",
        margin: "12px",
        background: "linear-gradient(180deg, rgba(2,6,23,0.6), rgba(7,18,35,0.6))", // dark card gradient
        boxShadow: "0 8px 24px rgba(2,6,23,0.6)",
        maxWidth: "260px",
        color: "#e6f6ff", // light blue-ish text
      }}
    >
      <img
        src={imageUrl}
        alt={item.title || "Listing image"}
        style={{
          width: "100%",
          height: "140px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "10px",
          backgroundColor: "#0b1220",
        }}
      />
      <h3 style={{ fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px", color: "#dbeafe" }}>
        {item.title}
      </h3>
      <p style={{ fontSize: "1rem", color: "#bfdbfe" }}>${item.price}</p>

      {/* rating row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
          {/* simple star SVG repeated to give a visual, filled proportionally could be added later */}
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#facc15" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.5l2.4 4.86 5.36.78-3.88 3.78.92 5.34L10 14.9 4.2 16.26l.92-5.34L1.24 7.14l5.36-.78L10 1.5z" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#facc15" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.5l2.4 4.86 5.36.78-3.88 3.78.92 5.34L10 14.9 4.2 16.26l.92-5.34L1.24 7.14l5.36-.78L10 1.5z" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#facc15" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.5l2.4 4.86 5.36.78-3.88 3.78.92 5.34L10 14.9 4.2 16.26l.92-5.34L1.24 7.14l5.36-.78L10 1.5z" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#facc15" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.5l2.4 4.86 5.36.78-3.88 3.78.92 5.34L10 14.9 4.2 16.26l.92-5.34L1.24 7.14l5.36-.78L10 1.5z" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#94a3b8" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.5l2.4 4.86 5.36.78-3.88 3.78.92 5.34L10 14.9 4.2 16.26l.92-5.34L1.24 7.14l5.36-.78L10 1.5z" />
          </svg>
        </div>
        <span style={{ fontSize: "0.95rem", color: "#dbeafe" }}>{rating.toFixed(1)}</span>
      </div>

      <p style={{ fontSize: "0.85rem", color: "#93c5fd", marginTop: "8px" }}>
        Listed: {dateListed}
      </p>
    </div>
  );
};

export default ListingCard;
