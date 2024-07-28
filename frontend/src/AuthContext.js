// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null });
  const [profissional, setProfissional] = useState({ token: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth({ token });
    }

    const profissionalToken = localStorage.getItem('profissionalToken');
    if (profissionalToken) {
      setProfissional({ token: profissionalToken });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.access);
    setAuth({ token: data.access });
  };

  const loginProfissional = (data) => {
    localStorage.setItem('profissionalToken', data.access);
    setProfissional({ token: data.access });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null });
  };

  const logoutProfissional = () => {
    localStorage.removeItem('profissionalToken');
    setProfissional({ token: null });
  };

  return (
    <AuthContext.Provider value={{ auth, profissional, login, loginProfissional, logout, logoutProfissional }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
