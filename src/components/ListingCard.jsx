const ListingCard = ({ item }) => {
  return (
    <div style={{
      border: "2px solid black",
      borderRadius: "8px",
      padding: "20px",
      margin: "15px",
      backgroundColor: "#fef3c7", // light yellow
      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
      maxWidth: "250px"
    }}>
      <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "10px" }}>
        {item.title}
      </h3>
      <p style={{ fontSize: "1rem" }}>${item.price}</p>
    </div>
  );
};


export default ListingCard;
