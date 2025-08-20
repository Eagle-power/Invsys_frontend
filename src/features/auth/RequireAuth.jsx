// import { useLocation, Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "./authSlice";

// const RequireAuth = () => {
//   const user = useSelector(selectCurrentUser);
//   const location = useLocation();

//   if (!user) {
//     // Not logged in
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (user.status === "Pending" && user.role !== 'admin' && location.pathname !== '/pending-approval') {
//     // Logged in, but account is not yet active/assigned
//     return (
//       <Navigate to="/pending-approval" state={{ from: location }} replace />
//     );
//   }

//   // User is logged in and active
//   return <Outlet />;
// };

// export default RequireAuth;

import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, setCredentials } from "./authSlice";
import { useGetMeQuery } from "./authApiSlice";
import { useEffect } from "react";

const RequireAuth = () => {
  const token = localStorage.getItem("token");
  const userInState = useSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useDispatch();

  // This query will run on every protected route load to get the latest user data
  const { data: freshUser, isLoading } = useGetMeQuery(undefined, {
    skip: !token, // Don't run if there's no token at all
  });

  // This effect will run when the fresh user data is fetched
  useEffect(() => {
    if (freshUser) {
      // Update the Redux state with the latest user data from the server
      dispatch(setCredentials({ userInfo: freshUser, token }));
    }
  }, [freshUser, dispatch, token]);

  const user = freshUser || userInState;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Verifying session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.status === "Pending" && user.role !== "admin") {
    return (
      <Navigate to="/pending-approval" state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

export default RequireAuth;
