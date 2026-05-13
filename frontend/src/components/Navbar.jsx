import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

const Navbar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-50">
      <h1 className="text-2xl font-bold tracking-wide">Library Management</h1>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <span>
              {user.username} ({user.role})
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
