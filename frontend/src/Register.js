
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { register } from './api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cep, setCep] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cpf, setCpf] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register({
        email,
        password,
        nome_completo: nomeCompleto,
        cep,
        telefone,
        endereco,
        cpf
      });
      history.push('/login'); // Redireciona para a página de login após o registro
    } catch (error) {
      console.error('Erro ao registrar:', error);
    }
  };

  return (
    <div className="container mt-5">
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <h2 className="mb-4">Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className=" registro form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Nome Completo:</label>
          <input
            type="text"
            className="form-control"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>CEP:</label>
          <input
            type="text"
            className="form-control"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Telefone:</label>
          <input
            type="text"
            className="form-control"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Endereço:</label>
          <input
            type="text"
            className="form-control"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>CPF:</label>
          <input
            type="text"
            className="form-control"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
