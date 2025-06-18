
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to auth.html if not authenticated
      window.location.href = '/auth.html';
    }
  }, [user, loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
