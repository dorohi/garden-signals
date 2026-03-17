import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = observer(({ children }: ProtectedRouteProps) => {
  const { authStore } = useStore();

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
});

export default ProtectedRoute;
