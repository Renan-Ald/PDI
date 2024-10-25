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
import Footer from './Footer';
import AvaliacaoResultado from './AvaliacaoResultado';
import AvaliacaoView from './AvaliacaoView';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './RequestResetPassword';
import RequestResetPassword from './RequestResetPassword';
import ResetPasswordConfirm from './ResetPasswordConfirm';

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
          <Route path="/reset-password/:uidb64/:token" component={ResetPasswordConfirm} />
          <Route path="/request-reset-password" component={RequestResetPassword} />
          <Route path="/carrinho" component={Cart} />
          <Route path="/perfil" component={Profile} />
          <Route path="/avaliacoes" component={Avaliacao} />
          <Route path="/avaliador/login" component={LoginProfissional} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset/:uid/:token" component={ResetPassword} />
          <Route path="/avaliador">
            {isProfissionalAuthenticated() ? <AvaliadorArea /> : <Redirect to="/avaliador/login" />}
          </Route>
          <Route path="/avaliacao-resultado/:id" component={AvaliacaoResultado} />
          <Route path="/avaliacao-view/:id" component={AvaliacaoView} />
          {/* <Redirect to="/" /> Redireciona para a Home se a rota não for encontrada */}
        </Switch>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
