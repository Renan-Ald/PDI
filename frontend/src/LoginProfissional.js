import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from './AuthContext';
import { loginProfissional } from './api'; 

const LoginProfissional = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');  // Adicione esta linha para definir o estado do erro
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
      setError('Credenciais inválidas. Por favor, tente novamente.');  // Defina a mensagem de erro
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

              {error && <p className="error-message">{error}</p>}  {/* Exibe a mensagem de erro se existir */}

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
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
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
                <a href="#!" className="text-body">Forgot password?</a>
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

export default LoginProfissional;
