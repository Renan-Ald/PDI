// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Cart from './Cart';
import Header from './Header';
import { AuthProvider } from './AuthContext';
import Profile from './Profile';
import Avaliacao from './Avaliacao';
import LoginProfissional from './LoginProfissional';
import AvaliadorArea from './AvaliadorArea'; 
function App() {
  const isProfissionalAuthenticated = () => {
    return !!localStorage.getItem('profissionalToken');
  };

  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/carrinho" component={Cart} />
          <Route path="/perfil" component={Profile} />
          <Route path="/avaliacoes" component={Avaliacao} />
          <Route path="/avaliador/login" component={LoginProfissional} />
          <Route path="/avaliador">
            {isProfissionalAuthenticated() ? <AvaliadorArea /> : <Redirect to="/avaliador/login" />}
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
