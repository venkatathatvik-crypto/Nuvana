
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '@/lib/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20"></div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on actual role
        const redirectPath = user.role === 'student' ? '/student' : '/teacher';
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
