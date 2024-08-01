import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from './AuthContext';
import { loginProfissional } from './api'; 
const LoginProfissional = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const history = useHistory();
  const { loginProfissional: updateAuth } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await loginProfissional(email, senha);
      const { access, refresh } = data;

      // Salva os tokens no localStorage
      localStorage.setItem('profissionalToken', access);
      localStorage.setItem('profissionalRefreshToken', refresh);

      // Atualiza o contexto de autenticação
      if (updateAuth) {
        updateAuth(data); 
      } else {
        console.error('updateAuth não está definido');
      }

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
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginProfissional;
