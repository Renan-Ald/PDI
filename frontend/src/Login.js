import React, { useState } from 'react';
import { loginUser } from './api'; // Importe a função loginUser do api.js
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      window.location.href = '/'; // Redirecionar para a página de dashboard após login bem-sucedido
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img 
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid" alt="Sample"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                {/* <p className="lead fw-normal mb-0 me-3">Sign in with</p>
                <button type="button" className="btn btn-primary btn-floating mx-1">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button type="button" className="btn btn-primary btn-floating mx-1">
                  <i className="fab fa-twitter"></i>
                </button>
                <button type="button" className="btn btn-primary btn-floating mx-1">
                  <i className="fab fa-linkedin-in"></i>
                </button> */}
              </div>

              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0"></p>
              </div>

              {error && <p className="error-message">{error}</p>}

              <div className="form-group mb-4">
              <label className="form-label" htmlFor="form3Example3">Email address</label>
                <input
                  type="email"
                  id="form3Example3"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
              </div>

              <div className="form-group mb-3">
              <label className="form-label" htmlFor="form3Example4">Password</label>
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div className="form-check mb-0">
                  <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                  <label className="form-check-label" htmlFor="form2Example3">
                    Remember me
                  </label>
                </div>
                <a href="/request-reset-password" className="text-body">Forgot password?</a>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button type="submit" className="btn btn-primary btn-lg"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}>Login</button>
                <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="#!"
                    className="link-danger">Register</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
