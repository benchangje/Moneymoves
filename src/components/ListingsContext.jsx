import { createContext, useState, useContext, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

const ListingsContext = createContext(null);

export function ListingsProvider({ children }) {

    const [listings, setListings] = useState([
    ]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const unsubscribe = onSnapshot(collection(db, "listings"), (snapshot) => {
            const listingsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setListings(listingsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <ListingsContext.Provider value={{ listings, setListings }}>
            {children}
        </ListingsContext.Provider>
    );
}

export const useListings = () => {
    const context = useContext(ListingsContext);
    if (!context) {
        throw new Error("useListings must be used within a ListingsProvider");
    }
    return context;
};
