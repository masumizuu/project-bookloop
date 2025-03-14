import { useEffect, useState } from "react";
import { User } from "../types";
import { getCurrentUser } from "../api/api";

/**
 * Custom hook to fetch the current logged-in user.
 * It tries to fetch the user directly from localStorage first (for faster initial load),
 * and then optionally refetches from the backend for the freshest data.
 */
const useCurrentUser = (refreshFromServer = true) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user from localStorage first (optional optimization)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // Optionally fetch fresh user data from server (useful if profile changed)
    useEffect(() => {
        const fetchUser = async () => {
            if (!refreshFromServer) {
                setLoading(false);
                return;
            }

            try {
                const response = await getCurrentUser();
                const freshUser = response.data;
                setCurrentUser(freshUser);

                // Update localStorage with freshest data
                localStorage.setItem("user", JSON.stringify(freshUser));
            } catch (err) {
                setError("Failed to fetch user data.");
                console.error("Error fetching current user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [refreshFromServer]);

    return { currentUser, loading, error };
};

export default useCurrentUser;
