// src/Header.js
import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Header.css'; // Estilos customizados

const Header = () => {
  const history = useHistory();

  useEffect(() => {
    // Carregar jQuery antes do Bootstrap
    const jQueryScript = document.createElement('script');
    jQueryScript.src = 'https://code.jquery.com/jquery-3.5.1.slim.min.js';
    jQueryScript.async = true;
    document.body.appendChild(jQueryScript);

    jQueryScript.onload = () => {
      const popperScript = document.createElement('script');
      popperScript.src = 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js';
      popperScript.async = true;
      document.body.appendChild(popperScript);

      popperScript.onload = () => {
        const bootstrapScript = document.createElement('script');
        bootstrapScript.src = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js';
        bootstrapScript.async = true;
        document.body.appendChild(bootstrapScript);
      };
    };

    return () => {
      document.body.removeChild(jQueryScript);
    };
  }, []);

  const handleCartClick = () => {
    history.push('/carrinho');
  };

  return (
    <header>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css"
      />
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Home</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn nav-link position-relative"
                  onClick={handleCartClick}
                >
                  <i className="bi bi-cart-fill"></i>
                </button>
              </li>
              <li className="nav-item dropdown">
                <button
                  className="btn nav-link dropdown-toggle"
                  id="navbarDropdown"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i>
                </button>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/login">Login</Link>
                  <Link className="dropdown-item" to="/perfil">Perfil</Link>
                  <Link className="dropdown-item" to="/avaliacoes">Avaliaçoes</Link>
                  <Link className="dropdown-item" to="/register">Cadastrar</Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
