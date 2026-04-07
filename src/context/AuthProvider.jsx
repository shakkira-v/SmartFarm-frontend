import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import api from '../api/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data.user);
    } catch (err) {
      console.log("Auth catch error:", err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, refreshProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
