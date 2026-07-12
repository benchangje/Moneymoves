import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Filter from "./Filter.jsx";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ListingCard from "./ListingCard.jsx";
import { useListings } from "../hooks/useListings";

export default function RentalMarketplace() {
    const [showFilter, setShowFilter] = useState(false);
    const { listings: marketplaceListings, loading: listingsLoading } = useListings({ publishedOnly: true });
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState({
        sortOption: "",
        minPrice: "",
        maxPrice: "",
        depositRequired: false,
    });
    const navigate = useNavigate();

    const normalizedListings = useMemo(
    () =>
        marketplaceListings.map((listing) => ({
            id: listing.id,
            ownerUid: listing.ownerUid,
            ownerName: listing.ownerName,
            title: listing.title,
            category: listing.category || "",
            description: listing.description || "",
            pricePerDay: Number(listing.price ?? 0),
            dateListed: listing.createdAt
                ? new Date(listing.createdAt).toISOString().split("T")[0]
                : "",
            image: listing.image || "",
            images: listing.images || [],
            location: listing.location || "Location not provided",
            deposit: Number(listing.deposit ?? 0),
        })),
    [marketplaceListings]
    );

    const filteredListings = normalizedListings.filter((item) =>
        item.title.toLowerCase().includes(query.trim().toLowerCase())
    );

    const displayedListings = useMemo(() => {
        let list = [...filteredListings];

        if (filters.minPrice !== "") {
            list = list.filter((item) => item.pricePerDay >= Number(filters.minPrice));
        }
        if (filters.maxPrice !== "") {
            list = list.filter((item) => item.pricePerDay <= Number(filters.maxPrice));
        }
        if (filters.category) {
            list = list.filter((item) => item.category === filters.category);
        }
        if (filters.sortOption === "lowest") {
            list.sort((a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0));
        } else if (filters.sortOption === "highest") {
            list.sort((a, b) => (b.pricePerDay ?? 0) - (a.pricePerDay ?? 0));
        } else if (filters.sortOption === "recent") {
            list.sort((a, b) => {
                const da = a.dateListed ? new Date(a.dateListed).getTime() : 0;
                const db = b.dateListed ? new Date(b.dateListed).getTime() : 0;
                return db - da;
            });
        }

        if (filters.depositRequired) {
            list = list.filter((item) => item.deposit > 0);
        }

        return list;
    }, [filteredListings, filters]);

    const recommendedListings = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            return [...normalizedListings].slice(0, 3);
        }

        const similar = normalizedListings.filter((l) => l.title.toLowerCase().includes(q));
        if (similar.length > 0) return similar;

        return [...normalizedListings]
            .sort((a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0))
            .slice(0, 3);
    }, [normalizedListings, query]);

    return (
        <div className="min-h-screen max-w-7xl mx-auto p-6 lg:p-8">
            <h1 className="text-3xl font-semibold mb-6 text-gray-900">Marketplace</h1>
            <div className="mb-6 flex flex-row items-center gap-4">
                <div className="group relative flex-1 hover:scale-101 transition-all duration-300 md:w-1/2">
                    <input
                        type="search"
                        placeholder="Search listings..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="peer w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all duration-300 ease-out [&::-webkit-search-cancel-button]:appearance-none"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 peer-focus:text-gray-600 transition-all duration-300 ease-out" />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                        >
                            <X className="h-5 w-5 absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 group-focus-within:text-gray-700 transition" />
                        </button>
                    )}
                </div>

                <button onClick={() => setShowFilter(true)} className="relative shrink-0 pl-6 lg:pl-8">
                    <SlidersHorizontal className="absolute h-5 w-5 right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400" />
                </button>
            </div>

            {listingsLoading ? (
                <div className="text-slate-500">Loading listings...</div>
            ) : (
                <div className="flex flex-wrap gap-6 items-stretch justify-center">
                    {displayedListings.length > 0 ? (
                        displayedListings.map((item) => <ListingCard key={item.id} item={item} />)
                    ) : (
                        <div className="w-full">
                            <p className="text-slate-500 mb-4">No listings match your search.</p>
                            <h2 className="text-xl font-semibold mb-3 text-gray-800">Recommended for you</h2>
                            <div className="flex flex-wrap gap-6">
                                {recommendedListings.length > 0 ? (
                                    recommendedListings.map((rec) => <ListingCard key={`rec-${rec.id}`} item={rec} />)
                                ) : (
                                    <p className="text-gray-800">No recommendations available.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showFilter && (
                <Filter
                    onClose={() => setShowFilter(false)}
                    onApply={(newFilters) => {
                        setFilters(newFilters);
                    }}
                />
            )}
        </div>
    );
}
