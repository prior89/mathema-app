import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSplash } from './Brand';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <LoadingSplash />;
  if (!user) {
    // 미인증 → /login 으로 (원래 경로 state 로 보존, 로그인 후 복귀).
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
