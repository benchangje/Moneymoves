import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, hasFirebaseConfig } from "./firebase";

export const useOwnerProfile = (userId) => {
  const [teleHandle, setTeleHandle] = useState(null);
  const [loading, setLoading] = useState(Boolean(userId));

  useEffect(() => {
    console.log("useOwnerProfile called with userId:", userId);
    console.log("hasFirebaseConfig:", hasFirebaseConfig, "db:", db);

    if (!userId || !hasFirebaseConfig || !db) {
      console.log("Bailing early — missing userId, config, or db");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchOwner = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        console.log("Doc exists?", userSnap.exists());
        if (userSnap.exists()) {
          console.log("Doc data:", userSnap.data());
        }
        if (isMounted && userSnap.exists()) {
          setTeleHandle(userSnap.data().tele_handle || null);
        }
      } catch (err) {
        console.error("Failed to fetch owner profile:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOwner();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { teleHandle, loading };
};