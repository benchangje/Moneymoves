console.log("ViewListings component mounted");

import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import ListingCard from "./ListingCard";
import { useListings } from "./ListingsContext";

export default function RentalMarketplace() {
  	const { listings } = useListings();
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
		<div className="min-h-screen max-w-7xl mx-auto p-6 px-8 lg:p-8 lg:px-10">
	  		<h1 className="text-3xl font-semibold mb-6 text-gray-900">
				Marketplace
	  		</h1>
			<div className="mb-6 flex flex-row items-center gap-4">
				{/* Search input with icon */}
				<div className="relative flex-1 hover:scale-101 transition-all md:w-1/2">
					<span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						{/* search icon - small inline SVG */}
						<Search className="h-5 w-5 text-gray-400" />
					</span>
					<input
						type="search"
						aria-label="Search listings"
						placeholder="Search listings..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border-gray-300 border-1 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
					/>
				</div>

				{/* Sort select with styled chevron */}
				<div className="relative w-1/6 max-w-40 hover:scale-101 transition-all shrink-0">
					<select
						value={sortOption}
						onChange={(e) => setSortOption(e.target.value)}
						aria-label="Sort listings"
						className="w-full appearance-none bg-blue-600 border border-transparent text-white pl-4 pr-10 py-2 rounded-lg shadow-sm focus:outline-none cursor-pointer"
					>
						<option value="cheapest">Cheapest</option>
						<option value="mostRecent">Most recent</option>
						<option value="mostExpensive">Most expensive</option>
						<option value="highestRating">Highest rating</option>
					</select>
					<ChevronDown className="absolute h-5 w-5 right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-white" />
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
