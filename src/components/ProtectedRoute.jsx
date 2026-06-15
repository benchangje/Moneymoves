import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useUserProfile } from "./useUserProfile";

export default function ProtectedRoute({ children }) {
    const { user, userProfile } = useAuth();
    const { profile, loading } = useUserProfile(user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return null;
    }

    if (!profile?.profileCompleted) {
        return <Navigate to="/profile_setup" replace />;
    }
    return children;
}