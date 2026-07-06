import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from "../hooks/useUserProfile";

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();
    const { profile, loading } = useUserProfile(user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return (
            <div className="loading-screen">
                <p>Verifying profile status...</p>
            </div>
        ); 
    }

    if (!profile?.profileCompleted) {
        return <Navigate to="/profile_setup" replace />;
    }

    return children;
}
