// src/Avaliador.js
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import api from './api';
import AuthContext from './AuthContext';

const Avaliador = () => {
  const { user } = useContext(AuthContext);
  const [servicos, setServicos] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (!user || !user.is_professional) {
      // Redireciona ou exibe mensagem se não for profissional
      alert('Acesso negado. Esta área é restrita a profissionais.');
      history.push('/');
      return;
    }

    const fetchServicos = async () => {
      try {
        const response = await api.get('/avaliador/servicos');
        setServicos(response.data);
      } catch (error) {
        console.error('Erro ao buscar serviços para avaliação:', error);
      }
    };

    fetchServicos();
  }, [user, history]);

  return (
    <div>
      <h2>Avaliador</h2>
      <p>Bem-vindo, {user?.nome_completo}</p>
      <h3>Serviços Disponíveis para Avaliação</h3>
      <ul>
        {servicos.map((servico) => (
          <li key={servico.id}>{servico.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default Avaliador;
