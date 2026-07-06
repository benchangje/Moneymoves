import { useState } from "react";
import { X } from "lucide-react";

export default function Filter({ onClose, onApply }) {

    // Sort option
    const [sortOption, setSortOption] = useState("");

    // Price filter
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // Deposit filter
    const [depositRequired, setDepositRequired] = useState(false);

    // Check if form is valid
    const isFormValid = 
    sortOption !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    depositRequired 

    const [isApplying, setIsApplying] = useState(false);

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsApplying(true);
        const filters = {
            sortOption,
            minPrice,
            maxPrice,
            depositRequired
        };
        console.log(filters);
        if (onApply) {
            onApply(filters);
        }
        setTimeout(() => {
            setIsApplying(false);
            onClose();
        }, 300);
    };

    return (
        <div className="fixed inset-0 z-60">
            <div className="absolute inset-0 bg-black/40" />
            <div className="w-full h-full flex items-center justify-center">
                <div className="absolute w-3/4 bg-white p-6 pt-4 shadow-2xl rounded-xl">
                    <div className="relative flex justify-center items-center mb-6">
                        <button
                            onClick={onClose}
                            className="absolute left-0"
                        >
                            <X className="text-gray-900 hover:text-gray-400 transition-all duration-300 ease-in-out"/> 
                        </button>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Filter & Sort
                        </h2>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-sm font-medium text-gray-600 mb-3 ml-1 underline">
                                Sort By
                            </h3>
                            <div className="flex flex-wrap gap-3 mb-3">
                                {[
                                    {label: "Price: Low to High", value: "lowest"},
                                    {label: "Price: High to Low", value: "highest"},
                                    {label: "Most Recent", value: "recent"}].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setSortOption(option.value)}
                                        className={`px-4 py-2 rounded-xl border transition-all duration-300
                                            ${sortOption === option.value
                                                ? "bg-gray-800 text-white border-gray-900"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                                            }`
                                        }
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 mb-3 ml-1 underline">
                                    Deposit
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setDepositRequired(!depositRequired)}
                                    className={`
                                        px-4 py-2 rounded-xl border transition-all duration-300
                                        ${depositRequired
                                            ? "bg-gray-800 text-white border-gray-900"
                                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                                        }
                                    `}
                                >
                                    Deposit Required
                                </button>
                            </div>
                        </div>
                        <div className="w-full hover:scale-101 transition-all duration-400 ease-out">
                            <p className="absolute ml-5 mt-3 text-gray-400 text-base">
                                S$
                            </p>
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="min. Price"
                                onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                className="w-full bg-[#eceef2] rounded-xl px-12 py-3 text-base text-gray-400 focus:text-gray-600 placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 hover:bg-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="w-full mt-6 hover:scale-101 transition-all duration-400 ease-out">
                            <p className="absolute ml-5 mt-3 text-gray-400 text-base">
                                S$
                            </p>
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="max. Price"
                                onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                className="w-full bg-[#eceef2] rounded-xl px-12 py-3 text-base text-gray-400 focus:text-gray-600 placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 hover:bg-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!isFormValid || isApplying}
                            className={`
                                px-5 py-3 rounded-xl text-white transition-all duration-300
                                ${isFormValid
                                    ? "bg-gray-800 hover:bg-gray-700"
                                    : "bg-gray-400 cursor-not-allowed"
                                }
                            `}
                        >
                            {isApplying ? "Applying..." : "Apply Filters"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}