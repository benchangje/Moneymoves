console.log("ViewListings component mounted");

import { useState } from "react";
import ListingCard from "./ListingCard";


export default function RentalMarketplace() {
  const [listings, setListings] = useState([
    { id: 1, title: "iPhone 13", price: 700 },
  ]);

    return (
    <div className="p-6 pt-12">
        <h1 className="text-3xl font-bold mb-6">View Listings Page</h1>
        <div className="flex flex-wrap gap-6">
        {listings.map((item) => (
            <ListingCard key={item.id} item={item} />
        ))}
        </div>
    </div>
    );

}
