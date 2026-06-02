import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Filter from "./Filter.jsx";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import ListingCard from "./ListingCard.jsx";

export default function RentalMarketplace() {

    const [showFilter, setShowFilter] = useState(false);
  	const [listings, setListings] = useState([
		{ id: 1, title: "Canon EF 24-70mm Lens", pricePerDay: 25, dateListed: "2026-02-20", rating: 4.5, image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSMWWfRi8L-0jkfRcPhOsB46-iyakJ6vH6wQnf0JtnBWWlxgLs", location: "Orchard, Singapore", deposit: 0 },
		{ id: 2, title: "Winter Jacket - North Face", pricePerDay: 12, dateListed: "2026-02-18", rating: 4.8, image: "https://m.media-amazon.com/images/I/516JTrjCKBL._AC_SY879_.jpg", location: "Marina Bay, Singapore", deposit: 80 },
		{ id: 3, title: "Pioneer DJ Speaker System", pricePerDay: 35, dateListed: "2026-02-22", rating: 4.2, image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRyeSYOVREA3srB9bjLoyKFWMhuBBh6mK1oyCmlNkXP4wbMSTFrINna9g41CyYdV_vAzV8GfdY", location: "Clementi, Singapore", deposit: 250 },
  	]);
	const [query, setQuery] = useState("");
	const [filters, setFilters] = useState({
		sortOption: "",
		minPrice: "",
		maxPrice: "",
		depositRequired: false
	});
    const navigate = useNavigate();

	const filteredListings = listings.filter((item) =>
		item.title.toLowerCase().includes(query.trim().toLowerCase())
	);

  	const displayedListings = useMemo(() => {
		let list = [...filteredListings];
		// PRICE FILTERS
		if (filters.minPrice !== "") {
			list = list.filter(
				(item) => item.pricePerDay >= Number(filters.minPrice)
			);
		}
		if (filters.maxPrice !== "") {
			list = list.filter(
				(item) => item.pricePerDay <= Number(filters.maxPrice)
			);
		}
		// SORTING
		if (filters.sortOption === "lowest") {
			list.sort(
				(a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0)
			);
		} else if (filters.sortOption === "highest") {
			list.sort(
				(a, b) => (b.pricePerDay ?? 0) - (a.pricePerDay ?? 0)
			);
		} else if (filters.sortOption === "recent") {
			list.sort((a, b) => {
				const da = a.dateListed
					? new Date(a.dateListed).getTime()
					: 0;

				const db = b.dateListed
					? new Date(b.dateListed).getTime()
					: 0;
				return db - da;
			});
		} 
		if (filters.depositRequired) {
			list = list.filter(
				(item) => item.deposit > 0
			);
		}
		return list;
	}, [filteredListings, filters]);

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
		<div className="min-h-screen max-w-7xl mx-auto p-6 px-8 lg:p-8 lg:px-10">
	  		<h1 className="text-3xl font-semibold mb-6 text-gray-900">
				Marketplace
	  		</h1>
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

                {/* Sort select with styled chevron */}
				<button onClick={() => setShowFilter(true)} className="relative shrink-0 pl-6 lg:pl-8">
					<SlidersHorizontal className="absolute h-5 w-5 right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400" />
				</button>
			</div>

			<div className="flex flex-wrap gap-6 items-stretch justify-center">
				{displayedListings.length > 0 ? ( 
				displayedListings.map((item) => (
					<ListingCard key={item.id} item={item} />
				))
				) : (
				<div className="w-full">
					<p className="text-slate-500 mb-4">No listings match your search.</p>
					<h2 className="text-xl font-semibold mb-3 text-gray-800">Recommended for you</h2>
					<div className="flex flex-wrap gap-6">
						{recommendedListings.length > 0 ? (
							recommendedListings.map((rec) => (
							<ListingCard key={`rec-${rec.id}`} item={rec} />
							))
						) : (
						<p className="text-gray-800">No recommendations available.</p>
						)}
					</div>
				</div>
				)}
	 		 </div>
             <AnimatePresence>
                {showFilter && (
                    <Filter
						onClose={() => setShowFilter(false)}
						onApply={(newFilters) => {setFilters(newFilters);}}
					/>
                )}
            </AnimatePresence>
		</div>
    );
}
