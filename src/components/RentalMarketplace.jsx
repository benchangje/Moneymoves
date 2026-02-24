console.log("ViewListings component mounted");

import { useState, useMemo } from "react";
import ListingCard from "./ListingCard";

export default function RentalMarketplace() {
  const [listings, setListings] = useState([
    { id: 1, title: "Canon EF 24-70mm Lens", pricePerDay: 25, dateListed: "2026-02-20", rating: 4.5, image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSMWWfRi8L-0jkfRcPhOsB46-iyakJ6vH6wQnf0JtnBWWlxgLs", location: "Orchard, Singapore", deposit: 200 },
    { id: 2, title: "Winter Jacket - North Face", pricePerDay: 12, dateListed: "2026-02-18", rating: 4.8, image: "https://m.media-amazon.com/images/I/516JTrjCKBL._AC_SY879_.jpg", location: "Marina Bay, Singapore", deposit: 80 },
    { id: 3, title: "Pioneer DJ Speaker System", pricePerDay: 35, dateListed: "2026-02-22", rating: 4.2, image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRyeSYOVREA3srB9bjLoyKFWMhuBBh6mK1oyCmlNkXP4wbMSTFrINna9g41CyYdV_vAzV8GfdY", location: "Clementi, Singapore", deposit: 250 },
  ]);
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("cheapest");

  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  const displayedListings = useMemo(() => {
    const list = [...filteredListings];
    if (sortOption === "cheapest") {
      list.sort((a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0));
    } else if (sortOption === "mostExpensive") {
      list.sort((a, b) => (b.pricePerDay ?? 0) - (a.pricePerDay ?? 0));
    } else if (sortOption === "mostRecent") {
      list.sort((a, b) => {
        const da = a.dateListed ? new Date(a.dateListed).getTime() : 0;
        const db = b.dateListed ? new Date(b.dateListed).getTime() : 0;
        return db - da;
      });
    } else if (sortOption === "highestRating") {
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    return list;
  }, [filteredListings, sortOption]);

  const recommendedListings = useMemo(() => {
    // If user hasn't searched, show a few highlights
    const q = query.trim().toLowerCase();
    if (!q) {
      return [...listings].slice(0, 3);
    }

    // Try to find items with similar names
    const similar = listings.filter((l) => l.title.toLowerCase().includes(q));
    if (similar.length > 0) return similar;

    // Fallback: show top 3 cheapest as reasonable recommendations
    return [...listings].sort((a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0)).slice(0, 3);
  }, [listings, query]);

  return (
    <div className="p-6 pt-12 min-h-screen bg-white text-slate-900">
      <h1 className="text-3xl font-bold mb-6 text-sky-700">Current Listings</h1>

      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        {/* Search input with icon */}
        <div className="relative flex-1 md:w-1/2">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* search icon - small inline SVG */}
            <svg className="h-5 w-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </span>

          <input
            type="search"
            aria-label="Search listings"
            placeholder="Search listings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-sky-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
          />
        </div>

        {/* Sort select with styled chevron */}
        <div className="relative w-full md:w-auto">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            aria-label="Sort listings"
            className="appearance-none bg-gradient-to-r from-sky-600 to-blue-500 border border-transparent text-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
          >
            <option value="cheapest">Cheapest</option>
            <option value="mostRecent">Most recent</option>
            <option value="mostExpensive">Most expensive</option>
            <option value="highestRating">Highest rating</option>
          </select>

          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.12 1L10.56 13.02a.75.75 0 01-1.12 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 items-stretch justify-center">
        {displayedListings.length > 0 ? (
          displayedListings.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))
        ) : (
          <div className="w-full">
            <p className="text-slate-500 mb-4">No listings match your search.</p>

            <h2 className="text-xl font-semibold mb-3 text-sky-700">Recommended for you</h2>
            <div className="flex flex-wrap gap-6">
              {recommendedListings.length > 0 ? (
                recommendedListings.map((rec) => (
                  <ListingCard key={`rec-${rec.id}`} item={rec} />
                ))
              ) : (
                <p className="text-slate-500">No recommendations available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
