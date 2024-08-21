// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null });
  const [profissional, setProfissional] = useState({ token: null, user_id: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth({ token });
    }

    const profissionalToken = localStorage.getItem('profissionalToken');
    const profissionalId = localStorage.getItem('profissionalId');
    if (profissionalToken && profissionalId) {
      setProfissional({ token: profissionalToken, user_id: profissionalId });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.access);
    setAuth({ token: data.access });
  };

  const loginProfissional = (data) => {
    localStorage.setItem('profissionalToken', data.access);
    localStorage.setItem('profissionalId', data.user_id); // Supondo que data contenha user_id
    setProfissional({ token: data.access, user_id: data.user_id });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null });
  };

  const logoutProfissional = () => {
    localStorage.removeItem('profissionalToken');
    localStorage.removeItem('profissionalId');
    setProfissional({ token: null, user_id: null });
  };

  return (
    <AuthContext.Provider value={{ auth, profissional, login, loginProfissional, logout, logoutProfissional }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
