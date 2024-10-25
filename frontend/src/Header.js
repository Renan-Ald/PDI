import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { getCartItems } from './api'; 
import logo from './img/Logo-removebg-preview.png';// Importa a função getCartItems
import './Header.css'; // Estilos customizados

const Header = () => {
  const history = useHistory();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0); // Novo estado para contar itens do carrinho

  useEffect(() => {
    document.title = "Instituto Dourado";
    const token = localStorage.getItem('access');
    if (token) {
      const isValidToken = verifyToken(token);
      if (isValidToken) {
        setIsAuthenticated(true);
        const nomeCompleto = localStorage.getItem('nome_usuario');
        if (nomeCompleto) {
          const primeiroNome = nomeCompleto.split(' ')[0]; // Pega o primeiro nome
          setUserName(primeiroNome); // Define o primeiro nome como nome do usuário
        } else {
          setUserName('Usuário');
        }
      } else {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('nome_usuario');
        setIsAuthenticated(false);
        setUserName('');
        history.push('/login');
      }
    }
  
    if (location.pathname === '/login') {
      setIsAuthenticated(false);
      setUserName('');
    }
    
    // Chama a API para buscar os itens do carrinho se o usuário estiver autenticado
    const fetchCartItems = async () => {
      try {
        const items = await getCartItems();
        setCartItemCount(items.length);
      } catch (error) {
        console.error('Erro ao buscar itens do carrinho:', error);
        setCartItemCount(0);
      }
    };
  
    if (isAuthenticated) {
      fetchCartItems();
    } else {
      setCartItemCount(0);
    }
  }, [history, location.pathname, isAuthenticated]);
  

  const verifyToken = (token) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  };

  const handleCartClick = () => {
    history.push('/carrinho');
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('nome_usuario');
    setIsAuthenticated(false);
    setUserName('');
    history.push('/login');
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
      <link rel="icon" type="image/png" src={logo} />
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <a href='/'>
          <img className="navbar-brand"  src={logo} width="100" alt="Logo" height="70" />
          </a>
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
                <Link className="nav-link" to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn nav-link position-relative"
                  onClick={handleCartClick}
                >
                  <i className="bi bi-cart-fill"></i>
                  {cartItemCount > 0 && (
                    <span className="cart-indicator">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </li>
              {isAuthenticated ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Olá, {userName}
                  </a>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className="dropdown-item" to="/perfil">Perfil</Link>
                    <Link className="dropdown-item" to="/avaliacoes">Avaliações</Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </div>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right"></i> Entrar
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
