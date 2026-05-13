import { Navigate } from "react-router-dom";

import { useAuth } from "../context/useAuth.js";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
