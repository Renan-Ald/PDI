import React, { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import { loginUser } from './api'; 
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const sr = ScrollReveal();
    sr.reveal('.login-card', {
      origin: 'right',
      distance: '50px',
      duration: 1000,
      reset: true,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      window.location.href = '/'; // Redirecionar para a página inicial após login bem-sucedido
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <section className="vh-100 login">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            {/* Você pode incluir uma imagem aqui, se necessário */}
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 login-card">
            <form onSubmit={handleSubmit}>
              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0"></p>
              </div>

              {error && <p className="error-message">{error}</p>}

              <div className="form-group mb-4">
                <label className="form-label" htmlFor="form3Example3">Endereço de e-mail</label>
                <input
                  type="email"
                  id="form3Example3"
                  className="form-control form-control-lg"
                  placeholder="Insira um e-mail válido"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label" htmlFor="form3Example4">Senha</label>
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Insira sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div className="form-check mb-0">
                  <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                  <label className="form-check-label text-body1" htmlFor="form2Example3">
                    Lembrar de mim
                  </label>
                </div>
                <a href="/request-reset-password" className="text-body1">Esqueceu a senha?</a>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button type="submit" className="btn btn-primary btn-lg"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}>Entrar</button>
                <p className="text-body1 small fw-bold mt-2 pt-1 mb-0">
                  Não tem uma conta? <a href="/register" className="link-danger">Cadastre-se</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
