import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './authSlice';

const RequireAuth = () => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  return user ? (
    // If the user is logged in, show the child component (like the DashboardLayout)
    <Outlet />
  ) : (
    // If not logged in, redirect to the login page
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;