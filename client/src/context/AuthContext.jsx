import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");
      if (!storedToken) return;

      try {
        const response = await axios.get("http://localhost:3000/api/v1/user/currentUser", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setIsLoggedIn(true);
          setUser(response.data.data);
          if (response.data.data.role === "admin") {
            navigate("/admin");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err.response?.data || err.message);
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkAuth();
  }, [navigate]);

  const login = async (credentials) => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/login", credentials, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const token = response.data.data.accessToken;
        localStorage.setItem("accessToken", token);
        setIsLoggedIn(true);
        setUser(response.data.data.user);

        if (response.data.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
        return true;
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:3000/api/v1/user/logout", {}, {
        withCredentials: true,
      });
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
