import { ChevronDown, ChevronRight, Plug2, Shirt, Handbag, CalendarDays, MapPinPen } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ImageDropzone from "./ImageDropzone";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";

export default function CreateListing() {

    //STATE AND REFS
    const [listingTitle, setListingTitle] = useState("");

    const [categoryIsOpen, setCategoryIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Select a category");
    const categories = [
        {label: "Electronics", icon: Plug2},
        {label: "Clothing", icon: Shirt},
        {label: "Lifestyle", icon: Handbag}
    ];
    const categoryRef = useRef(null);

    const [imageFile, setImageFile] = useState(null);

    const [lendingIntervalIsOpen, setLendingIntervalIsOpen] = useState(false);
    const [selectedLendingInterval, setSelectedLendingInterval] = useState("Lending interval");
    const lendingIntervals = ["Day", "Week", "Month"];
    const lendingRef = useRef(null);

    const [price, setPrice] = useState("");
    const [deposit, setDeposit] = useState("");
    const [description, setDescription] = useState("");

    const existingLocations = [
        "COM1 Level 2 (SoC)",
        "UTown Starbucks",
        "Central Library Forum"
    ];

    const [locationIsOpen, setLocationIsOpen] = useState(false);
    const [selectedLocationOption, setSelectedLocationOption] = useState('Select a meet-up location');
    const locationRef = useRef(null);

    const isLocationValid = selectedLocationOption.trim() !== "";

    const finalLocation = selectedLocationOption;

    const isFormValid = 
        listingTitle.trim() !== "" &&
        selectedCategory !== "Select a category" &&
        imageFile && imageFile.length > 0 &&
        selectedLendingInterval !== "Lending interval" &&
        price.trim() !== "" &&
        deposit.trim() !== "" &&
        description.trim() !== "" &&
        isLocationValid;

    const [submit, setSubmit] = useState(false);

    const [isUploading, setIsUploading] = useState(false);

    // This translates the image file into a Base64 text string
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
            });
        };

    const handleUpload = async (e) => {
        e.preventDefault(); 
        setIsUploading(true);

        try {
        // 1. Loop through ALL uploaded images and convert them to Base64
        // Promise.all ensures we wait for every single image to finish converting before moving on
        const processedImages = await Promise.all(
            imageFile.map(async (file) => {
                const base64String = await fileToBase64(file);
                return {
                    name: file.name,
                    mimeType: file.type,
                    base64: base64String
                };
            })
        );
        
        // 2. Packaging all states into a FormData object
        const formData = new FormData();
        formData.append("title", listingTitle);
        formData.append("category", selectedCategory);
        formData.append("interval", selectedLendingInterval);
        formData.append("price", price);
        formData.append("deposit", deposit);
        formData.append("location", finalLocation);
        formData.append("description", description);

        // 3. Append the processed images as a JSON string
        formData.append("images", JSON.stringify(processedImages));

        // 4. Send the POST request to the Google Apps Script endpoint
        await fetch("https://script.google.com/macros/s/AKfycbwL5usnGqzMPuZycFp7jhPwwGCfcECWu_BQ12Eem6_HLfCH9AAPJg2OFjfKxiGUQv--sw/exec", {
            method: "POST",
            body: formData,
            mode: "no-cors" 
        });

        // 5. Show the confetti and success message
        setSubmit(true);

        // Catch errors
        } catch (error) {
            console.error("Error saving data:", error);
            alert("There was an issue uploading your images. Please try again.");
        } finally {
            setIsUploading(false); 
        }
    };

    //CLICK OUTSIDE LOGIC FOR DROPDOWNS
    useEffect(() => {
        function handleClickOutside(event) {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setCategoryIsOpen(false); 
            }
            if (lendingRef.current && !lendingRef.current.contains(event.target)) {
                setLendingIntervalIsOpen(false);
            }
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setLocationIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };}, []);

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl pl-2 sm:pl-4 lg:pl-6 text-gray-600 font-semibold mb-2">
                    Create Listing
                </h1>
                <div className="bg-white rounded-3xl p-2 sm:p-4 lg:p-6">
                <form onSubmit={handleUpload} className="w-full">
                    {/*TITLE INPUT*/}
                    <div className="pb-6 hover:scale-101 transition-all duration-400 ease-out">
                        <input
                            type="text"
                            placeholder="Listing title"
                            value={listingTitle}
                            onChange={(e) => setListingTitle(e.target.value)}
                            onBlur={(e) => e.target.placeholder = "Listing title"}
                            onFocus={(e) => e.target.placeholder = "Enter a title for your listing"}
                            className="w-full bg-gray-200 rounded-2xl px-5 py-3 text-gray-500 placeholder-gray-500 font-medium focus:outline-none focus:placeholder-gray-400 hover:bg-gray-300"
                        />
                    </div>

                    {/*CATEGORY DROPDOWN*/}
                    <div className="relative z-30 mb-6 hover:scale-101 transition-all duration-400 ease-out" ref={categoryRef}>
                        <button 
                            type="button"
                            className={`w-full flex items-center justify-between bg-gray-200 rounded-2xl px-4 py-3 text-base font-medium text-gray-500 hover:bg-gray-300 transition-all duration-400 ease-out`}
                            onClick={() => setCategoryIsOpen(!categoryIsOpen)}
                        >
                            <div className="flex items-center justify-between gap-4">
                                {selectedCategory !== "Select a category" && (() => {
                                    const activeItem = categories.find(pair => pair.label === selectedCategory);
                                    const ActiveIcon = activeItem ? activeItem.icon : null;
                                    return ActiveIcon ? <ActiveIcon className={`w-5 h-5 sm:h-5 sm:w-5 ${categoryIsOpen ? "text-gray-700" : "text-gray-500"}`} /> : null;
                                })()}
                                <div className={`${categoryIsOpen ? "text-gray-700" : "text-gray-500"}`}>
                                    {selectedCategory}
                                </div>
                            </div>
                            {categoryIsOpen ? (<ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700"/>) : (<ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500"/>)}
                        </button>
                        <div className={`absolute top-full left-0  w-full mt-2 bg-gray-200 rounded-2xl font-medium overflow-hidden transition-all shadow-md duration-400 ease-out
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
                                            className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                                            {category.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/*IMAGE UPLOAD*/}
                    <div className="w-full h-64 transition-all duration-400 ease-out w-full h-full flex items-center justify-center rounded-2xl">
                        <ImageDropzone onImageSelect={(file) => setImageFile(file)} />
                    </div>

                    {/*LENDING DURATION*/}
                    <div className="w-full flex-col space-x-8">

                        {/*LENDING INTERVAL DROPDOWN*/}
                        <div className="relative z-20 w-full hover:scale-101 transition-all duration-400 ease-out" ref={lendingRef}>
                            <button 
                                type="button"
                                className={`w-full bg-gray-200 flex items-center justify-between text-left mt-6 text-gray-500 rounded-2xl px-5 py-3 text-base font-medium hover:bg-gray-300 transition-colors ${lendingIntervalIsOpen ? "border-gray-500" : "border-gray-400"}`} 
                                onClick={() => setLendingIntervalIsOpen(!lendingIntervalIsOpen)}
                            >
                                <div className="flex items-center justify-start space-x-4">
                                    <CalendarDays className={`w-5 h-5 sm:h-5 sm:w-5 ${lendingIntervalIsOpen ? "text-gray-700" : "text-gray-500"}`} />
                                    <div className={`${lendingIntervalIsOpen ? "text-gray-700" : "text-gray-500"}`}>
                                        {selectedLendingInterval}
                                    </div>
                                </div>
                                {lendingIntervalIsOpen ? (<ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700"/>) : (<ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500"/>)}
                            </button>
                            <div className={`absolute top-full left-0 z-10 w-full mt-2 bg-gray-200 rounded-2xl font-medium overflow-hidden transition-all shadow-md duration-400 
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
                                                className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                                                {interval}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/*PRICE INPUT*/}
                    <div className="w-full mt-6 hover:scale-101 transition-all duration-400 ease-out">
                        <span className="absolute ml-5 mt-3 text-gray-500 text-base font-medium">
                            S$
                        </span>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder={`Rental price per ${selectedLendingInterval === "Lending interval" ? "Day" : selectedLendingInterval}`}
                            onBlur={(e) => e.target.placeholder = `Rental price per ${selectedLendingInterval === "Lending interval" ? "Day" : selectedLendingInterval}`}
                            onFocus={(e) => e.target.placeholder = `Enter a rental price per ${selectedLendingInterval === "Lending interval" ? "Day" : selectedLendingInterval} for your listing`}
                            onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                            className="w-full bg-gray-200 rounded-2xl px-14 py-3 text-base text-gray-500 font-medium placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 hover:bg-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>

                    {/*DEPOSIT AMOUNT*/}
                    <div className="w-full mt-6 hover:scale-101 transition-all duration-400 ease-out">
                        <span className="absolute ml-5 mt-3 text-gray-500 text-base font-medium">
                            S$
                        </span>
                        <input
                            type="number"
                            value={deposit}
                            onChange={(e) => setDeposit(e.target.value)}
                            placeholder={`Deposit amount`}
                            onBlur={(e) => e.target.placeholder = `Deposit amount`}
                            onFocus={(e) => e.target.placeholder = `Enter a deposit amount for your listing`}
                            onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                            className="w-full bg-gray-200 rounded-2xl px-14 py-3 text-base text-gray-500 font-medium placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 hover:bg-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>

                    {/*MEET-UP LOCATION DROPDOWN*/}
                    <div className="w-full flex-col space-x-8">
                        <div className="relative hover:scale-101 transition-all duration-400 ease-out z-10 text-gray-600 mt-6 font-medium text-base" ref={locationRef}>
                            <button 
                                type="button" 
                                className={`w-full flex items-center justify-between bg-gray-200 rounded-2xl px-4 py-3 text-base font-medium text-gray-500 hover:bg-gray-300 transition-all duration-400 ease-out`} 
                                onClick={() => setLocationIsOpen(!locationIsOpen)}
                            >
                                <div className="flex items-center justify-start space-x-4">
                                    <MapPinPen className={`w-5 h-5 sm:h-5 sm:w-5 ${locationIsOpen ? "text-gray-700" : "text-gray-500"}`} />
                                    <div className={`${locationIsOpen ? "text-gray-700" : "text-gray-500"}`}>
                                        {selectedLocationOption}
                                    </div>
                                </div>
                                {locationIsOpen ? (<ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700"/>) : (<ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500"/>)}
                            </button>
                        <div className={`absolute top-full left-0 z-10 w-full mt-2 bg-gray-200 rounded-2xl font-medium overflow-hidden transition-all shadow-md duration-400 
                                ${locationIsOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                                <ul className="flex flex-col">
                                    {existingLocations.map((interval) => (
                                        <li key={interval}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedLocationOption(interval); 
                                                    setLocationIsOpen(false);              
                                                }}
                                                className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                                                {interval}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/*ITEM DESCRIPTION INPUT*/}
                    <div className="w-full mt-6 hover:scale-101 transition-all duration-400 ease-out">
                        <textarea
                            placeholder="Item description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={2000}
                            onBlur={(e) => e.target.placeholder = "Item description"}
                            onFocus={(e) => e.target.placeholder = "Enter a description for your listing"}
                            className="w-full block bg-gray-200 rounded-2xl px-5 py-3 text-base text-gray-500 font-medium placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 hover:bg-gray-300 resize-none h-48"
                        />
                    </div>
                        
                    {/*UPLOAD LISTING BUTTON*/}
                    <div className="w-full mt-6 hover:scale-101 transition-all duration-400 ease-out">
                        <button 
                            disabled={!isFormValid || isUploading}
                            type="submit"
                            className={`w-full ${isFormValid && !isUploading ? "bg-blue-500 hover:bg-blue-400" : "bg-gray-400 cursor-not-allowed"} text-white font-medium px-5 py-3 rounded-2xl transition-colors`}
                        >
                            {isUploading ? "Uploading..." : "Upload Listing"}
                        </button>
                    </div>
                    </form>

                    {submit &&
                        <div className="fixed inset-0 w-full h-full z-40 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm transition-all duration-400">
                            <Confetti 
                                recycle={false} 
                                numberOfPieces={300} 
                                gravity={0.2}
                            />
                            {imageFile && imageFile.length > 0 && (
                                <div className="mb-6 w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                                    <img 
                                        src={imageFile[0].preview} 
                                        alt="Uploaded Item" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <h1 className="text-3xl font-bold text-blue-500 mb-3">Congratulations!</h1>
                            <h2 className="text-2xl font-bold text-gray-600 mb-3">Listing Uploaded Successfully!</h2>
                            <p className="font-medium text-gray-600">Your item is now available for rent.</p>
                            <div className="mt-4 inline-block bg-blue-500 hover:bg-blue-400 hover:scale-101 text-white text-lg font-medium py-3 px-6 rounded-2xl transition-all duration-400">
                                <Link to="/">
                                    Return to Marketplace
                                </Link>
                            </div>
                        </div>
                    }

                </div>
            </div>
        </div>
        )
    }