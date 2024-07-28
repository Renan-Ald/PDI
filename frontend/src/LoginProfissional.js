// src/LoginProfissional.js
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from './AuthContext';
import api from './api';

const LoginProfissional = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const { loginProfissional } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/avaliador/login/', { email, password });
      const { access, refresh } = response.data;

      // Salva os tokens no localStorage
      localStorage.setItem('profissionalToken', access);
      localStorage.setItem('profissionalRefreshToken', refresh);

      // Atualiza o contexto de autenticação
      loginProfissional(access);

      // Redireciona para a área do avaliador
      history.push('/avaliador');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Credenciais inválidas. Por favor, tente novamente.');
    }
  };

  return (
    <div>
      <h2>Login Profissional</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginProfissional;
