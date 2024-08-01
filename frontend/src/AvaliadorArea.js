import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import api from './api';
import AuthContext from './AuthContext';

const Avaliador = () => {
  const { profissional } = useContext(AuthContext);
  const [servicos, setServicos] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (!profissional.token) {
      alert('Acesso negado. Esta área é restrita a profissionais.');
      history.push('/avaliador/login');
      return;
    }

    const fetchServicos = async () => {
      try {
        const response = await api.get('/avaliador/servicos', {
          headers: {
            Authorization: `Bearer ${profissional.token}`
          }
        });
        setServicos(response.data);
      } catch (error) {
        console.error('Erro ao buscar serviços para avaliação:', error);
      }
    };

    fetchServicos();
  }, [profissional, history]);

  return (
    <div>
      <h2>Avaliador</h2>
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
