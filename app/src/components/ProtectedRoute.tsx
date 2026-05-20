import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSplash } from './Brand';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <LoadingSplash />;
  if (!user) {
    // Unauth → /login (preserve target so we return here after sign-in).
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  // Google sign-up creates users without a class. Force them through the
  // NCERT picker (CLASS_7..CLASS_12) before /app/* is reachable.
  if (!user.gradeLevel) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}
