import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { register } from './api';
import './Register.css';
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cep, setCep] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [endereco2, setEndereco2] = useState('');
  const [estado, setEstado] = useState('');
  const [pais, setPais] = useState('');
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
        endereco2,
        estado,
        pais,
        cpf,
      });
      history.push('/login'); // Redireciona para a página de login após o registro
    } catch (error) {
      console.error('Erro ao registrar:', error);
    }
  };

  return (
    <div className="formbold-main-wrapper">
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <div className="formbold-form-wrapper">
         <h2 class="">Register now</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="formbold-input-flex">
            <div className="form-group">
              <label className="formbold-form-label">Nome Completo:</label>
              <input
                type="text"
                className="formbold-form-input"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="formbold-form-label">CPF:</label>
              <input
                type="text"
                className="formbold-form-input"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="formbold-input-flex">
            <div className="form-group">
              <label className="formbold-form-label">Email:</label>
              <input
                type="email"
                className="formbold-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="formbold-form-label">Senha:</label>
              <input
                type="password"
                className="formbold-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="formbold-input-flex">
            <div className="form-group">
              <label className="formbold-form-label">CEP:</label>
              <input
                type="text"
                className="formbold-form-input"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="formbold-form-label">Telefone:</label>
              <input
                type="text"
                className="formbold-form-input"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="formbold-form-label">Endereço:</label>
            <input
              type="text"
              className="formbold-form-input"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="formbold-form-label">Endereço 2 (opcional):</label>
            <input
              type="text"
              className="formbold-form-input"
              value={endereco2}
              onChange={(e) => setEndereco2(e.target.value)}
            />
          </div>
          <div className="formbold-input-flex">
            <div className="form-group">
              <label className="formbold-form-label">Estado:</label>
              <input
                type="text"
                className="formbold-form-input"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="formbold-form-label">País:</label>
              <input
                type="text"
                className="formbold-form-input"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="formbold-checkbox-wrapper">
            <label className="formbold-checkbox-label">
              <input
                 type="checkbox"
                required
              />  Eu concordo com os <a href="#">termos, condições e políticas</a>.
            </label>
          </div>
          <button type="submit" className="formbold-btn">Registrar</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
