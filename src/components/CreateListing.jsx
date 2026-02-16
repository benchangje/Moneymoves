import { ImagePlus, ChevronDown, ChevronRight, PencilLine, Plug2, Shirt, Handbag, CalendarDays } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function CreateListing() {

    //STATE AND REFS
    const [categoryIsOpen, setCategoryIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Select a category");
    const categories = [
        {label: "Electronics", icon: Plug2},
        {label: "Clothing", icon: Shirt},
        {label: "Lifestyle", icon: Handbag}
    ];
    const categoryRef = useRef(null);

    const [lendingIntervalIsOpen, setLendingIntervalIsOpen] = useState(false);
    const [selectedLendingInterval, setSelectedLendingInterval] = useState("Lending interval");
    const lendingIntervals = ["Day(s)", "Week(s)", "Month(s)"];
    const lendingRef = useRef(null);

    //CLICK OUTSIDE LOGIC FOR DROPDOWNS
    useEffect(() => {
        function handleClickOutside(event) {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setCategoryIsOpen(false); 
            }
            if (lendingRef.current && !lendingRef.current.contains(event.target)) {
                setLendingIntervalIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };}, []);

    return <div className="min-h-screen bg-gradient-to-br from-green-300 to-blue-300 p-8">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6">
                Create Listing
            </h1>
            <div className="bg-white shadow-md rounded-3xl p-8 sm:p-8 lg:p-10">

                {/*TITLE INPUT*/}
                <div className="pb-6 hover:scale-101 transition-all duration-400 ease-out">
                    <input
                        type="text"
                        placeholder="Listing title"
                        onBlur={(text) => text.target.placeholder = "Listing title"}
                        onFocus={(text) => text.target.placeholder = "Enter a title for your listing"}
                        className="w-full bg-gray-200 rounded-2xl px-5 py-3 text-gray-500 placeholder-gray-500 font-medium focus:outline-none focus:placeholder-gray-400 hover:bg-gray-300"
                    />
                </div>

                {/*CATEGORY DROPDOWN*/}
                <div className="relative mb-6 hover:scale-101 transition-all duration-400 ease-out" ref={categoryRef}>
                    <button className={`w-full flex items-center justify-between bg-gray-200 rounded-2xl px-5 py-3 text-base font-medium text-gray-500 hover:bg-gray-300 transition-all duration-400 ease-out`}
                        onClick={() => setCategoryIsOpen(!categoryIsOpen)}>
                        <div className="flex items-center justify-start space-x-4">
                            <div> 
                                {selectedCategory !== "Select a category" && (() => {
                                    const activeItem = categories.find(pair => pair.label === selectedCategory);
                                    const ActiveIcon = activeItem ? activeItem.icon : null;
                                    return ActiveIcon ? <ActiveIcon className={`w-5 h-5 sm:h-5 sm:w-5 ${categoryIsOpen ? "text-black" : "text-gray-500"}`} /> : null;
                                })()}
                            </div>
                            <div className={`${categoryIsOpen ? "text-black" : "text-gray-500"}`}>
                                {selectedCategory}
                            </div>
                        </div>
                        {categoryIsOpen ? (<ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-black"/>) : (<ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500"/>)}
                    </button>
                    <div className={`absolute top-full left-0 z-10 w-full mt-2 bg-gray-200 rounded-2xl overflow-hidden transition-all shadow-md duration-400 ease-out
                        ${categoryIsOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                        <ul className="flex flex-col">
                            {categories.map((category) => (
                                <li key={category.label}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategory(category.label); 
                                            setCategoryIsOpen(false);              
                                        }}
                                        className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-black transition-colors">
                                        {category.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/*IMAGE UPLOAD*/}
                <div className="hover:scale-101 transition-all duration-400 ease-out">
                    <button className="group w-full h-64 border-3 text-gray-500 bg-gray-100 hover:bg-blue-50/50 hover:border-blue-400 hover:text-blue-400 border-dashed border-gray-400 rounded-2xl flex flex-col items-center justify-center text-gray-400 group-hover:shadow-md transition-colors transition-all duration-400 ease-out">
                        <ImagePlus className="w-14 h-14 mb-2 hover:text-blue-500 transition-all transition-colors duration-400 ease-out" />
                        <span className="text-2xl font-base">
                            Drag and drop images here
                        </span>
                    </button>
                </div>

                {/*LENDING DURATION*/}
                <div className="w-full flex-col space-x-8">

                    {/*LENDING INTERVAL DROPDOWN*/}
                    <div className="relative z-20 w-full hover:scale-101 transition-all duration-400 ease-out" ref={lendingRef}>
                        <button className={`w-full bg-gray-200 flex items-center justify-between text-left mt-6 text-gray-500 rounded-2xl px-5 py-3 text-base font-medium hover:bg-gray-300 transition-colors ${lendingIntervalIsOpen ? "border-gray-500" : "border-gray-400"}`} 
                        onClick={() => setLendingIntervalIsOpen(!lendingIntervalIsOpen)}>
                            <div className="flex items-center justify-start space-x-4">
                                <CalendarDays className={`w-5 h-5 sm:h-5 sm:w-5 ${lendingIntervalIsOpen ? "text-black" : "text-gray-500"}`} />
                                <div className={`${lendingIntervalIsOpen ? "text-black" : "text-gray-500"}`}>
                                    {selectedLendingInterval}
                                </div>
                            </div>
                            {lendingIntervalIsOpen ? (<ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-black"/>) : (<ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500"/>)}
                        </button>
                        <div className={`absolute top-full left-0 z-10 w-full mt-2 bg-gray-200 rounded-2xl overflow-hidden transition-all duration-400 
                            ${lendingIntervalIsOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                            <ul className="flex flex-col">
                                {lendingIntervals.map((interval) => (
                                    <li key={interval}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedLendingInterval(interval); 
                                                setLendingIntervalIsOpen(false);              
                                            }}
                                            className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-black transition-colors">
                                            {interval}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/*LENDING PERIOD INPUT*/}
                <div className="w-full mt-6 hover:scale-101 transition-all duration-400 ease-out">           
                    <input
                        type="text"
                        placeholder={`Number of ${selectedLendingInterval === "Lending interval" ? "day(s)" : selectedLendingInterval.toLowerCase()}`}
                        onBlur={(text) => text.target.placeholder = `Number of ${selectedLendingInterval === "Lending interval" ? "day(s)" : selectedLendingInterval.toLowerCase()}`}
                        onFocus={(text) => text.target.placeholder = `Enter the number of ${selectedLendingInterval === "Lending interval" ? "day(s)" : selectedLendingInterval.toLowerCase()}`}
                        className="w-full bg-gray-200 rounded-2xl px-5 py-3 text-base text-gray-500 font-medium placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 hover:bg-gray-300"
                    />
                </div>
            </div>
        </div>
    </div>
}