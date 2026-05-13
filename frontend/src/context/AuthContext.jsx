import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);
  };

  // LOGIN
  const login = (userData, token) => {
    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  // LOAD USER FROM STORAGE
  useEffect(() => {
    const validateUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) return;

        const response = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          logout();
          return;
        }

        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.log(error);
        logout();
      }
    };

    validateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
