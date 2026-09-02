import { createContext, useContext, useState } from "react";
import { loginUser, createUser } from "../services/UserService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      const userData = response.data.user || response.data;

      setUser(userData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      return { user: userData, token: response.data.token };
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await createUser(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);